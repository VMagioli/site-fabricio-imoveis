
import React from 'react';
import { Search, MapPin, Building, ChevronDown } from 'lucide-react';

const QuickSearch: React.FC = () => {
  return (
    <div className="container mx-auto px-6 -mt-16 relative z-30">
      <div className="bg-white rounded-sm shadow-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-6">

        {/* Category Filter */}
        <div className="w-full md:w-1/3">
          <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Pretensão</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
            <select className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none">
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Terreno</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
          </div>
        </div>

        {/* Neighborhood Filter */}
        <div className="w-full md:w-1/3">
          <label className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-2">Bairro</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
            <select className="w-full bg-pearl border-none py-3 pl-10 pr-4 rounded-sm text-dark font-medium appearance-none focus:ring-1 focus:ring-gold outline-none">
              <option>Todos os Bairros</option>
              <option>Campo Grande</option>
              <option>Bangu</option>
              <option>Santa Cruz</option>
              <option>Méier</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
          </div>
        </div>

        {/* Search Pesquisa */}
        <div className="w-full md:w-1/3 pt-4 md:pt-6">
          <button className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-1">
            <Search size={20} />
            <span className="uppercase text-sm tracking-widest">Buscar Imóvel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
