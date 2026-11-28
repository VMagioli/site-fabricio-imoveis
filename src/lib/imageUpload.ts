import { supabase } from './supabase';

export const STORAGE_BUCKET = 'property-media';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];
const MAX_IMAGE_INPUT_BYTES = 15 * 1024 * 1024; // 15 MB antes da compressão
const MAX_VIDEO_BYTES = 30 * 1024 * 1024; // 30 MB
const MAX_IMAGE_DIMENSION = 1600;
const WEBP_QUALITY = 0.8;

export interface UploadedImageResult {
  url: string;
  originalBytes: number;
  compressedBytes: number;
  originalFormat: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Não foi possível ler a imagem selecionada.'));
    };
    img.src = objectUrl;
  });
}

/**
 * Converte automaticamente PNG, JPG ou WebP para WebP comprimido e redimensionado (máx 1600px).
 */
export async function compressImageToWebP(file: File): Promise<Blob> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Formato não suportado. Envie imagens em PNG, JPG ou WebP.');
  }
  if (file.size > MAX_IMAGE_INPUT_BYTES) {
    throw new Error('Imagem muito grande (máximo 15 MB antes da compressão).');
  }

  const img = await loadImage(file);
  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (targetWidth > MAX_IMAGE_DIMENSION || targetHeight > MAX_IMAGE_DIMENSION) {
    const ratio = Math.min(MAX_IMAGE_DIMENSION / targetWidth, MAX_IMAGE_DIMENSION / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Falha ao inicializar compressão de imagem no navegador.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const webpBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
  );

  if (!webpBlob) {
    throw new Error('Falha ao converter imagem para WebP.');
  }

  // Se o arquivo original já era WebP e menor que o recomprimido, mantém o menor
  if (file.type === 'image/webp' && file.size < webpBlob.size && img.naturalWidth <= MAX_IMAGE_DIMENSION) {
    return file;
  }

  return webpBlob;
}

export async function uploadPropertyImage(file: File): Promise<UploadedImageResult> {
  const compressedBlob = await compressImageToWebP(file);
  const fileId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filePath = `imoveis/${fileId}.webp`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, compressedBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao enviar imagem: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    originalBytes: file.size,
    compressedBytes: compressedBlob.size,
    originalFormat: file.type.replace('image/', '').toUpperCase(),
  };
}

async function hasValidMp4MagicBytes(file: File): Promise<boolean> {
  const headerBuffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(headerBuffer);
  // Cabeçalho ISO Base Media / MP4 contém 'ftyp' nos bytes 4..7 (0x66 0x74 0x79 0x70)
  return (
    bytes.length >= 8 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  );
}

export async function uploadPropertyVideo(file: File): Promise<string> {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Formato de vídeo não suportado. Envie arquivos MP4.');
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('Vídeo excede o limite de 30 MB.');
  }
  if (!(await hasValidMp4MagicBytes(file))) {
    throw new Error('Arquivo inválido: o conteúdo não corresponde a um vídeo MP4 válido.');
  }

  const fileId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filePath = `videos/${fileId}.mp4`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      contentType: 'video/mp4',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao enviar vídeo: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Remove um arquivo do bucket property-media caso a URL pertença ao nosso Supabase Storage.
 */
export async function deleteStorageMediaByUrl(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const filePath = decodeURIComponent(url.slice(idx + marker.length));
  if (!filePath) return;

  await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
}
