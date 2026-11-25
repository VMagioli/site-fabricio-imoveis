import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Star,
  ArrowLeft as MoveLeft,
  ArrowRight as MoveRight,
  Plus,
  X,
  Loader2,
  Film,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../src/lib/supabase';
import { usePropertyOptions } from '../../src/hooks/usePropertyOptions';
import {
  deleteStorageMediaByUrl,
  formatFileSize,
  uploadPropertyImage,
  uploadPropertyVideo,
} from '../../src/lib/imageUpload';
import { propertyFormSchema, slugify } from '../../src/lib/propertySchema';
import type { Property } from '../../types';

interface ImageItem {
  url: string;
  savingsNote?: string;
}

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const options = usePropertyOptions();

  const [loadingRecord, setLoadingRecord] = useState(isEditing);
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Comprar');
  const [category, setCategory] = useState('Apartamento');
  const [zone, setZone] = useState('Zona Oeste');
  const [location, setLocation] = useState('Campo Grande');
  const [beds, setBeds] = useState('2');
  const [baths, setBaths] = useState('1');
  const [area, setArea] = useState('');
  const [suites, setSuites] = useState('');
  const [parking, setParking] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [petFriendly, setPetFriendly] = useState(false);
  const [published, setPublished] = useState(true);
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');

  // Features tags
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // Gallery
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [removedStorageUrls, setRemovedStorageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const loadProperty = async () => {
      setLoadingRecord(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          setFormError('Imóvel não encontrado.');
          return;
        }

        const prop = data as Property;
        setTitle(prop.title || '');
        setSlug(prop.slug || '');
        setPrice(prop.price || '');
        setType(prop.type || 'Comprar');
        setCategory(prop.category || 'Apartamento');
        setZone(prop.zone || 'Zona Oeste');
        setLocation(prop.location || '');
        setBeds(String(prop.beds ?? 2));
        setBaths(String(prop.baths ?? 1));
        setArea(prop.area || '');
        setSuites(prop.suites != null ? String(prop.suites) : '');
        setParking(prop.parking != null ? String(prop.parking) : '');
        setBuiltArea(prop.built_area != null ? String(prop.built_area) : '');
        setLandArea(prop.land_area != null ? String(prop.land_area) : '');
        setPetFriendly(Boolean(prop.pet_friendly));
        setPublished(prop.published !== false);
        setDescription(prop.description || '');
        setVideo(prop.video || '');
        setFeatures(Array.isArray(prop.features) ? prop.features : []);
        setImages(
          Array.isArray(prop.image) ? prop.image.map((url) => ({ url })) : []
        );
      } finally {
        setLoadingRecord(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) {
      setSlug(slugify(val));
    }
  };

  const handleAddFeature = () => {
    const clean = featureInput.trim();
    if (!clean || features.includes(clean)) return;
    setFeatures((prev) => [...prev, clean]);
    setFeatureInput('');
  };

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFormError('');
    setUploadingImages(true);

    try {
      const uploaded: ImageItem[] = [];
      for (const file of Array.from(fileList)) {
        const res = await uploadPropertyImage(file);
        const pct = Math.max(
          0,
          Math.round((1 - res.compressedBytes / Math.max(1, res.originalBytes)) * 100)
        );
        uploaded.push({
          url: res.url,
          savingsNote: `${formatFileSize(res.originalBytes)} ${res.originalFormat} → ${formatFileSize(res.compressedBytes)} WEBP${pct > 0 ? ` (-${pct}%)` : ''}`,
        });
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao enviar imagens.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVideoFileSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFormError('');
    setUploadingVideo(true);
    try {
      const uploadedUrl = await uploadPropertyVideo(fileList[0]);
      if (video) setRemovedStorageUrls((prev) => [...prev, video]);
      setVideo(uploadedUrl);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao enviar vídeo.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddImageByUrl = () => {
    const clean = imageUrlInput.trim();
    if (!clean.startsWith('https://')) {
      setFormError('A URL da imagem deve começar com https://');
      return;
    }
    setFormError('');
    setImages((prev) => [...prev, { url: clean }]);
    setImageUrlInput('');
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.unshift(moved);
      return next;
    });
  };

  const removeImage = (index: number) => {
    const target = images[index];
    if (target) {
      setRemovedStorageUrls((prev) => [...prev, target.url]);
    }
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    if (images.length === 0) {
      setFormError('Adicione pelo menos 1 foto do imóvel.');
      return;
    }

    const parsed = propertyFormSchema.safeParse({
      title,
      slug,
      price,
      type,
      category,
      zone,
      location,
      beds,
      baths,
      area,
      suites,
      parking,
      built_area: builtArea,
      land_area: landArea,
      pet_friendly: petFriendly,
      published,
      description,
      video: video.trim() || undefined,
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] || 'form');
        errs[key] = issue.message;
      });
      setFieldErrors(errs);
      setFormError('Revise os campos destacados abaixo.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...parsed.data,
        image: images.map((item) => item.url),
        features,
        video: parsed.data.video || null,
        suites: parsed.data.suites ?? null,
        parking: parsed.data.parking ?? null,
        built_area: parsed.data.built_area ?? null,
        land_area: parsed.data.land_area ?? null,
        description: parsed.data.description || '',
      };

      const { error } = isEditing
        ? await supabase.from('properties').update(payload).eq('id', id)
        : await supabase.from('properties').insert([payload]);

      if (error) {
        if (error.code === '23505') {
          setFieldErrors({ slug: 'Já existe um imóvel com este slug. Altere o campo Slug.' });
          setFormError('Slug duplicado.');
        } else {
          setFormError(`Erro ao salvar imóvel: ${error.message}`);
        }
        return;
      }

      // Remove do Storage mídias descartadas
      if (removedStorageUrls.length > 0) {
        await Promise.allSettled(
          removedStorageUrls.map((url) => deleteStorageMediaByUrl(url))
        );
      }

      navigate('/gestao', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  // Garante que valores já salvos no imóvel apareçam no select mesmo se removidos depois
  const withCurrent = (list: string[], current: string) =>
    current && !list.includes(current) ? [current, ...list] : list;

  return (
    <AdminLayout
      title={isEditing ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
      subtitle="As fotos em PNG/JPG são convertidas automaticamente para WebP comprimido antes de subir."
      actions={
        <Link
          to="/gestao"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy border border-gray-300 hover:border-gold-dark px-4 py-2.5 rounded-sm bg-white"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Voltar
        </Link>
      }
    >
      {loadingRecord ? (
        <div className="bg-white p-12 text-center rounded-sm border border-gray-200 text-gray-600">
          Carregando dados do imóvel...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl" noValidate>
          {formError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-800 text-sm font-medium p-4 rounded-sm">
              {formError}
            </div>
          )}

          {/* Bloco 1: Dados Principais */}
          <section className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-navy border-b border-gray-100 pb-3">
              Informações Principais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="prop-title" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Título do Imóvel *
                </label>
                <input
                  id="prop-title"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex.: Apartamento 2 Quartos com Lazer Completo em Campo Grande"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
                {fieldErrors.title && <p className="text-xs text-red-700 mt-1">{fieldErrors.title}</p>}
              </div>

              <div>
                <label htmlFor="prop-slug" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Slug da URL * (ex.: /imovel/meu-imovel)
                </label>
                <input
                  id="prop-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="apartamento-2-quartos-campo-grande"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm font-mono text-dark focus:outline-none focus:border-gold-dark"
                />
                {fieldErrors.slug && <p className="text-xs text-red-700 mt-1">{fieldErrors.slug}</p>}
              </div>

              <div>
                <label htmlFor="prop-price" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Preço Exibido *
                </label>
                <input
                  id="prop-price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex.: R$ 265.000"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
                {fieldErrors.price && <p className="text-xs text-red-700 mt-1">{fieldErrors.price}</p>}
              </div>

              <div>
                <label htmlFor="prop-type" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Tipo de Negociação *
                </label>
                <select
                  id="prop-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                >
                  {withCurrent(options.types, type).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="prop-category" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Categoria *
                </label>
                <select
                  id="prop-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                >
                  {withCurrent(options.categories, category).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="prop-zone" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Zona / Região *
                </label>
                <select
                  id="prop-zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                >
                  {withCurrent(options.zones, zone).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="prop-location" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                  Bairro / Localização *
                </label>
                <input
                  id="prop-location"
                  list="bairros-sugestoes"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex.: Campo Grande, Rio de Janeiro"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
                <datalist id="bairros-sugestoes">
                  {options.locations.map((loc) => (
                    <option key={loc} value={`${loc}, Rio de Janeiro`} />
                  ))}
                </datalist>
                {fieldErrors.location && <p className="text-xs text-red-700 mt-1">{fieldErrors.location}</p>}
              </div>
            </div>
          </section>

          {/* Bloco 2: Características */}
          <section className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-navy border-b border-gray-100 pb-3">
              Características & Medidas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label htmlFor="prop-beds" className="block text-xs font-bold text-navy uppercase mb-2">
                  Quartos *
                </label>
                <input
                  id="prop-beds"
                  type="number"
                  min={0}
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
              </div>

              <div>
                <label htmlFor="prop-baths" className="block text-xs font-bold text-navy uppercase mb-2">
                  Banheiros *
                </label>
                <input
                  id="prop-baths"
                  type="number"
                  min={0}
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
              </div>

              <div>
                <label htmlFor="prop-suites" className="block text-xs font-bold text-navy uppercase mb-2">
                  Suítes
                </label>
                <input
                  id="prop-suites"
                  type="number"
                  min={0}
                  value={suites}
                  onChange={(e) => setSuites(e.target.value)}
                  placeholder="Opcional"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
              </div>

              <div>
                <label htmlFor="prop-parking" className="block text-xs font-bold text-navy uppercase mb-2">
                  Vagas
                </label>
                <input
                  id="prop-parking"
                  type="number"
                  min={0}
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                  placeholder="Opcional"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
              </div>

              <div>
                <label htmlFor="prop-area" className="block text-xs font-bold text-navy uppercase mb-2">
                  Área Total *
                </label>
                <input
                  id="prop-area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex.: 54m²"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
                {fieldErrors.area && <p className="text-xs text-red-700 mt-1">{fieldErrors.area}</p>}
              </div>

              <div>
                <label htmlFor="prop-built-area" className="block text-xs font-bold text-navy uppercase mb-2">
                  Área Const. (m²)
                </label>
                <input
                  id="prop-built-area"
                  type="number"
                  min={0}
                  step="any"
                  value={builtArea}
                  onChange={(e) => setBuiltArea(e.target.value)}
                  placeholder="Opcional"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
              </div>

              <div>
                <label htmlFor="prop-land-area" className="block text-xs font-bold text-navy uppercase mb-2">
                  Terreno (m²)
                </label>
                <input
                  id="prop-land-area"
                  type="number"
                  min={0}
                  step="any"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="Opcional"
                  className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark"
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={petFriendly}
                    onChange={(e) => setPetFriendly(e.target.checked)}
                    className="w-4 h-4 accent-navy"
                  />
                  <span className="text-sm font-semibold text-navy">Aceita Pet</span>
                </label>
              </div>
            </div>
          </section>

          {/* Bloco 3: Descrição & Destaques */}
          <section className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-navy border-b border-gray-100 pb-3">
              Descrição & Destaques
            </h2>

            <div>
              <label htmlFor="prop-desc" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                Descrição Completa
              </label>
              <textarea
                id="prop-desc"
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os diferenciais, pontos de referência próximos, condições de financiamento e lazer..."
                className="w-full bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
              />
            </div>

            <div>
              <label htmlFor="prop-feature-input" className="block text-xs font-bold text-navy uppercase tracking-wide mb-2">
                Destaques do Imóvel (tags)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="prop-feature-input"
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Ex.: Piscina, Portaria 24h, Aceita FGTS..."
                  className="flex-1 bg-pearl border border-gray-300 rounded-sm px-3 py-2.5 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm inline-flex items-center gap-1"
                >
                  <Plus size={14} aria-hidden="true" />
                  Adicionar
                </button>
              </div>

              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1.5 bg-pearl border border-gray-200 text-navy text-xs font-semibold px-3 py-1.5 rounded-sm"
                    >
                      {feat}
                      <button
                        type="button"
                        onClick={() => setFeatures((prev) => prev.filter((f) => f !== feat))}
                        aria-label={`Remover destaque ${feat}`}
                        className="text-gray-500 hover:text-red-700"
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Bloco 4: Galeria de Fotos (Conversão Automática para WebP) & Vídeo */}
          <section className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-serif text-xl text-navy">Fotos e Vídeo</h2>
              <p className="text-xs text-gray-600 mt-1">
                Envie fotos em <strong>PNG, JPG ou WebP</strong>: o painel redimensiona (máx. 1600px), converte
                automaticamente para <strong>WebP</strong> e comprime para economizar Storage e manter o site rápido.
              </p>
            </div>

            {/* Upload box */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gold-dark bg-pearl/70 rounded-sm p-8 cursor-pointer transition-colors text-center">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                disabled={uploadingImages}
                onChange={(e) => {
                  handleFilesSelected(e.target.files);
                  e.target.value = '';
                }}
                className="sr-only"
              />
              {uploadingImages ? (
                <div className="flex items-center gap-2 text-navy font-semibold text-sm">
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  Convertendo para WebP e enviando...
                </div>
              ) : (
                <>
                  <Upload size={28} className="text-gold-dark mb-2" aria-hidden="true" />
                  <span className="text-sm font-bold text-navy">
                    Clique para selecionar fotos (pode escolher várias de uma vez)
                  </span>
                  <span className="text-xs text-gray-600 mt-1">
                    PNG, JPG ou WebP • Conversão e compressão WebP automáticas
                  </span>
                </>
              )}
            </label>

            {/* Fallback por URL externa */}
            <div className="flex gap-2">
              <label htmlFor="prop-img-url" className="sr-only">
                Ou cole uma URL de imagem HTTPS
              </label>
              <input
                id="prop-img-url"
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Ou cole a URL https:// de uma imagem já hospedada..."
                className="flex-1 bg-pearl border border-gray-300 rounded-sm px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-dark"
              />
              <button
                type="button"
                onClick={handleAddImageByUrl}
                className="bg-white border border-gray-300 hover:border-gold-dark text-navy text-xs font-bold px-4 py-2 rounded-sm"
              >
                Adicionar URL
              </button>
            </div>

            {/* Preview & Reorder Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((item, idx) => (
                  <div
                    key={`${item.url}-${idx}`}
                    className={`rounded-sm border overflow-hidden bg-pearl ${
                      idx === 0 ? 'border-gold-dark ring-2 ring-gold/40' : 'border-gray-200'
                    }`}
                  >
                    <div className="relative aspect-video bg-black/5">
                      <img src={item.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-gold text-navy text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
                          <Star size={11} aria-hidden="true" />
                          Capa
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 space-y-2">
                      {item.savingsNote && (
                        <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-sm">
                          {item.savingsNote}
                        </p>
                      )}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(idx, -1)}
                            disabled={idx === 0}
                            aria-label="Mover foto para esquerda"
                            className="p-1.5 bg-white border border-gray-200 rounded-sm text-navy disabled:opacity-40"
                          >
                            <MoveLeft size={13} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 1)}
                            disabled={idx === images.length - 1}
                            aria-label="Mover foto para direita"
                            className="p-1.5 bg-white border border-gray-200 rounded-sm text-navy disabled:opacity-40"
                          >
                            <MoveRight size={13} aria-hidden="true" />
                          </button>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(idx)}
                              className="text-[11px] font-bold text-gold-dark hover:underline px-1.5"
                            >
                              Capa
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          aria-label={`Remover foto ${idx + 1}`}
                          className="p-1.5 text-red-700 hover:bg-red-50 rounded-sm"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vídeo opcional */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <label htmlFor="prop-video" className="block text-xs font-bold text-navy uppercase tracking-wide">
                Vídeo do Imóvel (opcional — MP4 até 30 MB ou link HTTPS)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="prop-video"
                  type="url"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="https://... (ou faça upload ao lado)"
                  className="flex-1 bg-pearl border border-gray-300 rounded-sm p-3 text-sm text-dark focus:outline-none focus:border-gold-dark"
                />
                <label className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gold-dark text-navy text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-sm cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4"
                    disabled={uploadingVideo}
                    onChange={(e) => {
                      handleVideoFileSelected(e.target.files);
                      e.target.value = '';
                    }}
                    className="sr-only"
                  />
                  {uploadingVideo ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Film size={15} aria-hidden="true" />
                  )}
                  {uploadingVideo ? 'Enviando...' : 'Enviar MP4'}
                </label>
              </div>
              {fieldErrors.video && <p className="text-xs text-red-700">{fieldErrors.video}</p>}
            </div>
          </section>

          {/* Status de publicação & Submit */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="inline-flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-navy"
              />
              <span>
                <span className="block text-sm font-bold text-navy">
                  {published ? 'Publicado no site (visível ao público)' : 'Salvar como Rascunho (oculto no site)'}
                </span>
                <span className="block text-xs text-gray-600">
                  Desmarque para guardar como rascunho no painel /gestao sem exibir no catálogo público nem no sitemap.
                </span>
              </span>
            </label>

            <div className="flex items-center justify-end gap-4 flex-shrink-0">
              <Link
                to="/gestao"
                className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-navy px-4 py-3"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving || uploadingImages || uploadingVideo}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-sm shadow-lg transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    {isEditing
                      ? 'Salvar Alterações'
                      : published
                        ? 'Publicar Imóvel'
                        : 'Salvar Rascunho'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default PropertyForm;
