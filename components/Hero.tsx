import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[640px] w-full flex items-center justify-center overflow-hidden bg-navy">
      {/* Optimized LCP Hero Image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/hero-rj-desktop.webp"
          srcSet="/images/hero-rj-mobile.webp 768w, /images/hero-rj-desktop.webp 1600w"
          sizes="100vw"
          width={1600}
          height={1068}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/50 to-navy/90" />
      </div>

      {/* Content — Immediately visible for fast LCP & Speed Index */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-gold font-medium tracking-[0.35em] uppercase text-xs md:text-sm mb-6">
            O sonho da casa própria ao seu alcance
          </span>
          <h1 className="font-serif text-4xl md:text-7xl text-white leading-tight mb-8">
            Encontre seu imóvel <br />
            <span className="italic">ideal</span> no Rio de Janeiro
          </h1>
          <p className="text-pearl/90 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
            Compre seu imóvel certo no Rio, com orientação de quem conhece o mercado.
            Assessoria imobiliária para compra do imóvel que realmente faz sentido para o seu momento.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#imoveis"
              className="bg-gold hover:bg-gold/90 text-navy font-bold py-4 px-10 rounded-sm transition-transform hover:scale-105 uppercase tracking-wider shadow-lg"
            >
              Confira as Oportunidades
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#imoveis"
        aria-label="Rolar para imóveis em destaque"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 hover:text-gold transition-colors animate-bounce motion-reduce:animate-none p-2"
      >
        <ChevronDown size={32} aria-hidden="true" />
      </a>
    </section>
  );
};

export default Hero;
