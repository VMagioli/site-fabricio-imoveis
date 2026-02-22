import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

export default function SEO({ title, description, image, url }: SEOProps) {
    const siteTitle = `${title} | Fabrício Magioli`;
    const shareUrl = url || window.location.href;

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name='description' content={description} />

            {/* Open Graph / Facebook */}
            <meta property='og:type' content='website' />
            <meta property='og:url' content={shareUrl} />
            <meta property='og:title' content={siteTitle} />
            <meta property='og:description' content={description} />
            {image && <meta property='og:image' content={image} />}

            {/* Twitter */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:url' content={shareUrl} />
            <meta name='twitter:title' content={siteTitle} />
            <meta name='twitter:description' content={description} />
            {image && <meta name='twitter:image' content={image} />}
        </Helmet>
    );
}
