import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const SITE_ORIGIN = 'https://www.fabriciomagioli.com.br';

export default function SEO({ title, description, image, url }: SEOProps) {
  const siteTitle = title.includes('Fabrício Magioli')
    ? title
    : `${title} | Fabrício Magioli`;

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalUrl = url || `${SITE_ORIGIN}${pathname}`;
  const ogImage = image || `${SITE_ORIGIN}/images/hero-rj-desktop.webp`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
