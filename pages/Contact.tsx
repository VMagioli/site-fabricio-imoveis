import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { z } from 'zod';
import SEO from '../components/SEO';

interface ContactFormData {
  name: string;
  phone: string;
  pretension: string;
  message: string;
  cidade_check?: string;
}

const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .regex(/^[a-zA-Z\u00C0-\u00FF\s]*$/, 'Nome inválido')
    .transform((val) => val.replace(/[<>]/g, '')),
  phone: z
    .string()
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .transform((val) => val.replace(/[<>]/g, '')),
  pretension: z.string().min(1, 'Selecione uma opção'),
  message: z.string().optional(),
});

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();
  const [formError, setFormError] = useState('');

  const onSubmit = (data: ContactFormData) => {
    setFormError('');

    if (data.cidade_check) {
      return;
    }

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }

    const validData = result.data;
    const text = `Olá, me chamo ${validData.name}. Minha pretensão é ${validData.pretension}. ${validData.message || ''}. Contato: ${validData.phone}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5521990132992?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main id="conteudo-principal" className="pt-32 pb-20 container mx-auto px-6 min-h-screen bg-pearl">
      <SEO
        title="Fale Conosco"
        description="Entre em contato pelo WhatsApp com Fabrício Magioli e veja como é fácil comprar seu imóvel no Rio de Janeiro. Aprovamos seu crédito com agilidade."
      />
      <h1 className="text-4xl md:text-5xl font-serif text-navy mb-6">Entre em Contato</h1>
      <p className="text-lg text-gray-700 mb-12 max-w-2xl">
        Estou pronto para tirar suas dúvidas e te ajudar a dar o próximo passo rumo ao seu novo lar.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 shadow-lg rounded-sm border border-gray-100">
          <h2 className="text-2xl font-serif text-navy mb-6">Fale Conosco</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Formulário de contato">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide"
              >
                Nome
              </label>
              <input
                id="contact-name"
                {...register('name', { required: 'Nome é obrigatório' })}
                type="text"
                autoComplete="name"
                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${
                  errors.name ? 'border-red-600' : 'border-gray-400 focus:border-gold-dark'
                }`}
                placeholder="Seu nome completo"
              />
              {errors.name && (
                <span role="alert" className="text-red-700 text-xs mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide"
              >
                Telefone
              </label>
              <input
                id="contact-phone"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                type="tel"
                autoComplete="tel"
                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${
                  errors.phone ? 'border-red-600' : 'border-gray-400 focus:border-gold-dark'
                }`}
                placeholder="(21) 99999-9999"
              />
              {errors.phone && (
                <span role="alert" className="text-red-700 text-xs mt-1 block">
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-pretension"
                className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide"
              >
                Pretensão
              </label>
              <select
                id="contact-pretension"
                {...register('pretension', { required: 'Selecione uma opção' })}
                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${
                  errors.pretension ? 'border-red-600' : 'border-gray-400 focus:border-gold-dark'
                }`}
              >
                <option value="">Selecione...</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Investimento">Investimento</option>
              </select>
              {errors.pretension && (
                <span role="alert" className="text-red-700 text-xs mt-1 block">
                  {errors.pretension.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide"
              >
                Mensagem
              </label>
              <textarea
                id="contact-message"
                {...register('message')}
                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent h-32 resize-none ${
                  errors.message ? 'border-red-600' : 'border-gray-400 focus:border-gold-dark'
                }`}
                placeholder="Como podemos ajudar?"
              />
              {errors.message && (
                <span role="alert" className="text-red-700 text-xs mt-1 block">
                  {errors.message.message}
                </span>
              )}
            </div>

            <div hidden aria-hidden="true">
              <input
                {...register('cidade_check')}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            {formError && (
              <p role="alert" className="text-red-700 text-sm font-medium">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white font-bold py-4 px-8 rounded-sm transition-all w-full uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Enviar via WhatsApp
            </button>

            <p className="text-xs text-gray-600 leading-relaxed">
              Ao clicar em enviar, seu nome, telefone, pretensão e mensagem serão abertos no aplicativo <strong>WhatsApp</strong> para atendimento direto com o corretor. Saiba mais na nossa{' '}
              <Link to="/politica-de-privacidade" className="text-royal underline hover:text-navy">
                Política de Privacidade
              </Link>
              .
            </p>
          </form>
        </div>

        <div>
          <div className="bg-navy p-8 text-white rounded-sm mb-8 shadow-lg">
            <h2 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
              <MapPin size={20} aria-hidden="true" /> Agende sua reunião com o corretor em Campo Grande
            </h2>
            <p className="font-light text-pearl/90">
              Horário de atendimento: <br />
              Segunda a Sexta, das 9h às 18h
              <br />
              Sábado, das 9h às 14h
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-gold/30 shadow-lg">
            <h2 className="text-xl font-serif text-navy mb-6">Contato Direto</h2>
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-navy">
                <MessageCircle size={18} className="text-gold-dark" aria-hidden="true" />
                <a href="tel:+5521990132992" className="hover:text-gold-dark transition-colors">
                  (21) 99013-2992
                </a>
              </p>
              <p className="flex items-center gap-3 text-navy">
                <Mail size={18} className="text-gold-dark" aria-hidden="true" />
                <a href="mailto:magiolifabricio@gmail.com" className="hover:text-gold-dark transition-colors">
                  magiolifabricio@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
