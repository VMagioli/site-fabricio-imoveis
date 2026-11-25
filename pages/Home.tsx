import React from 'react';
import Hero from '../components/Hero';
import QuickSearch from '../components/QuickSearch';
import PropertyGrid from '../components/PropertyGrid';
import About from '../components/About';
import FaqSection from '../components/FaqSection';
import SEO from '../components/SEO';

const BENEFITS = [
  'Realize o sonho da casa própria',
  'Renda familiar a partir de R$ 2.000',
  'Use seu FGTS na entrada',
  'Financiamento Facilitado',
  'Subsídio do Governo',
  'Aprovação Rápida de Crédito',
];

const Home: React.FC = () => {
  return (
    <main id="conteudo-principal">
      <SEO
        title="Fabrício Magioli | Imóveis no Rio de Janeiro"
        description="Saia do aluguel agora! Encontre apartamentos e casas no Rio de Janeiro com financiamento facilitado, uso de FGTS e subsídios do governo."
      />
      <Hero />
      <QuickSearch />
      <PropertyGrid />

      {/* Infinite Marquee Benefits */}
      <section
        aria-label="Diferenciais de financiamento e atendimento"
        className="bg-navy py-12 relative overflow-hidden border-y border-white/10"
      >
        <div className="absolute inset-0 carbon-pattern opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 w-full overflow-hidden">
          <div className="flex w-max animate-scroll whitespace-nowrap">
            {/* Primary List */}
            <ul className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-8 md:gap-16">
                  <span className="text-xl md:text-2xl text-gold font-serif" aria-hidden="true">
                    •
                  </span>
                  <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Duplicate List for seamless visual loop */}
            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16" aria-hidden="true">
              {BENEFITS.map((benefit) => (
                <div key={`dup-${benefit}`} className="flex items-center gap-8 md:gap-16">
                  <span className="text-xl md:text-2xl text-gold font-serif">•</span>
                  <span className="text-xl md:text-2xl text-pearl font-light tracking-wide">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <About />
      <FaqSection />
    </main>
  );
};

export default Home;
