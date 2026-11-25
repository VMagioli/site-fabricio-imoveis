export interface NeighborhoodSEO {
  slug: string;
  name: string;
  filterType: 'location' | 'zone';
  filterValue: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
}

export const NEIGHBORHOODS: NeighborhoodSEO[] = [
  {
    slug: 'campo-grande',
    name: 'Campo Grande',
    filterType: 'location',
    filterValue: 'Campo Grande',
    title: 'Imóveis à Venda em Campo Grande RJ | Apartamentos e Casas',
    h1: 'Imóveis à Venda em Campo Grande, RJ',
    metaDescription:
      'Encontre apartamentos, casas e terrenos em Campo Grande, Zona Oeste do RJ, com financiamento facilitado, uso de FGTS e subsídio. Atendimento com Fabrício Magioli.',
    intro:
      'Campo Grande é o principal polo da Zona Oeste do Rio de Janeiro, combinando comércio forte (West Shopping e ParkShopping Campo Grande), fácil acesso à Avenida Brasil e estação de trem com opções acessíveis de apartamentos e casas para sair do aluguel.',
    highlights: [
      'Apartamentos com uso de FGTS e subsídio do governo',
      'Próximo ao West Shopping, ParkShopping e comércio central',
      'Opções de 2 e 3 quartos em condomínios com lazer completo',
    ],
  },
  {
    slug: 'bangu',
    name: 'Bangu',
    filterType: 'location',
    filterValue: 'Bangu',
    title: 'Imóveis à Venda em Bangu RJ | Apartamentos e Casas',
    h1: 'Imóveis à Venda em Bangu, RJ',
    metaDescription:
      'Confira apartamentos e casas à venda em Bangu, Rio de Janeiro, com entrada facilitada e uso do FGTS. Assessoria completa de crédito imobiliário.',
    intro:
      'Bangu oferece infraestrutura consolidada, transporte abundante (trem, ônibus e TransOlímpica) e o Bangu Shopping, sendo uma das melhores escolhas de custo-benefício para famílias que buscam o primeiro imóvel na Zona Oeste.',
    highlights: [
      'Excelente custo-benefício para compra do primeiro imóvel',
      'Fácil mobilidade pela Av. Brasil, trem e TransOlímpica',
      'Condomínios com segurança 24h e área de lazer',
    ],
  },
  {
    slug: 'recreio-dos-bandeirantes',
    name: 'Recreio dos Bandeirantes',
    filterType: 'location',
    filterValue: 'Recreio dos Bandeirantes',
    title: 'Imóveis à Venda no Recreio dos Bandeirantes RJ',
    h1: 'Imóveis no Recreio dos Bandeirantes, RJ',
    metaDescription:
      'Apartamentos e casas no Recreio dos Bandeirantes, Rio de Janeiro. Qualidade de vida perto da praia com assessoria consultiva para aprovação de crédito.',
    intro:
      'O Recreio dos Bandeirantes une qualidade de vida, praias preservadas, ruas arborizadas e excelente oferta de escolas e shoppings, com empreendimentos modernos para morar ou investir no Rio de Janeiro.',
    highlights: [
      'Qualidade de vida a poucos minutos das praias da Zona Sudoeste',
      'Empreendimentos modernos com infraestrutura completa',
      'Alto potencial de valorização imobiliária',
    ],
  },
  {
    slug: 'barra-da-tijuca',
    name: 'Barra da Tijuca',
    filterType: 'location',
    filterValue: 'Barra da Tijuca',
    title: 'Imóveis à Venda na Barra da Tijuca RJ',
    h1: 'Imóveis na Barra da Tijuca, RJ',
    metaDescription:
      'Descubra apartamentos e lançamentos na Barra da Tijuca, RJ. Condomínios completos com assessoria personalizada de Fabrício Magioli (CRECI-RJ 106924).',
    intro:
      'Referência em infraestrutura, mobilidade pelo metrô e BRT, praias e grandes shoppings, a Barra da Tijuca reúne condomínios com lazer de clube e excelentes oportunidades tanto para moradia quanto para investimento.',
    highlights: [
      'Condomínios com lazer estilo resort e segurança reforçada',
      'Acesso ao metrô Jardim Oceânico, BRT e Linha Amarela',
      'Ampla rede de serviços, hospitais e shoppings',
    ],
  },
  {
    slug: 'barra-olimpica',
    name: 'Barra Olímpica',
    filterType: 'location',
    filterValue: 'Barra Olímpica',
    title: 'Imóveis à Venda na Barra Olímpica RJ | Lançamentos e Prontos',
    h1: 'Imóveis na Barra Olímpica, RJ',
    metaDescription:
      'Apartamentos na planta e prontos na Barra Olímpica, Rio de Janeiro, com financiamento facilitado e uso de FGTS. Fale com Fabrício Magioli.',
    intro:
      'A Barra Olímpica é a região que mais cresce no Rio de Janeiro, com condomínios planejados, BRT TransCarioca e TransOlímpica, além de condições facilitadas de pagamento para sair do aluguel.',
    highlights: [
      'Região planejada em forte valorização no RJ',
      'Lançamentos e imóveis prontos com entrada parcelada',
      'Fácil acesso à Barra da Tijuca, Jacarepaguá e Recreio',
    ],
  },
  {
    slug: 'santa-cruz',
    name: 'Santa Cruz',
    filterType: 'location',
    filterValue: 'Santa Cruz',
    title: 'Imóveis à Venda em Santa Cruz RJ | Casas e Apartamentos',
    h1: 'Imóveis à Venda em Santa Cruz, RJ',
    metaDescription:
      'Casas, terrenos e apartamentos à venda em Santa Cruz, RJ, com financiamento Caixa, FGTS e subsídios habitacionais.',
    intro:
      'Santa Cruz apresenta ótimas oportunidades de casas, apartamentos e terrenos com parcelas que cabem no bolso, integrando BRT, estação ferroviária e comércio local em expansão.',
    highlights: [
      'Imóveis acessíveis com subsídio habitacional e FGTS',
      'Opções de casas amplas, apartamentos e terrenos',
      'Integração direta com BRT e ramal ferroviário',
    ],
  },
  {
    slug: 'niteroi',
    name: 'Niterói',
    filterType: 'location',
    filterValue: 'Niterói',
    title: 'Imóveis à Venda em Niterói RJ | Apartamentos e Lançamentos',
    h1: 'Imóveis à Venda em Niterói, RJ',
    metaDescription:
      'Apartamentos e lançamentos em Niterói com vista para a Baía de Guanabara e fácil acesso às barcas e Ponte Rio-Niterói. Consulte Fabrício Magioli.',
    intro:
      'Niterói se destaca pela alta qualidade de vida, acesso rápido ao Centro do Rio pelas barcas e Ponte Rio-Niterói, e empreendimentos contemporâneos com lazer completo.',
    highlights: [
      'Localização estratégica próxima às barcas e principais vias',
      'Condomínios modernos com coworking, rooftop e lazer completo',
      'Forte demanda para moradia e rentabilidade em locação',
    ],
  },
  {
    slug: 'centro-e-porto-maravilha',
    name: 'Centro e Porto Maravilha',
    filterType: 'location',
    filterValue: 'Zona Portuária e Centro',
    title: 'Imóveis no Centro e Porto Maravilha RJ | Lançamentos',
    h1: 'Imóveis no Centro e Porto Maravilha, RJ',
    metaDescription:
      'Apartamentos e lançamentos no Centro e Porto Maravilha do Rio de Janeiro com VLT, metrô e incentivo habitacional. Simule seu financiamento.',
    intro:
      'O Porto Maravilha e o Centro do Rio passam pela maior revitalização urbana da cidade, oferecendo apartamentos modernos integrados ao VLT, metrô e barcas com condições facilitadas de compra.',
    highlights: [
      'Mobilidade completa com VLT, metrô e rodoviária',
      'Empreendimentos novos no eixo revitalizado do Porto Maravilha',
      'Excelente opção para morar perto do trabalho ou investir',
    ],
  },
  {
    slug: 'zona-oeste',
    name: 'Zona Oeste',
    filterType: 'zone',
    filterValue: 'Zona Oeste',
    title: 'Imóveis na Zona Oeste do Rio de Janeiro | Fabrício Magioli',
    h1: 'Imóveis na Zona Oeste do Rio de Janeiro',
    metaDescription:
      'Especialista em imóveis na Zona Oeste do RJ: Campo Grande, Bangu, Santa Cruz, Taquara e região. Financiamento facilitado e uso de FGTS.',
    intro:
      'Com atuação dedicada à Zona Oeste do Rio de Janeiro, ofereço curadoria das melhores oportunidades em Campo Grande, Bangu, Santa Cruz e arredores — sempre respeitando o seu orçamento e agilizando a aprovação de crédito.',
    highlights: [
      'Atendimento especializado na Zona Oeste carioca',
      'Aprovação de crédito facilitada com uso do FGTS',
      'Curadoria transparente de apartamentos, casas e terrenos',
    ],
  },
];

export function getNeighborhoodBySlug(slug?: string): NeighborhoodSEO | undefined {
  if (!slug) return undefined;
  return NEIGHBORHOODS.find((n) => n.slug === slug.toLowerCase());
}
