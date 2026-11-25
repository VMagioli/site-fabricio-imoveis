const SITE_URL = 'https://www.fabriciomagioli.com.br';

const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/imoveis', changefreq: 'daily', priority: '0.9' },
  { path: '/contato', changefreq: 'monthly', priority: '0.7' },
  { path: '/politica-de-privacidade', changefreq: 'yearly', priority: '0.3' },
];

const NEIGHBORHOOD_SLUGS = [
  'campo-grande',
  'bangu',
  'recreio-dos-bandeirantes',
  'barra-da-tijuca',
  'barra-olimpica',
  'santa-cruz',
  'niteroi',
  'centro-e-porto-maravilha',
  'zona-oeste',
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  let properties = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/properties?select=slug,created_at&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          properties = data.filter((item) => item && item.slug);
        }
      }
    } catch (error) {
      console.error('Error fetching properties for sitemap:', error);
    }
  }

  const staticUrls = STATIC_ROUTES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  );

  const neighborhoodUrls = NEIGHBORHOOD_SLUGS.map(
    (slug) => `  <url>
    <loc>${SITE_URL}/imoveis/${escapeXml(slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  );

  const propertyUrls = properties.map((prop) => {
    const lastmod = prop.created_at
      ? `\n    <lastmod>${new Date(prop.created_at).toISOString().split('T')[0]}</lastmod>`
      : '';
    return `  <url>
    <loc>${SITE_URL}/imovel/${escapeXml(encodeURIComponent(prop.slug))}</loc>${lastmod}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...neighborhoodUrls, ...propertyUrls].join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
