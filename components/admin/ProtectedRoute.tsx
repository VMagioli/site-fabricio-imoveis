import React from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isAdmin, loading, needsMfa, signOut } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-pearl flex items-center justify-center p-6">
        <Helmet>
          <title>Verificando acesso | Gestão</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <p role="status" className="text-navy font-serif text-xl animate-pulse">
          Verificando credenciais...
        </p>
      </main>
    );
  }

  if (!session || needsMfa) {
    return <Navigate to="/gestao/login" replace />;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-pearl flex items-center justify-center p-6">
        <Helmet>
          <title>Acesso Negado | Gestão</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="bg-white max-w-md w-full p-8 rounded-sm shadow-xl border-t-4 border-red-600 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-700">
            <ShieldAlert size={28} aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl text-navy">Acesso Não Autorizado</h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            Sua conta autenticou, mas não está registrada na lista de administradores autorizados (
            <code className="bg-pearl px-1.5 py-0.5 rounded text-xs">admin_users</code>).
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
          >
            <LogOut size={16} aria-hidden="true" />
            Sair da conta
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {children}
    </>
  );
};

export default ProtectedRoute;
