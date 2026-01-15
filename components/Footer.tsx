
import React from 'react';
import { Instagram, Linkedin, Facebook, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
                Luxury Real Estate Specialist
              </span>
            </div>
            <p className="text-pearl/50 text-sm leading-relaxed mb-8 font-light">
              Especialista em realizar sonhos e consolidar patrimônios através da curadoria imobiliária de luxo no Rio de Janeiro.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl text-gold mb-8 italic">Links Rápidos</h4>
            <ul className="space-y-4 text-sm font-light text-pearl/60">
              <li><a href="#" className="hover:text-gold transition-colors">Início</a></li>
              <li><a href="#imoveis" className="hover:text-gold transition-colors">Portfólio de Imóveis</a></li>
              <li><a href="#sobre" className="hover:text-gold transition-colors">Trajetória Profissional</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-serif text-xl text-gold mb-8 italic">Atendimento</h4>
            <ul className="space-y-6 text-sm font-light text-pearl/60">
              <li className="flex items-start gap-4">
                <MapPin className="text-gold mt-1 flex-shrink-0" size={18} />
                <span>Av. Afrânio de Melo Franco, 290<br />Leblon, Rio de Janeiro - RJ</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-gold flex-shrink-0" size={18} />
                <span>+55 21 99999-9999</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-gold flex-shrink-0" size={18} />
                <span>contato@fabriciomagioli.com.br</span>
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
                className="bg-white/5 border border-white/10 py-3 px-4 rounded-l-sm w-full outline-none focus:border-gold transition-colors text-sm"
              />
              <button className="bg-gold text-navy px-4 rounded-r-sm font-bold hover:bg-gold/80 transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-pearl/30 uppercase tracking-widest text-center md:text-left">
            © 2024 Fabrício Magioli. Todos os direitos reservados. | CRECI-RJ 00.000-F
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
