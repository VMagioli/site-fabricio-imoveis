import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BedDouble, Bath, Square, MapPin, ArrowLeft, Check, Share2, Heart, CarFront, Ruler, PawPrint } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';
import { z } from 'zod';
import SEO from '../components/SEO';

const visitSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    contact: z.string().min(10, 'Contato (Email ou Telefone) deve ter no mínimo 10 caracteres'),
    message: z.string().optional(),
    check_visit: z.string().optional()
});

const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = React.useState<Property | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Form State
    const [formData, setFormData] = React.useState({
        name: '',
        contact: '',
        message: '',
        check_visit: ''
    });
    const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProperty = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setProperty(data as Property);
                }
            } catch (err) {
                console.error('Error fetching property:', err);
                setError('Imóvel não encontrado ou erro ao carregar.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleShare = async () => {
        if (!property) return;
        const shareData = {
            title: property.title,
            text: 'Dá uma olhada neste imóvel incrível!',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para a área de transferência!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Honeypot Check
        if (formData.check_visit) {
            console.log('Bot detected');
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                // Fake success or just do nothing
            }, 1000);
            return;
        }

        // 2. Validation
        const result = visitSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                const path = issue.path[0] as string;
                formattedErrors[path] = issue.message;
            });
            setFieldErrors(formattedErrors);
            return;
        }

        // 3. Save to Supabase & Redirect
        setIsSubmitting(true);

        // Construct Property Ref String
        const propertyRef = `ID ${property?.id || 'N/A'} - ${property?.title || 'Unknown'}`;

        try {
            const { error: dbError } = await supabase
                .from('leads')
                .insert([
                    {
                        name: formData.name,
                        contact: formData.contact,
                        message: formData.message,
                        property_ref: propertyRef
                    }
                ]);

            if (dbError) console.error('Erro ao salvar lead:', dbError);
            else console.log('Lead salvo com sucesso');
        } catch (err) {
            console.error('Erro inesperado ao salvar lead:', err);
        }

        // Construct Message
        // 'Olá, tenho interesse no imóvel [Título do Imóvel] (Ref: [ID]). Gostaria de agendar uma visita.'
        let text = `Olá, tenho interesse no imóvel ${property?.title}. Gostaria de agendar uma visita.`;

        // Append user message if exists
        if (formData.message) {
            text += `\n\nMensagem: ${formData.message}`;
        }

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/5521990132992?text=${encodedText}`;

        // Simulate delay for "Enviando..." feedback
        setTimeout(() => {
            alert('Solicitação recebida com sucesso! Redirecionando para o WhatsApp...');
            window.open(whatsappUrl, '_blank');
            setIsSubmitting(false);
            setFormData({ name: '', contact: '', message: '', check_visit: '' }); // Reset form
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pearl">
                <div className="text-navy font-serif text-xl animate-pulse">Carregando detalhes do imóvel...</div>
            </div>
        );
    }

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
            <SEO
                title={`${property.title} | Fabrício Magioli`}
                description="Agende sua visita para conhecer este imóvel. Aceitamos financiamento e FGTS. Veja fotos e detalhes aqui."
                image={property.image[0]}
            />
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
                                    src={property.image[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="bg-white/90 p-3 rounded-full hover:bg-gold hover:text-navy transition-colors text-navy shadow-lg"
                                        title="Compartilhar"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {/* Mock thumbnails */}
                                {property.image.slice(0, 4).map((img, idx) => (
                                    <div key={idx} className="h-24 overflow-hidden rounded-sm cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                        <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Info */}
                        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100">
                            <h3 className="font-serif text-2xl text-navy mb-8">Características Principais</h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 border-b border-gray-100 pb-8 mb-8">
                                <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                    <BedDouble size={24} className="text-gold mb-3" />
                                    <span className="text-xl font-serif text-navy mb-1">{property.beds}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500">Quartos</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                    <Bath size={24} className="text-gold mb-3" />
                                    <span className="text-xl font-serif text-navy mb-1">{property.baths}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500">Banheiros</span>
                                </div>
                                {property.suites && (
                                    <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                        <BedDouble size={24} className="text-gold mb-3" />
                                        <span className="text-xl font-serif text-navy mb-1">{property.suites}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Suítes</span>
                                    </div>
                                )}
                                {property.parking && (
                                    <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                        <CarFront size={24} className="text-gold mb-3" />
                                        <span className="text-xl font-serif text-navy mb-1">{property.parking}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Vagas</span>
                                    </div>
                                )}
                                {property.area && (
                                    <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                        <Square size={24} className="text-gold mb-3" />
                                        <span className="text-xl font-serif text-navy mb-1">{property.area}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Área Total</span>
                                    </div>
                                )}
                                {property.built_area && (
                                    <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                        <Ruler size={24} className="text-gold mb-3" />
                                        <span className="text-xl font-serif text-navy mb-1">{property.built_area}m²</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Área Const.</span>
                                    </div>
                                )}
                                {property.land_area && (
                                    <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                        <MapPin size={24} className="text-gold mb-3" />
                                        <span className="text-xl font-serif text-navy mb-1">{property.land_area}m²</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Terreno</span>
                                    </div>
                                )}
                                {property.pet_friendly && (
                                    <div className="flex flex-col items-center text-center p-4 bg-pearl/30 rounded-sm">
                                        <PawPrint size={24} className="text-gold mb-3" />
                                        <span className="text-xl font-serif text-navy mb-1">Sim</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Aceita Pet</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 text-gray-600 leading-relaxed font-light">
                                <p>
                                    {property.description || 'Descrição não disponível.'}
                                </p>
                            </div>

                            <div className="mt-10">
                                <h4 className="font-bold text-navy uppercase tracking-widest text-sm mb-6">Destaques do Imóvel</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {property.features && property.features.length > 0 ? (
                                        property.features.map((feat, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-600">
                                                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm">{feat}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">Nenhum destaque cadastrado.</p>
                                    )}
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

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full bg-pearl/30 border p-3 text-sm focus:outline-none transition-colors rounded-sm ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gold'}`}
                                        placeholder="Seu nome"
                                        disabled={isSubmitting}
                                    />
                                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">Email / Telefone</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        className={`w-full bg-pearl/30 border p-3 text-sm focus:outline-none transition-colors rounded-sm ${fieldErrors.contact ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gold'}`}
                                        placeholder="Seu contato"
                                        disabled={isSubmitting}
                                    />
                                    {fieldErrors.contact && <p className="text-red-500 text-xs mt-1">{fieldErrors.contact}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">Mensagem</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full bg-pearl/30 border border-gray-200 p-3 text-sm focus:outline-none focus:border-gold transition-colors rounded-sm h-32 resize-none"
                                        placeholder="Se tiver alguma dúvida específica..."
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>

                                {/* Honeypot Field */}
                                <input
                                    type="text"
                                    name="check_visit"
                                    value={formData.check_visit}
                                    onChange={handleInputChange}
                                    className="opacity-0 absolute -z-10 w-0 h-0"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-sm transition-all uppercase tracking-widest text-xs shadow-lg transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400 mb-2">Ou fale diretamente comigo</p>
                                <a href="https://wa.me/5521990132992" className="text-gold font-bold hover:underline text-sm">
                                    (21) 99013-2992
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
