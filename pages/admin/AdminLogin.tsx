import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import {
  clearAdminBrowserSession,
  markAdminBrowserSession,
  supabase,
} from '../../src/lib/supabase';
import { useAuth } from '../../src/contexts/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { session, isAdmin, needsMfa, loading, refreshAuth, signOut } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [mfaCode, setMfaCode] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [mfaFailedAttempts, setMfaFailedAttempts] = useState(0);
  const [mfaLockedUntil, setMfaLockedUntil] = useState<number>(0);

  useEffect(() => {
    if (!loading && session && isAdmin && !needsMfa) {
      navigate('/gestao', { replace: true });
    } else if (!loading && session && needsMfa) {
      setStep('mfa');
      supabase.auth.mfa.listFactors().then(({ data }) => {
        const verified = data?.totp?.find((f) => f.status === 'verified');
        if (verified) setMfaFactorId(verified.id);
      });
    }
  }, [loading, session, isAdmin, needsMfa, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const now = Date.now();
    if (lockedUntil > now) {
      const remaining = Math.ceil((lockedUntil - now) / 1000);
      setErrorMessage(`Muitas tentativas. Aguarde ${remaining}s para tentar novamente.`);
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Informe e-mail e senha.');
      return;
    }

    setSubmitting(true);
    try {
      // Marca o cookie volátil antes do signInWithPassword para evitar corrida com onAuthStateChange
      markAdminBrowserSession();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        clearAdminBrowserSession();
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setFailedAttempts(0);
          setErrorMessage('Muitas tentativas inválidas. Aguarde 60 segundos.');
        } else {
          setErrorMessage('E-mail ou senha inválidos.');
        }
        return;
      }

      setFailedAttempts(0);

      // Verifica se 2FA (TOTP) está ativo para esta conta
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.nextLevel === 'aal2' && aalData?.currentLevel !== 'aal2') {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const verified = factors?.totp?.find((f) => f.status === 'verified');
        if (verified) {
          setMfaFactorId(verified.id);
          setStep('mfa');
          return;
        }
      }

      markAdminBrowserSession();
      await refreshAuth();
      navigate('/gestao', { replace: true });
    } catch {
      setErrorMessage('Erro ao conectar ao servidor de autenticação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const now = Date.now();
    if (mfaLockedUntil > now) {
      const remaining = Math.ceil((mfaLockedUntil - now) / 1000);
      setErrorMessage(`Muitas tentativas de 2FA. Aguarde ${remaining}s para tentar novamente.`);
      return;
    }

    const cleanCode = mfaCode.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setErrorMessage('Digite o código de 6 dígitos do aplicativo autenticador.');
      return;
    }

    setSubmitting(true);
    try {
      let factorId = mfaFactorId;
      if (!factorId) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        factorId = factors?.totp?.find((f) => f.status === 'verified')?.id ?? null;
      }

      if (!factorId) {
        setErrorMessage('Fator 2FA não encontrado. Faça login novamente.');
        setStep('credentials');
        return;
      }

      const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeErr || !challengeData) {
        setErrorMessage('Não foi possível iniciar a verificação 2FA. Tente novamente.');
        return;
      }

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: cleanCode,
      });

      if (verifyErr) {
        const nextMfaAttempts = mfaFailedAttempts + 1;
        setMfaFailedAttempts(nextMfaAttempts);
        if (nextMfaAttempts >= MAX_ATTEMPTS) {
          setMfaLockedUntil(Date.now() + LOCKOUT_MS);
          setMfaFailedAttempts(0);
          setErrorMessage('Muitas tentativas de código 2FA inválidas. Aguarde 60 segundos.');
        } else {
          setErrorMessage('Código inválido ou expirado. Confira no Google Authenticator.');
        }
        return;
      }

      setMfaFailedAttempts(0);
      markAdminBrowserSession();
      await refreshAuth();
      navigate('/gestao', { replace: true });
    } catch {
      setErrorMessage('Erro ao verificar código 2FA.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelMfa = async () => {
    await signOut();
    setMfaCode('');
    setMfaFactorId(null);
    setErrorMessage('');
    setStep('credentials');
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center p-6">
      <Helmet>
        <title>Acesso Restrito | Gestão Fabrício Magioli</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md bg-white rounded-sm shadow-2xl border-t-4 border-gold p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-navy text-gold flex items-center justify-center mb-4">
            {step === 'mfa' ? <ShieldCheck size={24} aria-hidden="true" /> : <Lock size={22} aria-hidden="true" />}
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-navy">
            {step === 'mfa' ? 'Verificação em 2 Etapas' : 'Painel de Gestão'}
          </h1>
          <p className="text-xs text-gray-600 uppercase tracking-widest mt-2">
            {step === 'mfa'
              ? 'Digite o código do Google Authenticator'
              : 'Área exclusiva — Fabrício Magioli'}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@dominio.com"
                  disabled={submitting}
                  className="w-full bg-pearl border border-gray-300 rounded-sm py-3 pl-10 pr-4 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                  className="w-full bg-pearl border border-gray-300 rounded-sm py-3 pl-10 pr-11 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-navy p-1"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-sm font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3.5 rounded-sm uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Entrando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>

            <p className="text-[11px] text-gray-600 text-center leading-relaxed">
              Por segurança, sua sessão fica restrita a esta guia e é encerrada automaticamente ao fechar a guia ou o navegador.
            </p>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="admin-mfa-code" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                Código de 6 dígitos
              </label>
              <input
                id="admin-mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                disabled={submitting}
                className="w-full bg-pearl border border-gray-300 rounded-sm py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-bold text-navy focus:outline-none focus:border-gold-dark"
              />
            </div>

            {errorMessage && (
              <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-sm font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || mfaCode.length !== 6}
              className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3.5 rounded-sm uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Verificando...
                </>
              ) : (
                'Confirmar Código'
              )}
            </button>

            <button
              type="button"
              onClick={handleCancelMfa}
              className="w-full text-xs text-gray-600 hover:text-navy underline py-1"
            >
              Voltar e usar outra conta
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-navy uppercase tracking-wider"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Voltar ao site público
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
