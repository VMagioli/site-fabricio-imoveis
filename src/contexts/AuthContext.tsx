import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  clearAdminBrowserSession,
  hasAdminBrowserSession,
  supabase,
} from '../lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  needsMfa: boolean;
  hasMfaEnrolled: boolean;
  currentAal: 'aal1' | 'aal2' | null;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsMfa, setNeedsMfa] = useState(false);
  const [hasMfaEnrolled, setHasMfaEnrolled] = useState(false);
  const [currentAal, setCurrentAal] = useState<'aal1' | 'aal2' | null>(null);
  const [loading, setLoading] = useState(true);

  const resetState = useCallback(() => {
    setSession(null);
    setIsAdmin(false);
    setNeedsMfa(false);
    setHasMfaEnrolled(false);
    setCurrentAal(null);
  }, []);

  const evaluateAccess = useCallback(
    async (activeSession: Session | null) => {
      if (!activeSession?.user) {
        resetState();
        setLoading(false);
        return;
      }

      // Se o navegador foi fechado e restaurou a guia, o cookie volátil não existe mais:
      // revoga a sessão imediatamente e exige novo login.
      if (!hasAdminBrowserSession()) {
        await supabase.auth.signOut({ scope: 'local' });
        clearAdminBrowserSession();
        resetState();
        setLoading(false);
        return;
      }

      setSession(activeSession);

      try {
        const [{ data: adminRow, error: adminErr }, { data: aalData }, { data: factorsData }] =
          await Promise.all([
            supabase
              .from('admin_users')
              .select('user_id')
              .eq('user_id', activeSession.user.id)
              .maybeSingle(),
            supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
            supabase.auth.mfa.listFactors(),
          ]);

        setIsAdmin(!adminErr && Boolean(adminRow));

        const verifiedTotp = (factorsData?.totp ?? []).some((f) => f.status === 'verified');
        setHasMfaEnrolled(verifiedTotp);

        const cur = (aalData?.currentLevel as 'aal1' | 'aal2' | null) ?? null;
        const next = (aalData?.nextLevel as 'aal1' | 'aal2' | null) ?? null;
        setCurrentAal(cur);
        setNeedsMfa(next === 'aal2' && cur !== 'aal2');
      } catch {
        setIsAdmin(false);
        setNeedsMfa(false);
        setHasMfaEnrolled(false);
        setCurrentAal(null);
      } finally {
        setLoading(false);
      }
    },
    [resetState]
  );

  const refreshAuth = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await evaluateAccess(data.session);
  }, [evaluateAccess]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        evaluateAccess(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        evaluateAccess(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [evaluateAccess]);

  const signOut = useCallback(async () => {
    clearAdminBrowserSession();
    await supabase.auth.signOut({ scope: 'global' });
    resetState();
  }, [resetState]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        needsMfa,
        hasMfaEnrolled,
        currentAal,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
