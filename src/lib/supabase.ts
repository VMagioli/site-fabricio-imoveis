import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const SESSION_COOKIE_NAME = 'gestao_session_alive';

// Remove qualquer token antigo que tenha ficado persistido em localStorage
if (typeof window !== 'undefined') {
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignora caso localStorage esteja bloqueado pelo navegador
  }
}

export function markAdminBrowserSession(): void {
  if (typeof document === 'undefined') return;
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  // Cookie sem Expires/Max-Age: volátil, descartado pelo navegador ao fechar
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; SameSite=Strict${secureFlag}`;
}

export function hasAdminBrowserSession(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((part) => part.trim() === `${SESSION_COOKIE_NAME}=1`);
}

export function clearAdminBrowserSession(): void {
  if (typeof document === 'undefined') return;
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; Max-Age=0; SameSite=Strict${secureFlag}`;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Armazena a sessão apenas em sessionStorage (isolada por guia e apagada ao fechar a guia/navegador)
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
