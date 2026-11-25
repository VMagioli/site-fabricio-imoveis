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

async function fetchPublishedProperties(supabaseUrl, supabaseKey) {
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };

  // Tenta consultar slug + published (sem depender de created_at, que pode não existir na tabela)
  let response = await fetch(
    `${supabaseUrl}/rest/v1/properties?select=slug,published`,
    { headers }
  );

  // Fallback caso a coluna published ainda não tenha sido aplicada na migration
  if (!response.ok) {
    response = await fetch(`${supabaseUrl}/rest/v1/properties?select=slug`, { headers });
  }

  if (!response.ok) {
    console.error('Sitemap properties fetch failed:', response.status, await response.text());
    return [];
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.filter((item) => item && item.slug && item.published !== false);
}

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  let properties = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      properties = await fetchPublishedProperties(SUPABASE_URL, SUPABASE_KEY);
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

  const propertyUrls = properties.map(
    (prop) => `  <url>
    <loc>${SITE_URL}/imovel/${escapeXml(encodeURIComponent(prop.slug))}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...neighborhoodUrls, ...propertyUrls].join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
