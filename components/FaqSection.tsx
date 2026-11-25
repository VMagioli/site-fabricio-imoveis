import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Qual é a renda familiar mínima para financiar um imóvel no Rio de Janeiro?',
    answer:
      'É possível iniciar o processo de financiamento imobiliário com renda familiar a partir de R$ 2.000, podendo somar a renda de até mais de um participante (cônjuge, familiares ou amigos) para aumentar o valor aprovado e reduzir a entrada.',
  },
  {
    question: 'Posso usar o meu FGTS na entrada do imóvel?',
    answer:
      'Sim. O saldo do FGTS pode ser utilizado para abater parte ou até o valor total da entrada, reduzir o saldo devedor ou diminuir o valor das parcelas, desde que o comprador atenda às regras vigentes da Caixa Econômica Federal.',
  },
  {
    question: 'Como funciona o subsídio do governo na compra do primeiro imóvel?',
    answer:
      'O subsídio é um desconto concedido pelo governo federal em programas habitacionais (como o Minha Casa, Minha Vida) que reduz diretamente o valor do imóvel financiado e não precisa ser devolvido. O valor varia conforme a faixa de renda familiar e a região do imóvel.',
  },
  {
    question: 'Quais regiões do Rio de Janeiro o Fabrício Magioli atende?',
    answer:
      'Atuo com forte especialização na Zona Oeste do Rio de Janeiro (Campo Grande, Bangu, Santa Cruz, Recreio, Barra da Tijuca e Barra Olímpica), além de oportunidades selecionadas na Baixada Fluminense(Nova Iguaçu e Duque de Caxias), Zona Norte, Zona Sul, Centro, Porto Maravilha e Niterói.',
  },
  {
    question: 'Como funciona a aprovação de crédito e o agendamento de visita?',
    answer:
      'Fazemos uma análise consultiva gratuita do seu perfil para simular entrada, parcelas e potencial de aprovação antes mesmo da visita. Assim, você visita apenas imóveis que realmente fazem sentido para o seu momento e orçamento.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="perguntas-frequentes" className="py-24 bg-pearl border-t border-gray-200/70">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-14">
          <span className="text-gold-dark font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            Tire Suas Dúvidas
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-navy mb-4">
            Perguntas Frequentes
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto" aria-hidden="true" />
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div
                key={item.question}
                className="bg-white rounded-sm border border-gray-200/80 shadow-sm overflow-hidden"
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 text-navy font-bold text-base md:text-lg hover:bg-pearl/60 transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className={`text-gold-dark flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 pt-1 text-gray-700 leading-relaxed text-base"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
