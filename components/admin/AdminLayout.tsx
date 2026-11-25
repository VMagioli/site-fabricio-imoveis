import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, subtitle, actions, children }) => {
  const { user, hasMfaEnrolled, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/gestao/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-pearl flex flex-col">
      {/* Top Bar */}
      <header className="bg-navy text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/gestao" className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-widest uppercase">
              Fabrício <span className="text-gold">Magioli</span>
            </span>
            <span className="text-[11px] text-pearl/80 tracking-[0.2em] uppercase">
              Painel de Gestão
            </span>
          </Link>

          <div className="flex items-center flex-wrap gap-3">
            {hasMfaEnrolled ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-sm">
                <ShieldCheck size={14} aria-hidden="true" />
                2FA Ativo
              </span>
            ) : (
              <Link
                to="/gestao?aba=seguranca"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 px-3 py-1.5 rounded-sm hover:bg-amber-500/30 transition-colors"
              >
                <ShieldAlert size={14} aria-hidden="true" />
                Ativar 2FA
              </Link>
            )}

            <span className="hidden md:inline text-xs text-pearl/75">{user?.email}</span>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pearl/90 hover:text-gold border border-white/20 px-3 py-2 rounded-sm transition-colors"
            >
              Ver site
              <ExternalLink size={14} aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-red-600 text-white px-3.5 py-2 rounded-sm transition-colors"
            >
              <LogOut size={14} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-navy">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>

      {/* Main Content */}
      <main id="conteudo-principal" className="container mx-auto px-6 py-8 flex-1">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
