export interface Property {
  id: string;
  slug: string;
  title: string;
  price: string;
  location: string;
  zone?: string;
  video?: string;
  beds: number;
  baths: number;
  area: string;
  image: string[];
  type: string;
  category: string;
  suites?: number;
  parking?: number;
  land_area?: number;
  built_area?: number;
  pet_friendly?: boolean;
  description?: string;
  features?: string[];
  created_at?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export type OptionGroup = 'type' | 'category' | 'zone' | 'location';

export interface PropertyOption {
  id: string;
  group_name: OptionGroup;
  label: string;
  sort_order: number;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  message?: string;
  property_ref?: string;
  created_at?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at?: string;
}
