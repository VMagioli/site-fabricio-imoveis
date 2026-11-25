import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, ChevronDown, Map } from 'lucide-react';

const QuickSearch: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('Todos');
  const [zone, setZone] = useState('Todas');
  const [location, setLocation] = useState('Todos os Bairros');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/imoveis?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&zone=${encodeURIComponent(zone)}`
    );
  };

  return (
    <div className="container mx-auto px-6 -mt-16 relative z-30">
      <form
        role="search"
        aria-label="Busca rápida de imóveis"
        onSubmit={handleSearch}
        className="bg-white rounded-sm shadow-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-6"
      >
        {/* Category Filter */}
        <div className="w-full md:w-1/4">
          <label
            htmlFor="quick-category"
            className="text-xs text-gold-dark font-bold uppercase tracking-widest block mb-2"
          >
            Pretensão
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
            >
              <option value="Todos">Todos</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Terreno">Terreno</option>
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
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
            >
              <option value="Todas">Selecione a Zona</option>
              <option value="Zona Oeste">Zona Oeste</option>
              <option value="Zona Norte">Zona Norte</option>
              <option value="Zona Sudoeste">Zona Sudoeste</option>
              <option value="Zona Sul">Zona Sul</option>
              <option value="Porto Maravilha">Porto Maravilha</option>
              <option value="Centro">Centro</option>
              <option value="Niterói">Niterói</option>
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-pearl border border-gray-200 py-3 pl-10 pr-8 rounded-sm text-dark font-medium appearance-none focus:ring-2 focus:ring-gold-dark outline-none cursor-pointer"
            >
              <option value="Todos os Bairros">Todos os Bairros</option>
              <option value="Bangu">Bangu</option>
              <option value="Barra da Tijuca">Barra da Tijuca</option>
              <option value="Barra Olímpica">Barra Olímpica</option>
              <option value="Cachambi">Cachambi</option>
              <option value="Campo Grande">Campo Grande</option>
              <option value="Centro">Centro</option>
              <option value="Irajá">Irajá</option>
              <option value="Niterói">Niterói</option>
              <option value="Olaria">Olaria</option>
              <option value="Recreio dos Bandeirantes">Recreio dos Bandeirantes</option>
              <option value="Rio Comprido">Rio Comprido</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Santo Cristo">Santo Cristo</option>
              <option value="São Cristóvão">São Cristóvão</option>
              <option value="Taquara">Taquara</option>
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
