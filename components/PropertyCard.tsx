import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square, ArrowRight } from 'lucide-react';
import { Property } from '../types';

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
  <Link
    to={`/imovel/${property.slug}`}
    className="block group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
  >
    <div className="relative aspect-video w-full overflow-hidden bg-navy/10">
      <img
        src={Array.isArray(property.image) ? property.image[0] : property.image}
        alt={`${property.title} — ${property.location}`}
        width={640}
        height={360}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 bg-navy/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
        {property.category}
      </div>
      <div className="absolute top-4 right-4 bg-gold text-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
        {property.type}
      </div>
    </div>

    <div className="p-8">
      <div className="mb-4">
        <h3 className="font-serif text-xl text-navy mb-2 leading-tight min-h-[56px]">
          {property.title}
        </h3>
        <p className="text-royal font-medium text-sm flex items-center gap-1">
          <span className="w-4 h-[1px] bg-royal" aria-hidden="true" />
          {property.location}
        </p>
      </div>

      <div className="flex justify-between items-center py-4 border-y border-pearl mb-6">
        <div className="flex flex-col items-center">
          <span className="text-navy/60 mb-1" aria-hidden="true">
            <BedDouble size={18} />
          </span>
          <span className="text-xs font-bold text-navy">{property.beds} Quartos</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-navy/60 mb-1" aria-hidden="true">
            <Bath size={18} />
          </span>
          <span className="text-xs font-bold text-navy">{property.baths} Banheiros</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-navy/60 mb-1" aria-hidden="true">
            <Square size={18} />
          </span>
          <span className="text-xs font-bold text-navy">{property.area}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-600 uppercase tracking-widest block">A partir de</span>
          <span className="text-xl font-bold text-gold-dark">{property.price}</span>
        </div>
        <div className="text-navy group-hover:text-gold-dark transition-colors flex items-center gap-2">
          <span className="font-bold text-xs uppercase tracking-widest">Detalhes</span>
          <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  </Link>
);

export default PropertyCard;
