import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { withRetry } from '../src/lib/retry';
import { Property } from '../types';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Search,
  MapPin,
  Building,
  ChevronDown,
  Map,
  Check,
  Tag,
  RefreshCw,
} from 'lucide-react';
import SEO from '../components/SEO';
import PropertyCard from '../components/PropertyCard';
import { NEIGHBORHOODS, getNeighborhoodBySlug } from '../src/data/neighborhoods';
import { usePropertyOptions } from '../src/hooks/usePropertyOptions';
import { getLocationsForZone, isLocationCompatibleWithZone } from '../src/data/zoneLocations';

const CARD_COLUMNS =
  'id, slug, title, price, location, zone, beds, baths, area, image, type, category';
const PAGE_SIZE = 12;

const Properties: React.FC = () => {
  const { neighborhoodSlug } = useParams<{ neighborhoodSlug?: string }>();
  const neighborhood = getNeighborhoodBySlug(neighborhoodSlug);
  const options = usePropertyOptions();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States (initialized from route or URL query params)
  const [selectedType, setSelectedType] = useState(() => searchParams.get('type') || 'Todos');
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') || 'Todos'
  );
  const [selectedZone, setSelectedZone] = useState(() => {
    if (neighborhood?.filterType === 'zone') return neighborhood.filterValue;
    return searchParams.get('zone') || 'Todas';
  });
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (neighborhood?.filterType === 'location') return neighborhood.filterValue;
    return searchParams.get('location') || 'Todos os Bairros';
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableLocations = useMemo(
    () => getLocationsForZone(selectedZone, options.locations),
    [selectedZone, options.locations]
  );

  // Sync filters when navigating between /imoveis and /imoveis/:neighborhoodSlug or URL changes
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
      setPage(1);
      return;
    }

    const typeParam = searchParams.get('type') || 'Todos';
    const categoryParam = searchParams.get('category') || 'Todos';
    const zoneParam = searchParams.get('zone') || 'Todas';
    const rawLocationParam = searchParams.get('location') || 'Todos os Bairros';
    const compatibleLocation = isLocationCompatibleWithZone(
      rawLocationParam,
      zoneParam,
      options.locations
    )
      ? rawLocationParam
      : 'Todos os Bairros';

    setSelectedType(typeParam);
    setSelectedCategory(categoryParam);
    setSelectedZone(zoneParam);
    setSelectedLocation(compatibleLocation);
    setPage(1);
  }, [neighborhood, searchParams, options.locations]);

  const syncUrlParams = (
    nextType: string,
    nextCategory: string,
    nextZone: string,
    nextLocation: string
  ) => {
    if (neighborhood) return;
    const params = new URLSearchParams();
    if (nextType !== 'Todos') params.set('type', nextType);
    if (nextCategory !== 'Todos') params.set('category', nextCategory);
    if (nextZone !== 'Todas') params.set('zone', nextZone);
    if (nextLocation !== 'Todos os Bairros') params.set('location', nextLocation);
    setSearchParams(params, { replace: true });
  };

  const handleZoneChange = (nextZone: string) => {
    const nextLocation = isLocationCompatibleWithZone(
      selectedLocation,
      nextZone,
      options.locations
    )
      ? selectedLocation
      : 'Todos os Bairros';

    setSelectedZone(nextZone);
    setSelectedLocation(nextLocation);
    setPage(1);
    syncUrlParams(selectedType, selectedCategory, nextZone, nextLocation);
  };

  const handleTypeChange = (nextType: string) => {
    setSelectedType(nextType);
    setPage(1);
    syncUrlParams(nextType, selectedCategory, selectedZone, selectedLocation);
  };

  const handleCategoryChange = (nextCategory: string) => {
    setSelectedCategory(nextCategory);
    setPage(1);
    syncUrlParams(selectedType, nextCategory, selectedZone, selectedLocation);
  };

  const handleLocationChange = (nextLocation: string) => {
    setSelectedLocation(nextLocation);
    setPage(1);
    syncUrlParams(selectedType, selectedCategory, selectedZone, nextLocation);
  };

  const handleClearFilters = () => {
    setSelectedType('Todos');
    setSelectedCategory('Todos');
    setSelectedZone('Todas');
    setSelectedLocation('Todos os Bairros');
    setPage(1);
    if (!neighborhood) {
      setSearchParams({}, { replace: true });
    }
  };

  const fetchProperties = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const from = (targetPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const buildQuery = (filterPublished: boolean) => {
        let query = supabase
          .from('properties')
          .select(CARD_COLUMNS, { count: 'exact' });

        if (filterPublished) {
          query = query.eq('published', true);
        }

        if (selectedType !== 'Todos') {
          query = query.eq('type', selectedType);
        }

        if (selectedCategory !== 'Todos') {
          query = query.eq('category', selectedCategory);
        }

        if (selectedZone !== 'Todas') {
          query = query.eq('zone', selectedZone);
        }

        if (selectedLocation !== 'Todos os Bairros') {
          if (selectedLocation === 'Zona Portuária e Centro') {
            query = query.or(
              'location.ilike.%Centro%,location.ilike.%Santo Cristo%,zone.eq.Porto Maravilha,zone.eq.Zona Portuária'
            );
          } else {
            query = query.ilike('location', `%${selectedLocation}%`);
          }
        }

        return query.range(from, to);
      };

      try {
        const result = await withRetry(async () => {
          const res = await buildQuery(true);
          if (res.error && res.error.code === '42703') {
            const fallback = await buildQuery(false);
            if (fallback.error) throw fallback.error;
            return fallback;
          }
          if (res.error) throw res.error;
          return res;
        });

        const rows = (result.data ?? []) as Property[];
        setProperties((prev) => (append ? [...prev, ...rows] : rows));
        setTotalCount(result.count ?? rows.length);
      } catch (err) {
        console.error('Error fetching catalog properties:', err);
        setError('Não foi possível carregar os imóveis no momento.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedType, selectedCategory, selectedZone, selectedLocation]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [neighborhoodSlug]);

  useEffect(() => {
    fetchProperties(1, false);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage, true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    syncUrlParams(selectedType, selectedCategory, selectedZone, selectedLocation);
    fetchProperties(1, false);
  };

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

  const hasMore = properties.length < totalCount;

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
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todos">Todas</option>
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
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todos">Todas as Categorias</option>
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
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todas">Todas as Zonas</option>
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
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
                >
                  <option value="Todos os Bairros">Todos os Bairros</option>
                  {availableLocations.map((loc) => (
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
        <nav aria-label="Explorar imóveis por bairro e região" className="mb-8">
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

        {/* Result summary */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6 text-xs text-gray-600 font-medium">
            <span>
              {totalCount === 0
                ? 'Nenhum imóvel encontrado'
                : `Exibindo ${properties.length} de ${totalCount} ${totalCount === 1 ? 'imóvel' : 'imóveis'}`}
            </span>
            {(selectedType !== 'Todos' ||
              selectedCategory !== 'Todos' ||
              selectedZone !== 'Todas' ||
              selectedLocation !== 'Todos os Bairros') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-gold-dark font-bold hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

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
          <div
            role="alert"
            className="text-center py-14 px-6 bg-white rounded-sm border border-gray-200 shadow-sm space-y-4"
          >
            <p className="text-red-700 font-medium text-base">{error}</p>
            <button
              type="button"
              onClick={() => fetchProperties(1, false)}
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
            >
              <RefreshCw size={15} aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {properties.length > 0 ? (
                properties.map((prop) => <PropertyCard key={prop.id} property={prop} />)
              ) : (
                <div className="col-span-full text-center py-20 text-gray-700 bg-white rounded-sm border border-gray-100">
                  <p className="text-lg">Nenhum imóvel encontrado com os critérios selecionados.</p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-gold-dark font-bold mt-4 hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-navy hover:bg-navy/90 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-sm shadow-lg transition-colors disabled:opacity-60"
                >
                  {loadingMore ? 'Carregando mais imóveis...' : 'Carregar mais imóveis'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Properties;
