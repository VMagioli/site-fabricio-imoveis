
export default async function handler(req, res) {
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).send('Property slug is required');
    }

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/properties?slug=eq.${slug}&select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
            }
        );

        const data = await response.json();
        const property = data[0];

        if (!property) {
            return res.status(404).send('Property not found');
        }

        const title = `${property.title} | Fabrício Magioli`;
        const description = property.description?.substring(0, 160) || 'Confira este imóvel exclusivo.';
        const image = property.image && property.image[0] ? property.image[0] : '';
        const url = `https://fabricio-magioli-imoveis-de-luxo.vercel.app/imovel/${slug}`;

        const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <meta name="description" content="${description}" />
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${url}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="${url}" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${image}" />

        <meta http-equiv="refresh" content="0;url=${url}">
      </head>
      <body>
        <p>Redirecionando para o imóvel...</p>
      </body>
      </html>
    `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (error) {
        console.error('Error fetching property for OG:', error);
        res.status(500).send('Internal Server Error');
    }
}
