import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '../src/lib/supabase';
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUp, Check, Loader2 } from 'lucide-react';
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const newsletterSchema = z.string().email("Por favor, insira um e-mail válido.");

const Footer = () => {
  const [email, setEmail] = useState('');
  const [cidadeCheck, setCidadeCheck] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    // Honeypot check
    if (cidadeCheck) {
      console.log('Bot detected');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    const result = newsletterSchema.safeParse(email);
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    setStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter')
        .insert([{ email }]);

      if (error) throw error;

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Ocorreu um erro ao cadastrar. Tente novamente.');
      setStatus('error');
    }
  };

  return (
    <footer id="contato" className="bg-navy text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-royal/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Branding */}
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-8">
              <span className="font-serif text-2xl font-bold tracking-widest uppercase">
                Fabrício <span className="text-gold">Magioli</span>
              </span>
              <span className="text-[10px] text-pearl/60 tracking-[0.2em] font-light uppercase">
                Imóveis e Oportunidades
              </span>
            </div>
            <p className="text-pearl/50 text-sm leading-relaxed mb-8 font-light">
              Especialista em conectar pessoas às melhores oportunidades do mercado imobiliário carioca, com atendimento próximo, visão estratégica e uma curadoria comprometida com o que realmente importa: o seu próximo lar.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/fabriciomagioli/" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/fabricio.magioli" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-serif text-xl text-gold mb-8 italic">Links Rápidos</h4>
            <ul className="space-y-4 text-sm font-light text-pearl/60">
              <li><Link to="/" className="hover:text-gold transition-colors">Início</Link></li>
              <li><Link to="/imoveis" className="hover:text-gold transition-colors">Portfólio de Imóveis</Link></li>
              <li><a href="/#sobre" className="hover:text-gold transition-colors">Sobre</a></li>
              <li><Link to="/contato" className="hover:text-gold transition-colors">Contato</Link></li>
              <li><Link to="/politica-de-privacidade" className="hover:text-gold transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-serif text-xl text-gold mb-8 italic">Atendimento</h4>
            <ul className="space-y-6 text-sm font-light text-pearl/60">
              <li className="flex items-center gap-4">
                <Phone className="text-gold flex-shrink-0" size={18} />
                <span>+55 21 99013-2992</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-gold flex-shrink-0" size={18} />
                <span>magiolifabricio@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="font-serif text-xl text-gold mb-8 italic">News Exclusiva</h4>
            <p className="text-sm text-pearl/60 mb-6 font-light">Receba lançamentos e oportunidades off-market.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-white/5 border border-white/10 py-3 px-4 rounded-l-sm w-full outline-none focus:border-gold transition-colors text-sm disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
              />
              {/* Honeypot Field */}
              <input
                type="text"
                name="cidade_check" // Generic name
                value={cidadeCheck}
                onChange={(e) => setCidadeCheck(e.target.value)}
                className="absolute opacity-0 -z-10 w-0 h-0"
                tabIndex={-1}
                autoComplete="off"
              />
              <button
                onClick={handleSubscribe}
                disabled={status === 'loading' || status === 'success'}
                className={`bg-gold text-navy px-4 rounded-r-sm font-bold hover:bg-gold/80 transition-colors disabled:opacity-80 min-w-[60px] flex items-center justify-center`}
              >
                {status === 'loading' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : status === 'success' ? (
                  <Check size={18} />
                ) : (
                  'OK'
                )}
              </button>
            </div>
            {status === 'success' && (
              <p className="text-gold text-xs mt-2 font-light">Cadastrado com sucesso!</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-pearl/30 uppercase tracking-widest text-center md:text-left">
            © 2026 Fabrício Magioli. Todos os direitos reservados. | CRECI-RJ 106924
          </div>

          <button
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all">
              <ArrowUp size={20} />
            </div>
            <span className="text-[10px] text-pearl/30 uppercase tracking-widest font-bold">Voltar ao topo</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
