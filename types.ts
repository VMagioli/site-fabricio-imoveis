
export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  zone?: string;
  video?: string;
  beds: number;
  baths: number;
  area: string;
  image: string[];
  type: 'Comprar' | 'Alugar';
  category: 'Apartamento' | 'Cobertura' | 'Casa' | 'Terreno';
  suites?: number;
  parking?: number;
  land_area?: number;
  built_area?: number;
  pet_friendly?: boolean;
  description?: string;
  features?: string[];
}

export interface NavLink {
  label: string;
  href: string;
}
