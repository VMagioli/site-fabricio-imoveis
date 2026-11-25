import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Apenas a Home ("/") e fichas de imóvel ("/imovel/...") têm topo escuro;
  // páginas de fundo claro (/imoveis, /contato, /politica-de-privacidade) usam header sólido.
  const hasDarkHero =
    location.pathname === '/' || location.pathname.startsWith('/imovel/');
  const useSolidBg = isScrolled || !hasDarkHero || mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha menu mobile ao navegar para outra rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Fecha menu mobile ao pressionar Esc e devolve foco ao botão
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useSolidBg ? 'bg-navy py-4 shadow-xl' : 'bg-navy/75 md:bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col" aria-label="Fabrício Magioli — Página inicial">
          <span className="font-serif text-2xl font-bold text-white tracking-widest uppercase">
            Fabrício <span className="text-gold">Magioli</span>
          </span>
          <span className="text-[10px] text-pearl/85 tracking-[0.2em] font-light uppercase">
            Imóveis e Oportunidades
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-white hover:text-gold transition-colors text-sm font-medium tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5521990132992"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold py-3 px-6 rounded-sm transition-all shadow-lg text-sm uppercase tracking-tighter"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Fale comigo
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          className="md:hidden text-white p-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={32} aria-hidden="true" /> : <Menu size={32} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação móvel"
          className="md:hidden absolute top-full left-0 w-full bg-navy border-t border-white/10 shadow-2xl"
        >
          <div className="flex flex-col p-6 space-y-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-gold text-lg font-medium tracking-wide uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5521990132992"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-4 rounded-sm"
            >
              <MessageCircle size={20} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
