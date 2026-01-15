import React from 'react';
import { Award, ShieldCheck, Handshake, Quote } from 'lucide-react';
import fotoFabricio from '../foto-fabricio-frente.jpeg';

const About: React.FC = () => {
  return (
    <section id="sobre" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Portrait Column */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-4 border-pearl">
              <img 
                src={fotoFabricio}
                alt="Fabrício Magioli"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Design Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-navy/5 z-0"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 border-2 border-gold/10 z-0"></div>
            
            <div className="absolute bottom-6 -right-4 lg:-right-8 bg-navy p-6 md:p-8 shadow-2xl z-20 max-w-[300px]">
              <Quote className="text-gold mb-4" size={32} />
              <p className="text-white italic font-light text-sm leading-relaxed">
                "Minha missão é transformar a busca pelo imóvel ideal em uma experiência de absoluta segurança e sofisticação."
              </p>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-1/2">
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Expertise Carioca</span>
            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-8 leading-tight">
              Fabrício Magioli: <br />
              <span className="italic">Confiança e Discrição</span>
            </h2>
            
            <p className="text-dark/70 text-lg mb-8 leading-relaxed font-light">
              Com mais de 15 anos de atuação exclusiva no mercado de alto padrão, Fabrício consolidou-se como referência para investidores e famílias que buscam não apenas um imóvel, mas um patrimônio sólido nas áreas mais nobres do Rio de Janeiro.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="bg-pearl p-4 rounded-sm flex-shrink-0 flex items-center justify-center w-14 h-14">
                  <Award className="text-gold" size={28} />
                </div>
                <div>
                  <h4 className="text-navy font-bold text-lg mb-1 uppercase tracking-tighter">Certificação Internacional</h4>
                  <p className="text-dark/60 text-sm font-light">Expertise em transações complexas e avaliação imobiliária premium.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="bg-pearl p-4 rounded-sm flex-shrink-0 flex items-center justify-center w-14 h-14">
                  <ShieldCheck className="text-gold" size={28} />
                </div>
                <div>
                  <h4 className="text-navy font-bold text-lg mb-1 uppercase tracking-tighter">Segurança Jurídica</h4>
                  <p className="text-dark/60 text-sm font-light">Acompanhamento completo de documentos para uma compra sem riscos.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-pearl p-4 rounded-sm flex-shrink-0 flex items-center justify-center w-14 h-14">
                  <Handshake className="text-gold" size={28} />
                </div>
                <div>
                  <h4 className="text-navy font-bold text-lg mb-1 uppercase tracking-tighter">Negociação Estratégica</h4>
                  <p className="text-dark/60 text-sm font-light">Foco total na obtenção do melhor valor e condições para o cliente.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div>
                <span className="text-xs text-dark/40 uppercase tracking-widest font-bold block mb-2">Registro Profissional</span>
                <div className="inline-block border-b-2 border-gold pb-1">
                  <span className="text-navy font-bold text-lg tracking-wider">CRECI-RJ 00.000-F</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;