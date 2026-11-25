import { z } from 'zod';

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const optionalPositiveInt = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  },
  z.number().int().min(0, 'Deve ser 0 ou maior').optional()
);

const optionalPositiveNum = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  },
  z.number().min(0, 'Deve ser 0 ou maior').optional()
);

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3, 'Título deve ter no mínimo 3 caracteres').max(160),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(180)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  price: z.string().trim().min(2, 'Informe o preço (ex.: R$ 280.000)').max(60),
  type: z.string().trim().min(1, 'Selecione o tipo de negociação'),
  category: z.string().trim().min(1, 'Selecione a categoria do imóvel'),
  zone: z.string().trim().min(1, 'Selecione a zona'),
  location: z.string().trim().min(2, 'Informe o bairro / localização').max(120),
  beds: z.coerce.number().int().min(0, 'Número de quartos inválido').max(50),
  baths: z.coerce.number().int().min(0, 'Número de banheiros inválido').max(50),
  area: z.string().trim().min(1, 'Informe a área (ex.: 54m²)').max(40),
  suites: optionalPositiveInt,
  parking: optionalPositiveInt,
  built_area: optionalPositiveNum,
  land_area: optionalPositiveNum,
  pet_friendly: z.boolean().default(false),
  description: z.string().trim().max(8000).optional(),
  video: z
    .string()
    .trim()
    .refine(
      (val) => !val || val.startsWith('https://'),
      'A URL do vídeo deve começar com https://'
    )
    .optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
