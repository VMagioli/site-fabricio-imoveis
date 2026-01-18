
import { Property, NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Imóveis', href: '/imoveis' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Contato', href: '/contato' },
];

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Cobertura Linear de Frente para o Mar',
    price: 'R$ 12.500.000',
    location: 'Leblon, Rio de Janeiro',
    beds: 4,
    baths: 5,
    area: '450m²',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    type: 'Comprar',
    category: 'Cobertura'
  },
  {
    id: '2',
    title: 'Apartamento Design com Vista Cristo',
    price: 'R$ 7.800.000',
    location: 'Lagoa, Rio de Janeiro',
    beds: 3,
    baths: 4,
    area: '280m²',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
    type: 'Comprar',
    category: 'Apartamento'
  },
  {
    id: '3',
    title: 'Residência Exclusiva com Jardim Vertical',
    price: 'R$ 45.000 /mês',
    location: 'Ipanema, Rio de Janeiro',
    beds: 4,
    baths: 4,
    area: '320m²',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    type: 'Alugar',
    category: 'Apartamento'
  }
];
