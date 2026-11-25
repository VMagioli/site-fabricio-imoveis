import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

const PropertySkeleton: React.FC = () => (
  <div className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse" aria-hidden="true">
    <div className="aspect-video w-full bg-gray-200" />
    <div className="p-8 space-y-5">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-4/5" />
        <div className="h-6 bg-gray-200 rounded w-3/5" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />
      </div>
      <div className="flex justify-between py-4 border-y border-pearl">
        <div className="h-10 w-16 bg-gray-200 rounded" />
        <div className="h-10 w-16 bg-gray-200 rounded" />
        <div className="h-10 w-16 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-7 w-28 bg-gray-200 rounded" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

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
            <span className="text-gold-dark font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Portfólio Selecionado
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">Imóveis em Destaque</h2>
            <div className="w-20 h-1 bg-gold mt-6" aria-hidden="true" />
          </div>
          <Link
            to="/imoveis"
            className="hidden md:flex items-center gap-2 text-navy hover:text-gold-dark transition-colors font-bold uppercase text-xs tracking-[0.2em] group"
          >
            Ver catálogo completo
            <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div
            role="status"
            aria-label="Carregando imóveis em destaque"
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            <PropertySkeleton />
            <PropertySkeleton />
            <PropertySkeleton />
            <span className="sr-only">Carregando imóveis...</span>
          </div>
        ) : error ? (
          <div role="alert" className="text-center py-10 text-red-700 font-medium">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-navy hover:text-gold-dark transition-colors font-bold uppercase text-xs tracking-[0.2em] group"
          >
            Ver catálogo completo
            <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;
