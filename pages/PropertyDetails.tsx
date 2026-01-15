import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BedDouble, Bath, Square, MapPin, ArrowLeft, Check, Share2, Heart } from 'lucide-react';
import { PROPERTIES } from '../constants';

const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const property = PROPERTIES.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-pearl">
                <h2 className="text-3xl font-serif text-navy mb-4">Imóvel não encontrado</h2>
                <Link to="/" className="text-gold hover:underline uppercase tracking-widest text-sm">
                    Voltar para Início
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-pearl min-h-screen pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-navy pt-32 pb-12">
                <div className="container mx-auto px-6">
                    <Link to="/" className="text-white/60 hover:text-gold transition-colors inline-flex items-center gap-2 mb-6 uppercase tracking-widest text-xs">
                        <ArrowLeft size={14} />
                        Voltar para Início
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-2 block">{property.category}</span>
                            <h1 className="text-3xl md:text-5xl font-serif text-white mb-4 leading-tight">{property.title}</h1>
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin size={18} className="text-gold" />
                                <span className="font-light">{property.location}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-white/60 text-sm uppercase tracking-widest mb-1">Valor de Venda</span>
                            <span className="text-3xl md:text-4xl font-serif text-gold">{property.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Gallery & Info */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Gallery (Placeholder for multiple images, using single image for now) */}
                        <div className="bg-white p-2 rounded-sm shadow-xl">
                            <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-sm group">
                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="bg-white/90 p-3 rounded-full hover:bg-gold hover:text-navy transition-colors text-navy shadow-lg">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="bg-white/90 p-3 rounded-full hover:bg-gold hover:text-navy transition-colors text-navy shadow-lg">
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {/* Mock thumbnails */}
                                {[1, 2, 3, 4].map((_, idx) => (
                                    <div key={idx} className="h-24 overflow-hidden rounded-sm cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                        <img src={property.image} className="w-full h-full object-cover" alt={`View ${idx}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Info */}
                        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100">
                            <h3 className="font-serif text-2xl text-navy mb-8">Características Principais</h3>
                            <div className="grid grid-cols-3 gap-8 border-b border-gray-100 pb-8 mb-8">
                                <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                    <BedDouble size={32} className="text-gold mb-3" />
                                    <span className="text-2xl font-serif text-navy mb-1">{property.beds}</span>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Quartos</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                    <Bath size={32} className="text-gold mb-3" />
                                    <span className="text-2xl font-serif text-navy mb-1">{property.baths}</span>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Banheiros</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                    <Square size={32} className="text-gold mb-3" />
                                    <span className="text-2xl font-serif text-navy mb-1">{property.area}</span>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Área Total</span>
                                </div>
                            </div>

                            <div className="space-y-6 text-gray-600 leading-relaxed font-light">
                                <p>
                                    Este magnífico imóvel em {property.location} define o padrão de luxo e sofisticação.
                                    Com acabamentos de altíssimo padrão e uma localização privilegiada, oferece o equilíbrio perfeito entre conforto e exclusividade.
                                </p>
                                <p>
                                    Cada detalhe foi cuidadosamente planejado para proporcionar uma experiência de vida inigualável.
                                    A ampla área social integra-se perfeitamente aos espaços externos, criando um ambiente ideal para receber convidados ou desfrutar de momentos de tranquilidade.
                                </p>
                            </div>

                            <div className="mt-10">
                                <h4 className="font-bold text-navy uppercase tracking-widest text-sm mb-6">Destaques do Imóvel</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['Vista Panorâmica', 'Acabamento Premium', 'Segurança 24h', 'Área de Lazer Completa', 'Automação Residencial', 'Vagas de Garagem'].map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-white p-8 rounded-sm shadow-xl border-t-4 border-gold">
                            <div className="mb-8 text-center">
                                <span className="text-gold font-bold tracking-[0.2em] uppercase text-[10px] block mb-2">Interessado?</span>
                                <h3 className="font-serif text-2xl text-navy">Agende uma Visita</h3>
                            </div>

                            <form className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">Nome Completo</label>
                                    <input type="text" className="w-full bg-pearl/30 border border-gray-200 p-3 text-sm focus:outline-none focus:border-gold transition-colors rounded-sm" placeholder="Seu nome" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">Email / Telefone</label>
                                    <input type="text" className="w-full bg-pearl/30 border border-gray-200 p-3 text-sm focus:outline-none focus:border-gold transition-colors rounded-sm" placeholder="Seu contato" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">Mensagem</label>
                                    <textarea
                                        className="w-full bg-pearl/30 border border-gray-200 p-3 text-sm focus:outline-none focus:border-gold transition-colors rounded-sm h-32 resize-none"
                                        defaultValue={`Olá, tenho interesse no imóvel "${property.title}" (ID: ${property.id}). Gostaria de mais informações.`}
                                    ></textarea>
                                </div>
                                <button className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-sm transition-all uppercase tracking-widest text-xs shadow-lg transform hover:-translate-y-1">
                                    Enviar Solicitação
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400 mb-2">Ou fale diretamente conosco</p>
                                <a href="https://wa.me/5521999999999" className="text-gold font-bold hover:underline text-sm">
                                    (21) 99999-9999
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
