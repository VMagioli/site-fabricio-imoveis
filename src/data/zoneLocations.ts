/**
 * Mapeamento oficial Zona -> Bairros do RJ para evitar combinações incompatíveis na busca
 * (ex.: Zona Sul + Campo Grande).
 */
export const ZONE_LOCATIONS_MAP: Record<string, string[]> = {
  'Zona Oeste': [
    'Bangu',
    'Campo Grande',
    'Santa Cruz',
    'Taquara',
    'Barra da Tijuca',
    'Barra Olímpica',
    'Recreio dos Bandeirantes',
    'Jacarepaguá',
    'Freguesia',
    'Pechincha',
    'Realengo',
    'Guaratiba',
    'Paciência',
    'Sepetiba',
    'Cosmos',
    'Inhoaíba',
    'Senador Vasconcelos',
    'Santíssimo',
    'Padre Miguel',
  ],
  'Zona Sudoeste': [
    'Barra da Tijuca',
    'Barra Olímpica',
    'Recreio dos Bandeirantes',
    'Jacarepaguá',
    'Taquara',
    'Freguesia',
    'Pechincha',
    'Camorim',
    'Curicica',
    'Vargem Grande',
    'Vargem Pequena',
  ],
  'Zona Norte': [
    'Cachambi',
    'Irajá',
    'Olaria',
    'Rio Comprido',
    'São Cristóvão',
    'Tijuca',
    'Méier',
    'Vila Isabel',
    'Maracanã',
    'Grajaú',
    'Madureira',
    'Penha',
    'Bonsucesso',
    'Ramos',
    'Del Castilho',
    'Engenho Novo',
    'Engenho de Dentro',
    'Pilares',
    'Piedade',
    'Todos os Santos',
    'Ilha do Governador',
  ],
  'Zona Sul': [
    'Botafogo',
    'Catete',
    'Copacabana',
    'Cosme Velho',
    'Flamengo',
    'Gávea',
    'Glória',
    'Humaitá',
    'Ipanema',
    'Jardim Botânico',
    'Lagoa',
    'Laranjeiras',
    'Leblon',
    'Leme',
    'São Conrado',
    'Urca',
  ],
  'Porto Maravilha': [
    'Santo Cristo',
    'Centro',
    'Gamboa',
    'Saúde',
    'Zona Portuária e Centro',
  ],
  'Zona Portuária': [
    'Santo Cristo',
    'Centro',
    'Gamboa',
    'Saúde',
    'Zona Portuária e Centro',
  ],
  Centro: [
    'Centro',
    'Santo Cristo',
    'Lapa',
    'Santa Teresa',
    'Cidade Nova',
    'Estácio',
    'Rio Comprido',
    'Zona Portuária e Centro',
  ],
  Niterói: [
    'Niterói',
    'Icaraí',
    'Ingá',
    'Santa Rosa',
    'São Francisco',
    'Charitas',
    'Piratininga',
    'Itaipu',
    'Fonseca',
  ],
  'Baixada Fluminense': [
    'Nova Iguaçu',
    'Duque de Caxias',
    'Nilópolis',
    'São João de Meriti',
    'Mesquita',
    'Belford Roxo',
  ],
};

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Retorna os bairros compatíveis com a zona selecionada.
 * Se a zona for "Todas" (ou uma zona customizada nova sem mapeamento), retorna todos os bairros.
 */
export function getLocationsForZone(zone: string, allLocations: string[]): string[] {
  if (!zone || zone === 'Todas') {
    return allLocations;
  }

  const mapped = ZONE_LOCATIONS_MAP[zone];
  if (!mapped) {
    return allLocations;
  }

  const mappedSet = new Set(mapped.map(normalize));
  const filtered = allLocations.filter((loc) => mappedSet.has(normalize(loc)));

  // Se nenhum bairro cadastrado na lista bater com o mapa (ex.: Zona Sul ainda sem bairros na lista),
  // retorna a lista mapeada padrão para a zona não ficar vazia ou mostrar bairros de outra zona.
  return filtered.length > 0 ? filtered : mapped;
}

export function isLocationCompatibleWithZone(
  location: string,
  zone: string,
  allLocations: string[]
): boolean {
  if (!location || location === 'Todos os Bairros' || !zone || zone === 'Todas') {
    return true;
  }
  const allowed = getLocationsForZone(zone, allLocations);
  const normLoc = normalize(location);
  return allowed.some((item) => normalize(item) === normLoc);
}
