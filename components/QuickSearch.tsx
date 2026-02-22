
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, ChevronDown, Map } from 'lucide-react';

const QuickSearch: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('Todos');
  const [zone, setZone] = useState('Todas');
  const [location, setLocation] = useState('Todos os Bairros');

  const handleSearch = () => {
    navigate(`/imoveis?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&zone=${encodeURIComponent(zone)}`);
  };

  return (
    <div className="container mx-auto px-6 -mt-16 relative z-30">
      <div className="bg-white rounded-sm shadow-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-6">

        {/* Category Filter */}
        <div className="w-full md:w-1/4">
          <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Pretensão</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none cursor-pointer"
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
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
          </div>
        </div>

        {/* Neighborhood Filter */}
        <div className="w-full md:w-1/4">
          <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Bairro</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none cursor-pointer"
            >
              <option>Todos os Bairros</option>
              <option>Bangu</option>
              <option>Barra da Tijuca</option>
              <option>Barra Olímpica</option>
              <option>Cachambi</option>
              <option>Campo Grande</option>
              <option>Centro</option>
              <option>Irajá</option>
              <option>Niterói</option>
              <option>Olaria</option>
              <option>Recreio dos Bandeirantes</option>
              <option>Rio Comprido</option>
              <option>Santa Cruz</option>
              <option>Santo Cristo</option>
              <option>São Cristóvão</option>
              <option>Taquara</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
          </div>
        </div>

        {/* Search Pesquisa */}
        <div className="w-full md:w-1/4 pt-4 md:pt-6">
          <button
            onClick={handleSearch}
            className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-1"
          >
            <Search size={20} />
            <span className="uppercase text-sm tracking-widest">Buscar Imóvel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
