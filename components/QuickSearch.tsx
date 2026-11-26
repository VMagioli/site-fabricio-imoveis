import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, ChevronDown, Map } from 'lucide-react';
import { usePropertyOptions } from '../src/hooks/usePropertyOptions';
import { getLocationsForZone, isLocationCompatibleWithZone } from '../src/data/zoneLocations';

const QuickSearch: React.FC = () => {
  const navigate = useNavigate();
  const options = usePropertyOptions();
  const [category, setCategory] = useState('Todos');
  const [zone, setZone] = useState('Todas');
  const [location, setLocation] = useState('Todos os Bairros');

  const availableLocations = useMemo(
    () => getLocationsForZone(zone, options.locations),
    [zone, options.locations]
  );

  const handleZoneChange = (nextZone: string) => {
    setZone(nextZone);
    if (!isLocationCompatibleWithZone(location, nextZone, options.locations)) {
      setLocation('Todos os Bairros');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category !== 'Todos') params.set('category', category);
    if (zone !== 'Todas') params.set('zone', zone);
    if (location !== 'Todos os Bairros') params.set('location', location);
    const qs = params.toString();
    navigate(qs ? `/imoveis?${qs}` : '/imoveis');
  };

  return (
    <div className="container mx-auto px-6 -mt-16 relative z-30">
      <form
        role="search"
        aria-label="Busca rápida de imóveis"
        toolname="buscar_imoveis_rj"
        tooldescription="Busca rápida de imóveis disponíveis no Rio de Janeiro por categoria, zona e bairro, redirecionando para o catálogo filtrado."
        toolautosubmit=""
        onSubmit={handleSearch}
        className="bg-white rounded-sm shadow-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-6"
      >
        {/* Category Filter */}
        <div className="w-full md:w-1/4">
          <label
            htmlFor="quick-category"
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
              id="quick-category"
              name="category"
              toolparamdescription="Categoria do imóvel desejado (ex.: Apartamento, Casa, Cobertura, Terreno ou Todos)."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
        <div className="w-full md:w-1/4">
          <label
            htmlFor="quick-zone"
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
              id="quick-zone"
              name="zone"
              toolparamdescription="Zona ou região do Rio de Janeiro (ex.: Zona Oeste, Zona Norte, Zona Sul, Zona Sudoeste, Centro, Niterói ou Todas)."
              value={zone}
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
        <div className="w-full md:w-1/4">
          <label
            htmlFor="quick-location"
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
              id="quick-location"
              name="location"
              toolparamdescription="Bairro específico compatível com a zona selecionada (ex.: Campo Grande, Bangu, Recreio dos Bandeirantes ou Todos os Bairros)."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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

        {/* Search Submit */}
        <div className="w-full md:w-1/4 pt-2 md:pt-6">
          <button
            type="submit"
            className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-0.5"
          >
            <Search size={20} aria-hidden="true" />
            <span className="uppercase text-sm tracking-widest">Buscar Imóvel</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickSearch;
