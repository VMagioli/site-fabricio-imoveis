import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { BedDouble, Bath, Square, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

import { Search, MapPin, Building, ChevronDown, Map } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

const Properties: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedZone, setSelectedZone] = useState('Todas');
    const [selectedLocation, setSelectedLocation] = useState('Todos os Bairros');

    const handleSearch = () => {
        let filtered = properties;

        if (selectedCategory !== 'Todos') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (selectedZone !== 'Todas') {
            filtered = filtered.filter(p => p.zone === selectedZone);
        }

        if (selectedLocation !== 'Todos os Bairros') {
            filtered = filtered.filter(p => p.location.includes(selectedLocation === 'Zona Portuária e Centro' ? 'Centro' : selectedLocation));
        }

        setFilteredProperties(filtered);
    };

    useEffect(() => {
        // Initialize filters from URL
        const categoryParam = searchParams.get('category');
        const locationParam = searchParams.get('location');
        const zoneParam = searchParams.get('zone');

        if (categoryParam) setSelectedCategory(categoryParam);
        if (locationParam) setSelectedLocation(locationParam);
        if (zoneParam) setSelectedZone(zoneParam);
    }, [searchParams]);

    useEffect(() => {
        // Run filter when properties or filters change
        if (properties.length > 0) {
            handleSearch();
        }
    }, [properties, selectedCategory, selectedLocation, selectedZone]);

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
                    // We don't set filteredProperties here immediately because the 
                    // useEffect above will handle it based on current filters/URL
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

                {/* Search Filters */}
                <div className="bg-white rounded-sm shadow-xl p-6 mb-12 -mt-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-end gap-6">

                        {/* Category Filter */}
                        <div className="w-full md:w-1/4">
                            <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Pretensão/Tipo</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none cursor-pointer"
                                >
                                    <option value="Todos">Todos</option>
                                    <option value="Apartamento">Apartamento</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Terreno">Terreno</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                            </div>
                        </div>

                        {/* Zone Filter */}
                        <div className="w-full md:w-1/4">
                            <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Zona</label>
                            <div className="relative">
                                <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                                <select
                                    value={selectedZone}
                                    onChange={(e) => setSelectedZone(e.target.value)}
                                    className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none cursor-pointer"
                                >
                                    <option value="Todas">Selecione a Zona</option>
                                    <option value="Zona Oeste">Zona Oeste</option>
                                    <option value="Zona Norte">Zona Norte</option>
                                    <option value="Zona Sul">Zona Sul</option>
                                    <option value="Zona Portuária">Zona Portuária</option>
                                    <option value="Zona Sudoeste">Zona Sudoeste</option>
                                    <option value="Centro">Centro</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                            </div>
                        </div>

                        {/* Neighborhood Filter */}
                        <div className="w-full md:w-1/4">
                            <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Bairro</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none cursor-pointer"
                                >
                                    <option>Todos os Bairros</option>
                                    <option>Campo Grande</option>
                                    <option>Bangu</option>
                                    <option>Santa Cruz</option>
                                    <option>Zona Portuária e Centro</option>
                                    <option>Recreio dos Bandeirantes</option>
                                    <option>Barra da Tijuca</option>
                                    <option>Niterói</option>
                                    <option>Zona Norte</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-1/4">
                            <button
                                onClick={handleSearch}
                                className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3 rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-1 active:translate-y-0"
                            >
                                <Search size={20} />
                                <span className="uppercase text-sm tracking-widest">BUSCAR IMÓVEL</span>
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-navy font-serif text-xl animate-pulse">Carregando todos os imóveis...</div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map((prop) => (
                                <PropertyCard key={prop.id} property={prop} />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 text-gray-500">
                                <p className="text-lg">Nenhum imóvel encontrado com os critérios selecionados.</p>
                                <button
                                    onClick={() => { setSelectedCategory('Todos'); setSelectedZone('Todas'); setSelectedLocation('Todos os Bairros'); setFilteredProperties(properties); }}
                                    className="text-gold font-bold mt-4 hover:underline"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Properties;
