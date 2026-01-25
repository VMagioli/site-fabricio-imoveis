import React from 'react';
import Hero from '../components/Hero';
import QuickSearch from '../components/QuickSearch';
import PropertyGrid from '../components/PropertyGrid';
import About from '../components/About';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <QuickSearch />
      <PropertyGrid />

      {/* Infinite Marquee Benefits - Replaces Statistics */}
      <section className="bg-navy py-12 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10 w-full overflow-hidden">
          <div className="flex w-max animate-scroll whitespace-nowrap">
            {/* Original List */}
            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16">
              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Realize o sonho da casa própria</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Renda familiar a partir de R$ 2.000</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Use seu FGTS na entrada</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Financiamento Facilitado</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Subsídio do Governo</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Aprovação Rápida de Crédito</span>
            </div>

            {/* Duplicate List */}
            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16">
              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Realize o sonho da casa própria</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Renda familiar a partir de R$ 2.000</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Use seu FGTS na entrada</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Financiamento Facilitado</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Subsídio do Governo</span>

              <span className="text-xl md:text-2xl text-gold font-serif mx-4">•</span>
              <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">Aprovação Rápida de Crédito</span>
            </div>
          </div>
        </div>
      </section>

      <About />


    </main>
  );
};

export default Home;
