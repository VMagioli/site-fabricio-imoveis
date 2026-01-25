
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] scale-105 hover:scale-100"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=2000")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/40 to-navy/90"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-gold font-medium tracking-[0.4em] uppercase text-xs md:text-sm mb-6 opacity-0 animate-[fadeInUp_1s_ease_forwards]">
            O sonho da casa própria ao seu alcance
          </span>
          <h1 className="font-serif text-4xl md:text-7xl text-white leading-tight mb-8 opacity-0 animate-[fadeInUp_1s_ease_0.3s_forwards]">
            Encontre seu imóvel <br />
            <span className="italic">ideal</span> no Rio de Janeiro
          </h1>
          <p className="text-pearl/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto opacity-0 animate-[fadeInUp_1s_ease_0.6s_forwards]">
            Compre seu imóvel certo no Rio, com orientação de quem conhece o mercado.
            Assessoria imobiliária para compra do imóvel que realmente faz sentido para o seu momento.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center opacity-0 animate-[fadeInUp_1s_ease_0.9s_forwards]">
            <a href="#imoveis" className="bg-gold hover:bg-gold/80 text-navy font-bold py-4 px-10 rounded-sm transition-all transform hover:scale-105 uppercase tracking-wider">
              Confira as Oportunidades
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer">
        <ChevronDown size={32} />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
