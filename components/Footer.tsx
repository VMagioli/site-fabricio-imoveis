import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Instagram, Facebook, Phone, Mail, ArrowUp, Check, Loader2 } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [cidadeCheck, setCidadeCheck] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (cidadeCheck) {
      setStatus('success');
      setFeedbackMessage('Cadastrado com sucesso!');
      setTimeout(() => {
        setStatus('idle');
        setFeedbackMessage('');
      }, 3000);
      return;
    }

    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setFeedbackMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const { error } = await supabase
        .from('newsletter')
        .insert([{ email: trimmedEmail }]);

      if (error) throw error;

      setStatus('success');
      setFeedbackMessage('Cadastrado com sucesso!');
      setEmail('');
      setTimeout(() => {
        setStatus('idle');
        setFeedbackMessage('');
      }, 4000);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setStatus('error');
      setFeedbackMessage('Ocorreu um erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <footer id="contato" className="bg-navy text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background decorative pattern */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-royal/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Branding */}
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-8">
              <span className="font-serif text-2xl font-bold tracking-widest uppercase">
                Fabrício <span className="text-gold">Magioli</span>
              </span>
              <span className="text-xs text-pearl/80 tracking-[0.2em] font-light uppercase">
                Imóveis e Oportunidades
              </span>
            </div>
            <p className="text-pearl/80 text-sm leading-relaxed mb-8 font-light">
              Especialista em conectar pessoas às melhores oportunidades do mercado imobiliário carioca, com atendimento próximo, visão estratégica e uma curadoria comprometida com o que realmente importa: o seu próximo lar.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/fabriciomagioli/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Fabrício Magioli"
                className="w-10 h-10 border border-white/25 rounded-full flex items-center justify-center text-white hover:bg-gold hover:text-navy hover:border-gold transition-all"
              >
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/fabricio.magioli"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Fabrício Magioli"
                className="w-10 h-10 border border-white/25 rounded-full flex items-center justify-center text-white hover:bg-gold hover:text-navy hover:border-gold transition-all"
              >
                <Facebook size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h2 className="font-serif text-xl text-gold mb-8 italic">Links Rápidos</h2>
            <ul className="space-y-4 text-sm font-light text-pearl/85">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="hover:text-gold transition-colors">
                  Portfólio de Imóveis
                </Link>
              </li>
              <li>
                <Link to="/#sobre" className="hover:text-gold transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-gold transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="hover:text-gold transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h2 className="font-serif text-xl text-gold mb-8 italic">Atendimento</h2>
            <ul className="space-y-6 text-sm font-light text-pearl/85">
              <li className="flex items-center gap-4">
                <Phone className="text-gold flex-shrink-0" size={18} aria-hidden="true" />
                <a href="tel:+5521990132992" className="hover:text-gold transition-colors">
                  +55 21 99013-2992
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-gold flex-shrink-0" size={18} aria-hidden="true" />
                <a href="mailto:magiolifabricio@gmail.com" className="hover:text-gold transition-colors">
                  magiolifabricio@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h2 className="font-serif text-xl text-gold mb-8 italic">News Exclusiva</h2>
            <p className="text-sm text-pearl/85 mb-6 font-light">
              Receba lançamentos e oportunidades off-market.
            </p>
            <form onSubmit={handleSubscribe} aria-label="Cadastro na newsletter" noValidate>
              <div className="flex">
                <label htmlFor="newsletter-email" className="sr-only">
                  Seu melhor e-mail
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Seu melhor e-mail"
                  className="bg-white/10 border border-white/25 py-3 px-4 rounded-l-sm w-full text-white placeholder:text-pearl/70 outline-none focus:border-gold transition-colors text-sm disabled:opacity-50"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setFeedbackMessage('');
                    }
                  }}
                  disabled={status === 'loading' || status === 'success'}
                />
                {/* Honeypot Field hidden from accessibility tree */}
                <div hidden aria-hidden="true">
                  <input
                    type="text"
                    name="cidade_check"
                    value={cidadeCheck}
                    onChange={(e) => setCidadeCheck(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Inscrever e-mail na newsletter"
                  disabled={status === 'loading' || status === 'success'}
                  className="bg-gold text-navy px-4 rounded-r-sm font-bold hover:bg-gold/90 transition-colors disabled:opacity-80 min-w-[60px] flex items-center justify-center"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  ) : status === 'success' ? (
                    <Check size={18} aria-hidden="true" />
                  ) : (
                    'OK'
                  )}
                </button>
              </div>
              {feedbackMessage && (
                <p
                  role={status === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  className={`text-xs mt-2 font-medium ${status === 'error' ? 'text-red-300' : 'text-gold'}`}
                >
                  {feedbackMessage}
                </p>
              )}
              <p className="text-[11px] text-pearl/75 mt-3 leading-relaxed">
                Seu e-mail é usado apenas para envio de novidades e lançamentos, podendo pedir remoção a qualquer momento. Veja a{' '}
                <Link to="/politica-de-privacidade" className="underline hover:text-gold">
                  Política de Privacidade
                </Link>
                .
              </p>
            </form>
          </div>
        </div>

        {/* SEO Internal Links — Regiões Atendidas */}
        <div className="border-t border-white/10 pt-8 pb-8">
          <p className="text-xs text-gold uppercase tracking-widest font-bold mb-4">
            Imóveis por Região no RJ
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-pearl/80">
            <Link to="/imoveis/campo-grande" className="hover:text-gold transition-colors">
              Campo Grande
            </Link>
            <Link to="/imoveis/bangu" className="hover:text-gold transition-colors">
              Bangu
            </Link>
            <Link to="/imoveis/recreio-dos-bandeirantes" className="hover:text-gold transition-colors">
              Recreio dos Bandeirantes
            </Link>
            <Link to="/imoveis/barra-da-tijuca" className="hover:text-gold transition-colors">
              Barra da Tijuca
            </Link>
            <Link to="/imoveis/barra-olimpica" className="hover:text-gold transition-colors">
              Barra Olímpica
            </Link>
            <Link to="/imoveis/santa-cruz" className="hover:text-gold transition-colors">
              Santa Cruz
            </Link>
            <Link to="/imoveis/niteroi" className="hover:text-gold transition-colors">
              Niterói
            </Link>
            <Link to="/imoveis/centro-e-porto-maravilha" className="hover:text-gold transition-colors">
              Centro e Porto Maravilha
            </Link>
            <Link to="/imoveis/zona-oeste" className="hover:text-gold transition-colors">
              Zona Oeste
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/15 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xs text-pearl/75 uppercase tracking-widest text-center md:text-left">
            © 2026 Fabrício Magioli. Todos os direitos reservados. | CRECI-RJ 106924
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            className="group flex flex-col items-center gap-2 text-pearl/80 hover:text-gold transition-colors"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all">
              <ArrowUp size={20} aria-hidden="true" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold">Voltar ao topo</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
