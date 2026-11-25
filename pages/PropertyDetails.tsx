import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BedDouble,
  Bath,
  Square,
  MapPin,
  ArrowLeft,
  Check,
  Share2,
  CarFront,
  Ruler,
  PawPrint,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Property } from '../types';
import { z } from 'zod';
import SEO from '../components/SEO';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Video from 'yet-another-react-lightbox/plugins/video';

const visitSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  contact: z.string().min(10, 'Contato (Email ou Telefone) deve ter no mínimo 10 caracteres'),
  message: z.string().optional(),
  check_visit: z.string().optional(),
});

const PropertyDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    name: '',
    contact: '',
    message: '',
    check_visit: '',
  });
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [submitFeedback, setSubmitFeedback] = React.useState('');
  const [shareFeedback, setShareFeedback] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProperty = async () => {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', slug)
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
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
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
        setShareFeedback('Link copiado!');
        setTimeout(() => setShareFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const nextImage = () => {
    if (!property) return;
    const totalSlides = property.image.length + (property.video ? 1 : 0);
    setCurrentImageIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevImage = () => {
    if (!property) return;
    const totalSlides = property.image.length + (property.video ? 1 : 0);
    setCurrentImageIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.check_visit) {
      setIsSubmitting(true);
      setTimeout(() => setIsSubmitting(false), 1000);
      return;
    }

    const result = visitSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback('');

    const propertyRef = `ID ${property?.id || 'N/A'} - ${property?.title || 'Unknown'}`;

    try {
      const { error: dbError } = await supabase.from('leads').insert([
        {
          name: formData.name,
          contact: formData.contact,
          message: formData.message,
          property_ref: propertyRef,
        },
      ]);

      if (dbError) console.error('Erro ao salvar lead:', dbError);
    } catch (err) {
      console.error('Erro inesperado ao salvar lead:', err);
    }

    let text = `Olá, tenho interesse no imóvel ${property?.title}. Gostaria de agendar uma visita.`;
    if (formData.message) {
      text += `\n\nMensagem: ${formData.message}`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5521990132992?text=${encodedText}`;

    setSubmitFeedback('Solicitação recebida com sucesso! Abrindo WhatsApp...');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setIsSubmitting(false);
      setFormData({ name: '', contact: '', message: '', check_visit: '' });
    }, 800);
  };

  if (loading) {
    return (
      <main id="conteudo-principal" className="min-h-screen flex items-center justify-center bg-pearl pt-24">
        <p role="status" className="text-navy font-serif text-xl animate-pulse">
          Carregando detalhes do imóvel...
        </p>
      </main>
    );
  }

  if (!property) {
    return (
      <main id="conteudo-principal" className="min-h-screen flex flex-col items-center justify-center bg-pearl pt-24 px-6 text-center">
        <h1 className="text-3xl font-serif text-navy mb-4">
          {error || 'Imóvel não encontrado'}
        </h1>
        <Link to="/" className="text-gold-dark font-bold hover:underline uppercase tracking-widest text-sm">
          Voltar para Início
        </Link>
      </main>
    );
  }

  const numericPrice = property.price
    ? Number(property.price.replace(/[^\d,]/g, '').replace(',', '.')) || undefined
    : undefined;

  const listingJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        name: property.title,
        description:
          property.description?.substring(0, 300) ||
          `Confira ${property.title} em ${property.location}.`,
        url: `https://www.fabriciomagioli.com.br/imovel/${property.slug}`,
        image: property.image,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          ...(numericPrice ? { price: numericPrice } : {}),
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'RealEstateAgent',
            name: 'Fabrício Magioli Imóveis',
            url: 'https://www.fabriciomagioli.com.br/',
          },
        },
        about: {
          '@type': 'Residence',
          name: property.title,
          numberOfBedrooms: property.beds,
          numberOfBathroomsTotal: property.baths,
          address: {
            '@type': 'PostalAddress',
            addressLocality: property.location,
            addressRegion: 'RJ',
            addressCountry: 'BR',
          },
        },
      },
      {
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
          {
            '@type': 'ListItem',
            position: 3,
            name: property.title,
            item: `https://www.fabriciomagioli.com.br/imovel/${property.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <main id="conteudo-principal" className="bg-pearl min-h-screen pb-20">
      <SEO
        title={`${property.title} em ${property.location}`}
        description={
          property.description?.substring(0, 155) || 'Confira os detalhes deste imóvel exclusivo no Rio de Janeiro.'
        }
        image={property.image?.[0]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(listingJsonLd)}</script>
      </Helmet>
      {/* Header / Breadcrumb */}
      <div className="bg-navy pt-32 pb-12">
        <div className="container mx-auto px-6">
          <Link
            to="/imoveis"
            className="text-white/85 hover:text-gold transition-colors inline-flex items-center gap-2 mb-6 uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Voltar para Imóveis
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-2 block">
                {property.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-white mb-4 leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin size={18} className="text-gold" aria-hidden="true" />
                <span className="font-light">{property.location}</span>
              </div>
            </div>
            <div className="flex flex-col md:items-end">
              <span className="text-white/80 text-sm uppercase tracking-widest mb-1">A partir de</span>
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
            {/* Gallery */}
            <div className="bg-white p-2 rounded-sm shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-sm group bg-black">
                {property.video && currentImageIndex === property.image.length ? (
                  <video src={property.video} controls className="w-full h-full object-contain" />
                ) : (
                  <img
                    src={property.image[currentImageIndex]}
                    alt={`Foto de ${property.title} — imagem ${currentImageIndex + 1}`}
                    width={960}
                    height={540}
                    decoding="async"
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-105 cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(currentImageIndex);
                      setLightboxOpen(true);
                    }}
                  />
                )}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  {shareFeedback && (
                    <span role="status" className="bg-navy text-white text-xs px-3 py-2 rounded-sm shadow-lg">
                      {shareFeedback}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Compartilhar este imóvel"
                    className="bg-white/95 p-3 rounded-full hover:bg-gold hover:text-navy transition-colors text-navy shadow-lg"
                    title="Compartilhar"
                  >
                    <Share2 size={20} aria-hidden="true" />
                  </button>
                </div>

                {/* Navigation Arrows */}
                {property.image.length + (property.video ? 1 : 0) > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      aria-label="Foto anterior"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-gold hover:text-navy text-navy transition-colors shadow-lg z-10"
                    >
                      <ChevronLeft size={24} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      aria-label="Próxima foto"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-gold hover:text-navy text-navy transition-colors shadow-lg z-10"
                    >
                      <ChevronRight size={24} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-row overflow-x-auto gap-2 mt-2 pb-2">
                {property.image.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`Ver foto ${idx + 1} de ${property.title}`}
                    aria-current={currentImageIndex === idx ? 'true' : undefined}
                    className={`flex-shrink-0 w-24 h-16 overflow-hidden rounded-sm cursor-pointer transition-opacity ${
                      currentImageIndex === idx ? 'opacity-100 ring-2 ring-gold-dark' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      width={96}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      alt={`Miniatura ${idx + 1} de ${property.title}`}
                    />
                  </button>
                ))}
                {property.video && (
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex(property.image.length)}
                    aria-label={`Assistir vídeo de ${property.title}`}
                    aria-current={currentImageIndex === property.image.length ? 'true' : undefined}
                    className={`flex-shrink-0 w-24 h-16 overflow-hidden rounded-sm cursor-pointer transition-opacity bg-black flex items-center justify-center ${
                      currentImageIndex === property.image.length
                        ? 'opacity-100 ring-2 ring-gold-dark'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Play size={24} className="text-white" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Key Info */}
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl text-navy mb-8">Características Principais</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6 border-b border-gray-100 pb-8 mb-8">
                <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                  <BedDouble size={24} className="text-gold-dark mb-2" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-widest text-gray-600">até</span>
                  <span className="text-xl font-serif text-navy mb-1">{property.beds}</span>
                  <span className="text-xs uppercase tracking-widest text-gray-600">Quartos</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                  <Bath size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                  <span className="text-xl font-serif text-navy mb-1">{property.baths}</span>
                  <span className="text-xs uppercase tracking-widest text-gray-600">Banheiros</span>
                </div>
                {property.suites && (
                  <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                    <BedDouble size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                    <span className="text-xl font-serif text-navy mb-1">{property.suites}</span>
                    <span className="text-xs uppercase tracking-widest text-gray-600">Suítes</span>
                  </div>
                )}
                {property.parking && (
                  <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                    <CarFront size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                    <span className="text-xl font-serif text-navy mb-1">{property.parking}</span>
                    <span className="text-xs uppercase tracking-widest text-gray-600">Vagas</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                    <Square size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                    <span className="text-xl font-serif text-navy mb-1">{property.area}</span>
                    <span className="text-xs uppercase tracking-widest text-gray-600">Área Total</span>
                  </div>
                )}
                {property.built_area && (
                  <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                    <Ruler size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                    <span className="text-xl font-serif text-navy mb-1">{property.built_area}m²</span>
                    <span className="text-xs uppercase tracking-widest text-gray-600">Área Const.</span>
                  </div>
                )}
                {property.land_area && (
                  <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                    <MapPin size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                    <span className="text-xl font-serif text-navy mb-1">{property.land_area}m²</span>
                    <span className="text-xs uppercase tracking-widest text-gray-600">Terreno</span>
                  </div>
                )}
                {property.pet_friendly && (
                  <div className="flex flex-col items-center text-center p-4 bg-pearl rounded-sm">
                    <PawPrint size={24} className="text-gold-dark mb-3" aria-hidden="true" />
                    <span className="text-xl font-serif text-navy mb-1">Sim</span>
                    <span className="text-xs uppercase tracking-widest text-gray-600">Aceita Pet</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 text-gray-800 leading-relaxed font-normal text-base">
                {property.description ? (
                  property.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-left">
                      {paragraph || <br />}
                    </p>
                  ))
                ) : (
                  <p>Descrição não disponível.</p>
                )}
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-navy uppercase tracking-widest text-sm mb-6">
                  Destaques do Imóvel
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features && property.features.length > 0 ? (
                    property.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-700">
                        <div
                          className="w-5 h-5 rounded-full bg-gold/25 flex items-center justify-center text-gold-dark flex-shrink-0"
                          aria-hidden="true"
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm">{feat}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm italic">Nenhum destaque cadastrado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-white p-8 rounded-sm shadow-xl border-t-4 border-gold">
              <div className="mb-8 text-center">
                <span className="text-gold-dark font-bold tracking-[0.2em] uppercase text-xs block mb-2">
                  Interessado?
                </span>
                <h2 className="font-serif text-2xl text-navy">Agende uma Visita</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulário de agendamento de visita">
                <div>
                  <label
                    htmlFor="visit-name"
                    className="block text-xs font-bold text-navy uppercase tracking-wide mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="visit-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-pearl/50 border p-3 text-sm focus:outline-none transition-colors rounded-sm ${
                      fieldErrors.name ? 'border-red-600 focus:border-red-600' : 'border-gray-300 focus:border-gold-dark'
                    }`}
                    placeholder="Seu nome"
                    disabled={isSubmitting}
                  />
                  {fieldErrors.name && (
                    <p role="alert" className="text-red-700 text-xs mt-1">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="visit-contact"
                    className="block text-xs font-bold text-navy uppercase tracking-wide mb-2"
                  >
                    Email / Telefone
                  </label>
                  <input
                    id="visit-contact"
                    type="text"
                    name="contact"
                    autoComplete="tel"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`w-full bg-pearl/50 border p-3 text-sm focus:outline-none transition-colors rounded-sm ${
                      fieldErrors.contact
                        ? 'border-red-600 focus:border-red-600'
                        : 'border-gray-300 focus:border-gold-dark'
                    }`}
                    placeholder="Seu contato"
                    disabled={isSubmitting}
                  />
                  {fieldErrors.contact && (
                    <p role="alert" className="text-red-700 text-xs mt-1">
                      {fieldErrors.contact}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="visit-message"
                    className="block text-xs font-bold text-navy uppercase tracking-wide mb-2"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="visit-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-pearl/50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-gold-dark transition-colors rounded-sm h-32 resize-none"
                    placeholder="Se tiver alguma dúvida específica..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Honeypot Field hidden from accessibility tree */}
                <div hidden aria-hidden="true">
                  <input
                    type="text"
                    name="check_visit"
                    value={formData.check_visit}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-sm transition-all uppercase tracking-widest text-xs shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </button>

                {submitFeedback && (
                  <p role="status" aria-live="polite" className="text-xs text-navy font-medium text-center">
                    {submitFeedback}
                  </p>
                )}
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-600 mb-2">Ou fale diretamente comigo</p>
                <a
                  href="https://wa.me/5521990132992"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-dark font-bold hover:underline text-sm"
                >
                  (21) 99013-2992
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {property && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={[
            ...property.image.map((src) => ({ src })),
            ...(property.video
              ? [{ type: 'video' as const, sources: [{ src: property.video, type: 'video/mp4' }] }]
              : []),
          ]}
          plugins={[Zoom, Video]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
          }}
        />
      )}
    </main>
  );
};

export default PropertyDetails;
