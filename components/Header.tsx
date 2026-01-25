
import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-navy py-4 shadow-xl' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col">
          <span className="font-serif text-2xl font-bold text-white tracking-widest uppercase">
            Fabrício <span className="text-gold">Magioli</span>
          </span>
          <span className="text-[10px] text-pearl/60 tracking-[0.2em] font-light uppercase">
            Imóveis e Oportunidades
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
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
            className="flex items-center gap-2 bg-gold hover:bg-gold/80 text-navy font-bold py-3 px-6 rounded-sm transition-all shadow-lg text-sm uppercase tracking-tighter"
          >
            <MessageCircle size={18} />
            Fale comigo
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-navy border-t border-white/10 transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className="flex flex-col p-6 space-y-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-lg font-medium tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5521990132992"
            className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-4 rounded-sm"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
