import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';

const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'));

const RouteFallback: React.FC = () => (
  <main id="conteudo-principal" className="min-h-screen flex items-center justify-center bg-pearl pt-32 pb-20">
    <p className="text-navy font-serif text-xl">Carregando...</p>
  </main>
);

const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/gestao');

  return (
    <div className="min-h-screen bg-pearl selection:bg-gold/30 selection:text-navy">
      {!isAdminRoute && (
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-gold focus:text-navy focus:px-4 focus:py-2 focus:font-bold focus:rounded-sm"
        >
          Pular para o conteúdo principal
        </a>
      )}
      {!isAdminRoute && <Header />}
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imoveis" element={<Properties />} />
          <Route path="/imoveis/:neighborhoodSlug" element={<Properties />} />
          <Route path="/imovel/:slug" element={<PropertyDetails />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/gestao/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
