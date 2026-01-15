
export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  type: 'Comprar' | 'Alugar';
  category: 'Apartamento' | 'Cobertura' | 'Casa' | 'Terreno';
}

export interface NavLink {
  label: string;
  href: string;
}
