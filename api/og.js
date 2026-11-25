function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  const rawSlug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;

  if (!rawSlug || !/^[a-zA-Z0-9-]+$/.test(rawSlug)) {
    return res.status(400).send('Invalid property slug');
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  try {
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    };

    let response = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?slug=eq.${encodeURIComponent(rawSlug)}&select=title,description,image,slug,published`,
      { headers }
    );

    if (!response.ok) {
      response = await fetch(
        `${SUPABASE_URL}/rest/v1/properties?slug=eq.${encodeURIComponent(rawSlug)}&select=title,description,image,slug`,
        { headers }
      );
    }

    const data = await response.json();
    const property = Array.isArray(data) ? data[0] : null;

    if (!property || property.published === false) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      return res.status(404).send('Property not found');
    }

    const title = escapeHtml(`${property.title} | Fabrício Magioli`);
    const description = escapeHtml(
      property.description?.substring(0, 160) || 'Confira este imóvel exclusivo.'
    );
    const rawImage = property.image && property.image[0] ? String(property.image[0]) : '';
    const image = rawImage.startsWith('https://') ? escapeHtml(rawImage) : '';
    const url = escapeHtml(`https://www.fabriciomagioli.com.br/imovel/${encodeURIComponent(rawSlug)}`);

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  ${image ? `<meta property="og:image" content="${image}" />` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  ${image ? `<meta name="twitter:image" content="${image}" />` : ''}

  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <p>Redirecionando para o imóvel...</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching property for OG:', error);
    res.status(500).send('Internal Server Error');
  }
}
