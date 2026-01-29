import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div className="relative h-[300px] overflow-hidden">
            <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 bg-navy/80 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                {property.category}
            </div>
            <div className="absolute top-4 right-4 bg-gold text-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                {property.type}
            </div>
        </div>

        <div className="p-8">
            <div className="mb-4">
                <h3 className="font-serif text-xl text-navy mb-2 leading-tight min-h-[56px]">{property.title}</h3>
                <p className="text-royal font-medium text-sm flex items-center gap-1">
                    <span className="w-4 h-[1px] bg-royal"></span>
                    {property.location}
                </p>
            </div>

            <div className="flex justify-between items-center py-4 border-y border-pearl mb-6">
                <div className="flex flex-col items-center">
                    <span className="text-dark/40 mb-1"><BedDouble size={18} /></span>
                    <span className="text-xs font-bold text-navy">{property.beds} Quartos</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-dark/40 mb-1"><Bath size={18} /></span>
                    <span className="text-xs font-bold text-navy">{property.baths} Banheiros</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-dark/40 mb-1"><Square size={18} /></span>
                    <span className="text-xs font-bold text-navy">{property.area}</span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <span className="text-[10px] text-dark/50 uppercase tracking-widest block">Valor sugerido</span>
                    <span className="text-xl font-bold text-gold">{property.price}</span>
                </div>
                <Link to={`/imovel/${property.id}`} className="text-navy hover:text-gold transition-colors flex items-center gap-2 group/btn">
                    <span className="font-bold text-xs uppercase tracking-widest">Detalhes</span>
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    </div>
);

const Properties: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProperties = async () => {
            try {
                const { data, error } = await supabase
                    .from('properties')
                    .select('*');

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
        <div className="bg-pearl min-h-screen pt-32 pb-20">
            <SEO
                title="Encontre seu Imóvel | Fabrício Magioli"
                description="Confira nossa seleção de imóveis com as melhores condições de pagamento."
            />
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <Link to="/" className="text-navy/60 hover:text-gold transition-colors inline-flex items-center gap-2 mb-6 uppercase tracking-widest text-xs">
                        <ArrowLeft size={14} />
                        Voltar para Início
                    </Link>
                    <h1 className="font-serif text-4xl md:text-5xl text-navy mb-4">Nosso Portfólio Completo</h1>
                    <div className="w-20 h-1 bg-gold"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-navy font-serif text-xl animate-pulse">Carregando todos os imóveis...</div>
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
            </div>
        </div>
    );
};

export default Properties;
