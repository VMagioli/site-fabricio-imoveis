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
      
      {/* Experience Banner */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-serif text-gold mb-2">15+</span>
              <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Anos de Expertise</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-serif text-gold mb-2">R$ 2B+</span>
              <span className="text-xs text-white/40 uppercase tracking-[0.2em]">VGV Negociado</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-serif text-gold mb-2">500+</span>
              <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Imóveis no Portfólio</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-serif text-gold mb-2">100%</span>
              <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Discrição Garantida</span>
            </div>
          </div>
        </div>
      </section>

      <About />

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-navy rounded-sm p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
             <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
             <div className="max-w-3xl">
               <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Consultoria Premium</span>
               <h2 className="font-serif text-4xl md:text-6xl text-white mb-10 leading-tight">
                 Pronto para o seu <br />
                 próximo <span className="italic text-gold">grande capítulo</span>?
               </h2>
               <p className="text-pearl/60 text-lg mb-12 font-light">
                 Deixe seu contato para uma reunião estratégica e descubra as melhores oportunidades off-market do Rio de Janeiro.
               </p>
               <div className="flex flex-col md:flex-row gap-6 justify-center">
                 <button className="bg-gold hover:bg-gold/80 text-navy font-bold py-5 px-12 rounded-sm transition-all transform hover:scale-105 uppercase tracking-widest text-sm shadow-xl">
                   Entrar em Contato Agora
                 </button>
                 <button className="border border-white/20 hover:bg-white/5 text-white font-bold py-5 px-12 rounded-sm transition-all uppercase tracking-widest text-sm">
                   Ver Novos Lançamentos
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
