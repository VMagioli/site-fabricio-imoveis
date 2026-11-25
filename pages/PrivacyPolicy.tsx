import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  return (
    <main id="conteudo-principal" className="pt-32 pb-20 container mx-auto px-6 min-h-screen bg-pearl">
      <SEO
        title="Política de Privacidade"
        description="Conheça a Política de Privacidade de Fabrício Magioli Imóveis em conformidade com a LGPD (Lei nº 13.709/2018)."
      />
      <h1 className="text-4xl md:text-5xl font-serif text-navy mb-8">Política de Privacidade</h1>
      <div className="bg-white p-8 md:p-12 shadow-lg rounded-sm border border-gray-100 max-w-none text-navy">
        <h2 className="text-2xl font-serif text-gold-dark mt-4 mb-4">1. Introdução</h2>
        <p className="mb-4">
          A sua privacidade é importante para nós. Esta política de privacidade tem como objetivo demonstrar o compromisso do Fabrício Magioli com a proteção dos dados pessoais coletados de seus clientes e visitantes do site, nos termos da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
        </p>
        <p className="mb-4">
          Ao utilizar o site{' '}
          <a href="https://www.fabriciomagioli.com.br" className="text-royal underline hover:text-navy">
            www.fabriciomagioli.com.br
          </a>
          , você manifesta ciência e concordância com as condições descritas nesta política.
        </p>
        <p className="mb-4">
          Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
        </p>
        <p className="mb-4">
          Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
        </p>
        <p className="mb-4">
          Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
        </p>
        <p className="mb-4">
          O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
        </p>

        <h2 className="text-2xl font-serif text-gold-dark mt-8 mb-4">2. Dados pessoais coletados</h2>
        <p className="mb-2">Podemos coletar as seguintes informações pessoais:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Nome completo;</li>
          <li>E-mail;</li>
          <li>Telefone;</li>
          <li>Endereço;</li>
          <li>Outras informações fornecidas voluntariamente para agendamento.</li>
        </ul>
        <p className="mb-4">
          O site poderá coletar dados de navegação de forma automática (cookies, endereço IP, geolocalização aproximada), sempre observando as normas de segurança.
        </p>

        <h2 className="text-2xl font-serif text-gold-dark mt-8 mb-4">3. Uso das informações</h2>
        <p className="mb-2">Seus dados pessoais são tratados para:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Agendamento e confirmação de visitas;</li>
          <li>Contato e envio de informações sobre imóveis e serviços;</li>
          <li>Melhorar a experiência do usuário;</li>
          <li>Enviar informações sobre novos imóveis.</li>
        </ul>

        <h2 className="text-2xl font-serif text-gold-dark mt-8 mb-4">4. Compromisso do Usuário</h2>
        <p className="mb-4">
          O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Fabrício Magioli oferece no site e com caráter enunciativo, mas não limitativo:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
          <li>Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, apostas desportivas, jogos de sorte e azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
          <li>Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Fabrício Magioli, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
        </ul>

        <h2 className="text-2xl font-serif text-gold-dark mt-8 mb-4">5. Compartilhamento e Segurança</h2>
        <p className="mb-4">
          Seus dados pessoais não são compartilhados com terceiros, salvo obrigação legal.
        </p>
        <p className="mb-4">
          Adotamos medidas técnicas (como senhas fortes e ambientes protegidos) para proteger seus dados contra acessos não autorizados. Os dados são mantidos pelo tempo necessário para fornecer os serviços solicitados.
        </p>

        <h2 className="text-2xl font-serif text-gold-dark mt-8 mb-4">6. Direitos do Titular</h2>
        <p className="mb-4">
          Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento. Para isso, entre em contato pelo e-mail{' '}
          <a href="mailto:magiolifabricio@gmail.com" className="text-royal underline hover:text-navy">
            magiolifabricio@gmail.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-serif text-gold-dark mt-8 mb-4">Mais informações</h2>
        <p className="mb-4">
          Esperamos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
        </p>
        <p className="mt-8 text-sm text-gray-600">
          Esta política é efetiva a partir de Janeiro/2026.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
