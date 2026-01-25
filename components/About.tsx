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
                "Minha missão é ajudar você a sair do aluguel e conquistar o seu lar com segurança, confiança e as melhores condições."
              </p>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-1/2">
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Expertise Carioca</span>
            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-8 leading-tight">
              Fabrício Magioli: <br />
              <span className="italic">Compromisso com o seu sonho</span>
            </h2>
            
            <p className="text-dark/70 text-lg mb-8 leading-relaxed font-light">
              Comprar um imóvel é mais do que uma transação: é um passo de vida. E é por isso que atuo com verdade, presença e comprometimento em cada atendimento. Eu sei que, para muitas famílias, essa decisão representa a realização de um sonho e o início de um novo capítulo.<br />
              <br />Com um atendimento próximo, transparente e focado no que realmente importa, ajudo quem buscam sair do aluguel, conquistar sua independência ou encontrar um novo lar para a família crescer.<br />
              <br />Meu trabalho é te guiar com clareza, segurança e respeito ao orçamento, buscando sempre as melhores oportunidades do mercado.

            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="bg-pearl p-4 rounded-sm flex-shrink-0 flex items-center justify-center w-14 h-14">
                  <Award className="text-gold" size={28} />
                </div>
                <div>
                  <h4 className="text-navy font-bold text-lg mb-1 uppercase tracking-tighter">Especialista na Zona Oeste do Rio de Janeiro</h4>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="bg-pearl p-4 rounded-sm flex-shrink-0 flex items-center justify-center w-14 h-14">
                  <ShieldCheck className="text-gold" size={28} />
                </div>
                <div>
                  <h4 className="text-navy font-bold text-lg mb-1 uppercase tracking-tighter">Atendimento consultivo e humanizado</h4>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div>
                <span className="text-xs text-dark/40 uppercase tracking-widest font-bold block mb-2">Registro Profissional</span>
                <div className="inline-block border-b-2 border-gold pb-1">
                  <span className="text-navy font-bold text-lg tracking-wider">CRECI-RJ 106924</span>
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