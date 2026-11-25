import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Search, MapPin, Building, ChevronDown, Map, Check, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import PropertyCard from '../components/PropertyCard';
import { NEIGHBORHOODS, getNeighborhoodBySlug } from '../src/data/neighborhoods';
import { usePropertyOptions } from '../src/hooks/usePropertyOptions';

const Properties: React.FC = () => {
  const { neighborhoodSlug } = useParams<{ neighborhoodSlug?: string }>();
  const neighborhood = getNeighborhoodBySlug(neighborhoodSlug);
  const options = usePropertyOptions();

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Filter States
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedZone, setSelectedZone] = useState('Todas');
  const [selectedLocation, setSelectedLocation] = useState('Todos os Bairros');

  const applyFilters = () => {
    let filtered = properties;

    if (selectedType !== 'Todos') {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedZone !== 'Todas') {
      filtered = filtered.filter((p) => p.zone === selectedZone);
    }

    if (selectedLocation !== 'Todos os Bairros') {
      filtered = filtered.filter((p) => {
        if (selectedLocation === 'Zona Portuária e Centro') {
          return (
            p.location.includes('Centro') ||
            p.location.includes('Santo Cristo') ||
            p.zone === 'Porto Maravilha' ||
            p.zone === 'Zona Portuária'
          );
        }
        return p.location.includes(selectedLocation);
      });
    }

    setFilteredProperties(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  useEffect(() => {
    if (neighborhood) {
      setSelectedType('Todos');
      setSelectedCategory('Todos');
      if (neighborhood.filterType === 'zone') {
        setSelectedZone(neighborhood.filterValue);
        setSelectedLocation('Todos os Bairros');
      } else {
        setSelectedZone('Todas');
        setSelectedLocation(neighborhood.filterValue);
      }
      return;
    }

    const typeParam = searchParams.get('type');
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    const zoneParam = searchParams.get('zone');

    setSelectedType(typeParam || 'Todos');
    setSelectedCategory(categoryParam || 'Todos');
    setSelectedLocation(locationParam || 'Todos os Bairros');
    setSelectedZone(zoneParam || 'Todas');
  }, [neighborhood, searchParams]);

  useEffect(() => {
    if (properties.length > 0) {
      applyFilters();
    }
  }, [properties, selectedType, selectedCategory, selectedLocation, selectedZone]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase.from('properties').select('*');

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://www.fabriciomagioli.com.br/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Imóveis',
        item: 'https://www.fabriciomagioli.com.br/imoveis',
      },
      ...(neighborhood
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: neighborhood.name,
              item: `https://www.fabriciomagioli.com.br/imoveis/${neighborhood.slug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <main id="conteudo-principal" className="bg-pearl min-h-screen pt-32 pb-20">
      <SEO
        title={neighborhood ? neighborhood.title : 'Catálogo de Imóveis no Rio de Janeiro'}
        description={
          neighborhood
            ? neighborhood.metaDescription
            : 'Encontre seu novo lar no Rio de Janeiro. Seleção de apartamentos, casas e terrenos com atendimento consultivo e financiamento facilitado.'
        }
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-6">
        <div className="mb-12">
          <Link
            to={neighborhood ? '/imoveis' : '/'}
            className="text-navy/80 hover:text-gold-dark transition-colors inline-flex items-center gap-2 mb-6 uppercase tracking-widest text-xs font-medium"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {neighborhood ? 'Ver todos os imóveis' : 'Voltar para Início'}
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-navy mb-4">
            {neighborhood ? neighborhood.h1 : 'Nosso Portfólio Completo'}
          </h1>
          <div className="w-20 h-1 bg-gold mb-6" aria-hidden="true" />

          {neighborhood && (
            <div className="max-w-3xl space-y-4">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {neighborhood.intro}
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                {neighborhood.highlights.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2 text-sm text-navy font-medium">
                    <Check size={16} className="text-gold-dark flex-shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Filters */}
        <form
          role="search"
          aria-label="Filtrar catálogo de imóveis"
          onSubmit={handleSubmit}
          className="bg-white rounded-sm shadow-xl p-6 mb-10 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-end gap-5">
            {/* Negotiation Type Filter */}
            <div>
              <label
                htmlFor="filter-type"
                className="text-xs text-gold-dark font-bold uppercase tracking-widest block mb-2"
              >
                Finalidade
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dark pointer-events-none"
                  size={18}
                  aria-hidden="true"
                />
                <select
                  id="filter-type"
                  name="type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  {options.types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/60 pointer-events-none"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="filter-category"
                className="text-xs text-gold-dark font-bold uppercase tracking-widest block mb-2"
              >
                Categoria
              </label>
              <div className="relative">
                <Building
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dark pointer-events-none"
                  size={18}
                  aria-hidden="true"
                />
                <select
                  id="filter-category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  {options.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/60 pointer-events-none"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Zone Filter */}
            <div>
              <label
                htmlFor="filter-zone"
                className="text-xs text-gold-dark font-bold uppercase tracking-widest block mb-2"
              >
                Zona
              </label>
              <div className="relative">
                <Map
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dark pointer-events-none"
                  size={18}
                  aria-hidden="true"
                />
                <select
                  id="filter-zone"
                  name="zone"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todas">Selecione a Zona</option>
                  {options.zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/60 pointer-events-none"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Neighborhood Filter */}
            <div>
              <label
                htmlFor="filter-location"
                className="text-xs text-gold-dark font-bold uppercase tracking-widest block mb-2"
              >
                Bairro
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dark pointer-events-none"
                  size={18}
                  aria-hidden="true"
                />
                <select
                  id="filter-location"
                  name="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todos os Bairros">Todos os Bairros</option>
                  {options.locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/60 pointer-events-none"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3 rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search size={18} aria-hidden="true" />
                <span className="uppercase text-xs tracking-widest">Buscar Imóvel</span>
              </button>
            </div>
          </div>
        </form>

        {/* Internal Links to SEO Neighborhood Pages */}
        <nav aria-label="Explorar imóveis por bairro e região" className="mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 mr-2">
              Regiões:
            </span>
            <Link
              to="/imoveis"
              className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-colors ${
                !neighborhood
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy border-gray-200 hover:border-gold-dark hover:text-gold-dark'
              }`}
            >
              Todos
            </Link>
            {NEIGHBORHOODS.map((item) => (
              <Link
                key={item.slug}
                to={`/imoveis/${item.slug}`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-colors ${
                  neighborhood?.slug === item.slug
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy border-gray-200 hover:border-gold-dark hover:text-gold-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {loading ? (
          <div
            role="status"
            aria-label="Carregando catálogo de imóveis"
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white rounded-sm overflow-hidden shadow-sm animate-pulse"
                aria-hidden="true"
              >
                <div className="aspect-video w-full bg-gray-200" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-4/5" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-12 bg-gray-200 rounded w-full" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
            <span className="sr-only">Carregando todos os imóveis...</span>
          </div>
        ) : error ? (
          <div role="alert" className="text-center py-10 text-red-700 font-medium">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop) => <PropertyCard key={prop.id} property={prop} />)
            ) : (
              <div className="col-span-full text-center py-20 text-gray-700">
                <p className="text-lg">Nenhum imóvel encontrado com os critérios selecionados.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('Todos');
                    setSelectedCategory('Todos');
                    setSelectedZone('Todas');
                    setSelectedLocation('Todos os Bairros');
                    setFilteredProperties(properties);
                  }}
                  className="text-gold-dark font-bold mt-4 hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Properties;
