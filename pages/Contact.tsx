import React from 'react';
import { useForm } from 'react-hook-form';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

const Contact: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();

    const onSubmit = (data: ContactFormData) => {
        const text = `Olá, meu nome é ${data.name}. ${data.message}. Meu contato: ${data.phone}, ${data.email}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/5521990132992?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen bg-pearl">
            <h1 className="text-4xl md:text-5xl font-serif text-navy mb-6">Entre em Contato</h1>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl">
                Estamos prontos para atender você com a exclusividade e discrição que você merece.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white p-8 shadow-lg rounded-sm border border-gray-100">
                    <h2 className="text-2xl font-serif text-navy mb-6">Fale Conosco</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Nome</label>
                            <input
                                {...register('name', { required: 'Nome é obrigatório' })}
                                type="text"
                                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-gold'}`}
                                placeholder="Seu nome completo"
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                            <input
                                {...register('email', {
                                    required: 'Email é obrigatório',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email inválido"
                                    }
                                })}
                                type="email"
                                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-gold'}`}
                                placeholder="seu@email.com"
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Telefone</label>
                            <input
                                {...register('phone', { required: 'Telefone é obrigatório' })}
                                type="tel"
                                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-gold'}`}
                                placeholder="(21) 99999-9999"
                            />
                            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Mensagem</label>
                            <textarea
                                {...register('message', { required: 'Mensagem é obrigatória' })}
                                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent h-32 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300 focus:border-gold'}`}
                                placeholder="Como podemos ajudar?"
                            ></textarea>
                            {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
                        </div>
                        <button type="submit" className="bg-navy hover:bg-navy/90 text-white font-bold py-4 px-8 rounded-sm transition-all w-full uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                            <MessageCircle size={18} />
                            Enviar via WhatsApp
                        </button>
                    </form>
                </div>

                <div>
                    <div className="bg-navy p-8 text-white rounded-sm mb-8 shadow-lg">
                        <h3 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
                            <MapPin size={20} /> Escritório
                        </h3>
                        <p className="mb-2 font-light">Av. Ataulfo de Paiva, 1235</p>
                        <p className="mb-2 font-light">Leblon, Rio de Janeiro - RJ</p>
                        <p className="font-light">CEP: 22440-034</p>
                    </div>

                    <div className="bg-white p-8 rounded-sm border border-gold/20 shadow-lg">
                        <h3 className="text-xl font-serif text-navy mb-6">Contato Direto</h3>
                        <div className="space-y-4">
                            <p className="flex items-center gap-3 text-navy">
                                <Phone size={18} className="text-gold" />
                                <span>(21) 2222-2222</span>
                            </p>
                            <p className="flex items-center gap-3 text-navy">
                                <MessageCircle size={18} className="text-gold" />
                                <span>(21) 99013-2992</span>
                            </p>
                            <p className="flex items-center gap-3 text-navy">
                                <Mail size={18} className="text-gold" />
                                <span>contato@fabriciomagioli.com.br</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
