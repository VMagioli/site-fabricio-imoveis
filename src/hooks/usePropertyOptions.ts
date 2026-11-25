import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { OptionGroup, PropertyOption } from '../../types';

export const DEFAULT_PROPERTY_OPTIONS: Record<OptionGroup, string[]> = {
  type: ['Comprar', 'Alugar', 'Vender'],
  category: ['Apartamento', 'Casa', 'Cobertura', 'Terreno'],
  zone: [
    'Zona Oeste',
    'Zona Norte',
    'Zona Sudoeste',
    'Zona Sul',
    'Porto Maravilha',
    'Centro',
    'Niterói',
  ],
  location: [
    'Bangu',
    'Barra da Tijuca',
    'Barra Olímpica',
    'Cachambi',
    'Campo Grande',
    'Centro',
    'Irajá',
    'Niterói',
    'Olaria',
    'Recreio dos Bandeirantes',
    'Rio Comprido',
    'Santa Cruz',
    'Santo Cristo',
    'São Cristóvão',
    'Taquara',
  ],
};

export interface GroupedOptions {
  types: string[];
  categories: string[];
  zones: string[];
  locations: string[];
  raw: PropertyOption[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export function usePropertyOptions(): GroupedOptions {
  const [raw, setRaw] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('property_options')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true });

      if (error) {
        // Table may not exist yet before SQL migration — gracefully keep defaults
        setRaw([]);
        return;
      }

      if (data && data.length > 0) {
        setRaw(data as PropertyOption[]);
      } else {
        setRaw([]);
      }
    } catch {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const byGroup = (group: OptionGroup): string[] => {
    const items = raw.filter((item) => item.group_name === group).map((item) => item.label);
    return items.length > 0 ? items : DEFAULT_PROPERTY_OPTIONS[group];
  };

  return {
    types: byGroup('type'),
    categories: byGroup('category'),
    zones: byGroup('zone'),
    locations: byGroup('location'),
    raw,
    loading,
    refresh: fetchOptions,
  };
}
