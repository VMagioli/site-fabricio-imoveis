
import React from 'react';
import { BedDouble, Bath, Square, ArrowRight } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';

import { Link } from 'react-router-dom';

import PropertyCard from './PropertyCard';

const PropertyGrid: React.FC = () => {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .limit(3);

        if (error) throw error;

        if (data) {
          setProperties(data as Property[]);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Não foi possível carregar os imóveis no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section id="imoveis" className="py-24 bg-pearl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div className="max-w-xl">
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Portfólio Selecionado</span>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">Imóveis em Destaque</h2>
            <div className="w-20 h-1 bg-gold mt-6"></div>
          </div>
          <Link to="/imoveis" className="hidden md:flex items-center gap-2 text-navy hover:text-gold transition-colors font-bold uppercase text-xs tracking-[0.2em] group">
            Ver catálogo completo
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-navy font-serif text-xl animate-pulse">Carregando imóveis...</div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link to="/imoveis" className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-bold uppercase text-xs tracking-[0.2em] group">
            Ver catálogo completo
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;
