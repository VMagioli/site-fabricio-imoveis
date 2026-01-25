import React from 'react';
import { useForm } from 'react-hook-form';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

import { z } from 'zod';

interface ContactFormData {
    name: string;
    phone: string;
    pretension: string;
    message: string;
    cidade_check?: string; // Honeypot
}

const contactSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').regex(/^[a-zA-Z\u00C0-\u00FF\s]*$/, 'Nome inválido').transform(val => val.replace(/[<>]/g, '')),
    phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos').transform(val => val.replace(/[<>]/g, '')),
    pretension: z.string().min(1, 'Selecione uma opção'),
    message: z.string().optional(),
});

const Contact: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();

    const onSubmit = (data: ContactFormData) => {
        // Honeypot check
        if (data.cidade_check) {
            console.log('Bot detected');
            return; // Silent fail
        }

        // Zod Validation
        const result = contactSchema.safeParse(data);
        if (!result.success) {
            alert(result.error.issues[0].message); // Simple alert for now, or could setFormError if I used setError
            return;
        }

        const validData = result.data;
        const text = `Olá, me chamo ${validData.name}. Minha pretensão é ${validData.pretension}. ${validData.message}. Contato: ${validData.phone}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/5521990132992?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen bg-pearl">
            <h1 className="text-4xl md:text-5xl font-serif text-navy mb-6">Entre em Contato</h1>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl">
                Estou pronto para tirar suas dúvidas e te ajudar a dar o próximo passo rumo ao seu novo lar.
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
                            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Pretensão</label>
                            <select
                                {...register('pretension', { required: 'Selecione uma opção' })}
                                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent ${errors.pretension ? 'border-red-500' : 'border-gray-300 focus:border-gold'}`}
                            >
                                <option value="">Selecione...</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Casa">Casa</option>
                                <option value="Terreno">Terreno</option>
                                <option value="Investimento">Investimento</option>
                            </select>
                            {errors.pretension && <span className="text-red-500 text-xs mt-1">{errors.pretension.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Mensagem</label>
                            <textarea
                                {...register('message')}
                                className={`w-full border-b py-2 focus:outline-none transition-colors bg-transparent h-32 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300 focus:border-gold'}`}
                                placeholder="Como podemos ajudar?"
                            ></textarea>
                            {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
                        </div>
                        <input
                            {...register('cidade_check')}
                            type="text"
                            className="absolute opacity-0 -z-10 w-0 h-0"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                        <button type="submit" className="bg-navy hover:bg-navy/90 text-white font-bold py-4 px-8 rounded-sm transition-all w-full uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                            <MessageCircle size={18} />
                            Enviar via WhatsApp
                        </button>
                    </form>
                </div>

                <div>
                    <div className="bg-navy p-8 text-white rounded-sm mb-8 shadow-lg">
                        <h3 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
                            <MapPin size={20} /> Agende sua reunião com o corretor em Campo Grande
                        </h3>
                        <p className="font-light">Horário de atendimento: <br /> Segunda a Sexta, das 9h às 18h<br /> Sábado, das 9h às 14h</p>
                    </div>

                    <div className="bg-white p-8 rounded-sm border border-gold/20 shadow-lg">
                        <h3 className="text-xl font-serif text-navy mb-6">Contato Direto</h3>
                        <div className="space-y-4">
                            <p className="flex items-center gap-3 text-navy">
                                <MessageCircle size={18} className="text-gold" />
                                <span>(21) 99013-2992</span>
                            </p>
                            <p className="flex items-center gap-3 text-navy">
                                <Mail size={18} className="text-gold" />
                                <span>magiolifabricio@gmail.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
