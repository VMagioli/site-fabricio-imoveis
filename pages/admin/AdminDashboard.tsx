import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Building2,
  Users,
  SlidersHorizontal,
  ShieldCheck,
  MessageCircle,
  Copy,
  Check,
  Loader2,
  QrCode,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../src/lib/supabase';
import { deleteStorageMediaByUrl } from '../../src/lib/imageUpload';
import { usePropertyOptions } from '../../src/hooks/usePropertyOptions';
import { useAuth } from '../../src/contexts/AuthContext';
import type { Lead, NewsletterSubscriber, OptionGroup, Property } from '../../types';

type TabKey = 'imoveis' | 'leads' | 'opcoes' | 'seguranca';

const OPTION_GROUP_META: { group: OptionGroup; title: string; placeholder: string }[] = [
  { group: 'type', title: 'Tipos de Negociação', placeholder: 'Ex.: Comprar, Alugar, Vender...' },
  { group: 'category', title: 'Categorias de Imóvel', placeholder: 'Ex.: Apartamento, Cobertura, Sala...' },
  { group: 'zone', title: 'Zonas / Regiões', placeholder: 'Ex.: Zona Oeste, Zona Sul...' },
  { group: 'location', title: 'Bairros', placeholder: 'Ex.: Campo Grande, Recreio...' },
];

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('aba') as TabKey) || 'imoveis';
  const [activeTab, setActiveTab] = useState<TabKey>(
    ['imoveis', 'leads', 'opcoes', 'seguranca'].includes(initialTab) ? initialTab : 'imoveis'
  );

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Leads & Newsletter state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Dynamic options state
  const options = usePropertyOptions();
  const [newOptionValues, setNewOptionValues] = useState<Record<OptionGroup, string>>({
    type: '',
    category: '',
    zone: '',
    location: '',
  });
  const [optionFeedback, setOptionFeedback] = useState('');
  const [savingGroup, setSavingGroup] = useState<OptionGroup | null>(null);

  // 2FA (MFA) state
  const { hasMfaEnrolled, refreshAuth } = useAuth();
  const [mfaFactors, setMfaFactors] = useState<{ id: string; friendly_name?: string; status: string }[]>([]);
  const [enrollData, setEnrollData] = useState<{
    id: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaMessage, setMfaMessage] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  const changeTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams(tab === 'imoveis' ? {} : { aba: tab }, { replace: true });
  };

  const fetchProperties = useCallback(async () => {
    setLoadingProperties(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProperties(data as Property[]);
      }
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const fetchLeadsAndNewsletter = useCallback(async () => {
    setLoadingLeads(true);
    try {
      const [{ data: leadsData }, { data: newsData }] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter').select('*').order('created_at', { ascending: false }),
      ]);
      if (leadsData) setLeads(leadsData as Lead[]);
      if (newsData) setSubscribers(newsData as NewsletterSubscriber[]);
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  const fetchMfaFactors = useCallback(async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    setMfaFactors(data?.totp ?? []);
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchLeadsAndNewsletter();
    fetchMfaFactors();
  }, [fetchProperties, fetchLeadsAndNewsletter, fetchMfaFactors]);

  // Delete property + clean Storage images/video
  const handleDeleteProperty = async (prop: Property) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${prop.title}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    setDeletingId(prop.id);
    try {
      const { error } = await supabase.from('properties').delete().eq('id', prop.id);
      if (error) {
        alert(`Erro ao excluir imóvel: ${error.message}`);
        return;
      }

      // Limpa arquivos associados no Storage (se pertencerem ao bucket)
      const mediaUrls = [
        ...(Array.isArray(prop.image) ? prop.image : []),
        ...(prop.video ? [prop.video] : []),
      ];
      await Promise.allSettled(mediaUrls.map((url) => deleteStorageMediaByUrl(url)));

      setProperties((prev) => prev.filter((item) => item.id !== prop.id));
    } finally {
      setDeletingId(null);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Deseja remover este lead da lista?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Delete newsletter subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('Deseja remover este e-mail da newsletter?')) return;
    const { error } = await supabase.from('newsletter').delete().eq('id', id);
    if (!error) setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCopyAllEmails = async () => {
    const list = subscribers.map((s) => s.email).join(', ');
    if (!list) return;
    await navigator.clipboard.writeText(list);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  // Add option
  const handleAddOption = async (group: OptionGroup, e: React.FormEvent) => {
    e.preventDefault();
    const label = newOptionValues[group].trim();
    if (!label) return;

    setSavingGroup(group);
    setOptionFeedback('');
    try {
      const nextOrder =
        options.raw.filter((item) => item.group_name === group).length + 1;

      const { error } = await supabase
        .from('property_options')
        .insert([{ group_name: group, label, sort_order: nextOrder }]);

      if (error) {
        setOptionFeedback(
          error.code === '23505'
            ? `"${label}" já está cadastrado nesta lista.`
            : `Erro ao salvar: ${error.message}`
        );
        return;
      }

      setNewOptionValues((prev) => ({ ...prev, [group]: '' }));
      await options.refresh();
      setOptionFeedback(`"${label}" adicionado com sucesso!`);
    } finally {
      setSavingGroup(null);
    }
  };

  // Delete option
  const handleDeleteOption = async (id: string, label: string) => {
    if (!window.confirm(`Remover "${label}" dos filtros do site?`)) return;
    setOptionFeedback('');
    const { error } = await supabase.from('property_options').delete().eq('id', id);
    if (error) {
      setOptionFeedback(`Erro ao remover: ${error.message}`);
      return;
    }
    await options.refresh();
    setOptionFeedback(`"${label}" removido.`);
  };

  // 2FA Enroll
  const handleStartMfaEnroll = async () => {
    setMfaBusy(true);
    setMfaError('');
    setMfaMessage('');
    try {
      // Remove fatores unverified antigos se houver
      const { data: existing } = await supabase.auth.mfa.listFactors();
      const unverified = (existing?.totp ?? []).filter((f) => f.status !== 'verified');
      for (const f of unverified) {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Google Authenticator — Fabrício Magioli',
      });

      if (error || !data) {
        setMfaError(error?.message || 'Não foi possível iniciar o cadastro do 2FA.');
        return;
      }

      setEnrollData({
        id: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
    } finally {
      setMfaBusy(false);
    }
  };

  const handleConfirmMfaEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData) return;
    const code = totpVerifyCode.replace(/\D/g, '');
    if (code.length !== 6) {
      setMfaError('Digite os 6 dígitos exibidos no Google Authenticator.');
      return;
    }

    setMfaBusy(true);
    setMfaError('');
    try {
      const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({
        factorId: enrollData.id,
      });
      if (chErr || !challenge) {
        setMfaError('Falha ao criar desafio 2FA.');
        return;
      }

      const { error: verErr } = await supabase.auth.mfa.verify({
        factorId: enrollData.id,
        challengeId: challenge.id,
        code,
      });

      if (verErr) {
        setMfaError('Código incorreto. Confira o horário do celular e tente novamente.');
        return;
      }

      setEnrollData(null);
      setTotpVerifyCode('');
      setMfaMessage('Autenticação em 2 etapas (2FA) ativada com sucesso!');
      await Promise.all([fetchMfaFactors(), refreshAuth()]);
    } finally {
      setMfaBusy(false);
    }
  };

  const handleDisableMfa = async (factorId: string) => {
    if (!window.confirm('Deseja desativar a autenticação em 2 etapas (2FA) desta conta?')) return;
    setMfaBusy(true);
    setMfaError('');
    setMfaMessage('');
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) {
        setMfaError(`Erro ao desativar 2FA: ${error.message}`);
        return;
      }
      setMfaMessage('2FA desativado.');
      await Promise.all([fetchMfaFactors(), refreshAuth()]);
    } finally {
      setMfaBusy(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      (p.zone || '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const buildWhatsappHref = (contact: string, name: string, ref?: string) => {
    const digits = contact.replace(/\D/g, '');
    if (digits.length < 10) return null;
    const phone = digits.startsWith('55') ? digits : `55${digits}`;
    const text = encodeURIComponent(
      `Olá ${name}, aqui é o Fabrício Magioli! Recebi seu contato${ref ? ` sobre ${ref}` : ''}. Como posso te ajudar?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <AdminLayout
      title="Gestão do Site"
      subtitle="Cadastre imóveis, gerencie filtros dinâmicos, acompanhe leads e proteja sua conta."
      actions={
        <Link
          to="/gestao/imoveis/novo"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm shadow transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          Novo Imóvel
        </Link>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Imóveis</span>
          <p className="font-serif text-3xl text-navy mt-1">{properties.length}</p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Leads Recebidos</span>
          <p className="font-serif text-3xl text-navy mt-1">{leads.length}</p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Newsletter</span>
          <p className="font-serif text-3xl text-navy mt-1">{subscribers.length}</p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Segurança 2FA</span>
          <p className={`font-serif text-2xl mt-1 ${hasMfaEnrolled ? 'text-emerald-700' : 'text-amber-700'}`}>
            {hasMfaEnrolled ? 'Protegido' : 'Pendente'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Seções do painel administrativo"
        className="flex flex-wrap gap-2 border-b border-gray-200 mb-8"
      >
        {[
          { id: 'imoveis' as TabKey, label: 'Imóveis', icon: Building2 },
          { id: 'leads' as TabKey, label: 'Leads & Newsletter', icon: Users },
          { id: 'opcoes' as TabKey, label: 'Filtros & Opções', icon: SlidersHorizontal },
          { id: 'seguranca' as TabKey, label: 'Segurança (2FA)', icon: ShieldCheck },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => changeTab(id)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === id
                ? 'border-gold-dark text-navy bg-white rounded-t-sm'
                : 'border-transparent text-gray-600 hover:text-navy'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: IMÓVEIS */}
      {activeTab === 'imoveis' && (
        <section aria-label="Lista de imóveis">
          <div className="bg-white p-4 rounded-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="admin-search" className="sr-only">
                Buscar imóveis
              </label>
              <input
                id="admin-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, bairro, zona ou categoria..."
                className="w-full bg-pearl border border-gray-200 rounded-sm py-2.5 pl-10 pr-4 text-sm text-dark focus:outline-none focus:border-gold-dark"
              />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              Exibindo {filteredProperties.length} de {properties.length} imóveis
            </span>
          </div>

          {loadingProperties ? (
            <div className="bg-white p-12 text-center rounded-sm border border-gray-200 text-gray-600">
              Carregando imóveis...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-sm border border-gray-200 space-y-4">
              <p className="text-gray-700">Nenhum imóvel encontrado.</p>
              <Link
                to="/gestao/imoveis/novo"
                className="inline-flex items-center gap-2 bg-navy text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-sm"
              >
                <Plus size={16} aria-hidden="true" />
                Cadastrar primeiro imóvel
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <article
                  key={prop.id}
                  className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video bg-navy/10">
                    {prop.image?.[0] ? (
                      <img
                        src={prop.image[0]}
                        alt={prop.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                        Sem imagem
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-navy/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                      {prop.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                      {prop.type}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-lg text-navy leading-snug mb-1">{prop.title}</h2>
                      <p className="text-xs text-gray-600">
                        {prop.location}
                        {prop.zone ? ` • ${prop.zone}` : ''}
                      </p>
                      <p className="text-base font-bold text-gold-dark mt-2">{prop.price}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {prop.beds} quartos • {prop.baths} banheiros • {prop.area}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                      <a
                        href={`/imovel/${prop.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-royal hover:underline"
                      >
                        Ver
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/gestao/imoveis/${prop.id}/editar`}
                          className="inline-flex items-center gap-1 text-xs font-bold bg-navy hover:bg-navy/90 text-white px-3 py-1.5 rounded-sm transition-colors"
                        >
                          <Pencil size={13} aria-hidden="true" />
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(prop)}
                          disabled={deletingId === prop.id}
                          aria-label={`Excluir ${prop.title}`}
                          className="inline-flex items-center gap-1 text-xs font-bold bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                          {deletingId === prop.id ? '...' : 'Excluir'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: LEADS & NEWSLETTER */}
      {activeTab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads Table */}
          <section aria-label="Leads recebidos" className="lg:col-span-2 bg-white rounded-sm border border-gray-200 shadow-sm p-6">
            <h2 className="font-serif text-xl text-navy mb-4">Solicitações de Visita (Leads)</h2>
            {loadingLeads ? (
              <p className="text-sm text-gray-600 py-6">Carregando leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-gray-600 py-6">Nenhum lead registrado ainda.</p>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => {
                  const waHref = buildWhatsappHref(lead.contact, lead.name, lead.property_ref);
                  return (
                    <div
                      key={lead.id}
                      className="p-4 bg-pearl rounded-sm border border-gray-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-navy text-sm">{lead.name}</span>
                          <span className="text-xs text-gray-600">{formatDate(lead.created_at)}</span>
                        </div>
                        <p className="text-sm text-royal font-medium">{lead.contact}</p>
                        {lead.property_ref && (
                          <p className="text-xs text-gray-700">
                            <strong>Imóvel:</strong> {lead.property_ref}
                          </p>
                        )}
                        {lead.message && (
                          <p className="text-xs text-gray-700 bg-white p-2.5 rounded-sm border border-gray-200 mt-2">
                            {lead.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {waHref && (
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-sm transition-colors"
                          >
                            <MessageCircle size={14} aria-hidden="true" />
                            WhatsApp
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          aria-label={`Excluir lead de ${lead.name}`}
                          className="p-2 text-red-700 hover:bg-red-100 rounded-sm transition-colors"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Newsletter List */}
          <section aria-label="Inscritos na newsletter" className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-serif text-xl text-navy">Newsletter ({subscribers.length})</h2>
              {subscribers.length > 0 && (
                <button
                  type="button"
                  onClick={handleCopyAllEmails}
                  className="inline-flex items-center gap-1 text-xs font-bold text-navy border border-gray-300 hover:border-gold-dark px-2.5 py-1.5 rounded-sm"
                >
                  {copiedEmails ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  {copiedEmails ? 'Copiado!' : 'Copiar'}
                </button>
              )}
            </div>

            {loadingLeads ? (
              <p className="text-sm text-gray-600 py-4">Carregando...</p>
            ) : subscribers.length === 0 ? (
              <p className="text-sm text-gray-600 py-4">Nenhum e-mail cadastrado.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <li key={sub.id} className="py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-navy font-medium truncate">{sub.email}</p>
                      <p className="text-[11px] text-gray-500">{formatDate(sub.created_at)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      aria-label={`Remover ${sub.email}`}
                      className="p-1.5 text-red-700 hover:bg-red-50 rounded-sm flex-shrink-0"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* TAB 3: FILTROS & OPÇÕES DINÂMICAS */}
      {activeTab === 'opcoes' && (
        <section aria-label="Gestão de filtros e opções">
          <div className="bg-white p-5 rounded-sm border border-gray-200 mb-6">
            <p className="text-sm text-gray-700">
              Adicione ou remova <strong>Tipos</strong> (ex.: Comprar, Alugar, Vender),{' '}
              <strong>Categorias</strong>, <strong>Zonas</strong> e <strong>Bairros</strong>. As alterações
              aparecem automaticamente na busca rápida da Home, nos filtros do catálogo e no formulário de
              cadastro de imóveis.
            </p>
            {optionFeedback && (
              <p role="status" className="mt-3 text-xs font-semibold text-navy bg-gold/20 border border-gold/40 px-3 py-2 rounded-sm">
                {optionFeedback}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPTION_GROUP_META.map(({ group, title, placeholder }) => {
              const items = options.raw.filter((item) => item.group_name === group);
              return (
                <div key={group} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h2 className="font-serif text-xl text-navy mb-4">{title}</h2>

                  <form
                    onSubmit={(e) => handleAddOption(group, e)}
                    className="flex gap-2 mb-5"
                  >
                    <label htmlFor={`opt-${group}`} className="sr-only">
                      Adicionar em {title}
                    </label>
                    <input
                      id={`opt-${group}`}
                      type="text"
                      value={newOptionValues[group]}
                      onChange={(e) =>
                        setNewOptionValues((prev) => ({ ...prev, [group]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="flex-1 bg-pearl border border-gray-300 rounded-sm px-3 py-2 text-sm text-dark focus:outline-none focus:border-gold-dark"
                    />
                    <button
                      type="submit"
                      disabled={savingGroup === group || !newOptionValues[group].trim()}
                      className="bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <Plus size={14} aria-hidden="true" />
                      Adicionar
                    </button>
                  </form>

                  {items.length === 0 ? (
                    <p className="text-xs text-gray-600 italic">
                      Execute o SQL <code>supabase/admin-security.sql</code> para inicializar as opções no banco.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-2 bg-pearl border border-gray-200 text-navy text-xs font-semibold px-3 py-1.5 rounded-sm"
                        >
                          {item.label}
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(item.id, item.label)}
                            aria-label={`Remover ${item.label}`}
                            className="text-gray-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: SEGURANÇA (2FA) */}
      {activeTab === 'seguranca' && (
        <section aria-label="Configuração de autenticação em duas etapas" className="max-w-2xl">
          <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-navy text-gold flex items-center justify-center flex-shrink-0">
                <QrCode size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-navy">Autenticação em 2 Etapas (2FA)</h2>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  Proteja o painel usando um aplicativo autenticador (<strong>Google Authenticator</strong>,{' '}
                  <strong>Microsoft Authenticator</strong> ou <strong>Authy</strong>). Mesmo que alguém descubra
                  sua senha, não conseguirá acessar sem o código de 6 dígitos do seu celular.
                </p>
              </div>
            </div>

            {mfaMessage && (
              <p role="status" className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-sm">
                {mfaMessage}
              </p>
            )}
            {mfaError && (
              <p role="alert" className="text-xs font-semibold text-red-800 bg-red-50 border border-red-200 p-3 rounded-sm">
                {mfaError}
              </p>
            )}

            {/* Fatores já ativos */}
            {mfaFactors.filter((f) => f.status === 'verified').length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  Dispositivos Conectados
                </h3>
                {mfaFactors
                  .filter((f) => f.status === 'verified')
                  .map((factor) => (
                    <div
                      key={factor.id}
                      className="flex items-center justify-between gap-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-sm"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-emerald-700" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-bold text-navy">
                            {factor.friendly_name || 'Aplicativo Autenticador (TOTP)'}
                          </p>
                          <p className="text-xs text-emerald-800">Ativo e exigido no login</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDisableMfa(factor.id)}
                        disabled={mfaBusy}
                        className="text-xs font-bold text-red-700 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Fluxo de cadastro do QR Code */}
            {!enrollData && mfaFactors.filter((f) => f.status === 'verified').length === 0 && (
              <button
                type="button"
                onClick={handleStartMfaEnroll}
                disabled={mfaBusy}
                className="bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-sm inline-flex items-center gap-2 disabled:opacity-60"
              >
                {mfaBusy ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <ShieldCheck size={16} aria-hidden="true" />
                )}
                Ativar Google Authenticator (2FA)
              </button>
            )}

            {enrollData && (
              <div className="p-6 bg-pearl rounded-sm border border-gray-200 space-y-5">
                <ol className="list-decimal pl-5 text-sm text-gray-800 space-y-1.5">
                  <li>Abra o <strong>Google Authenticator</strong> ou <strong>Authy</strong> no celular.</li>
                  <li>Escaneie o QR Code abaixo (ou cole a chave secreta manualmente).</li>
                  <li>Digite o código de 6 dígitos gerado pelo app para confirmar.</li>
                </ol>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white p-3 rounded-sm border border-gray-200 shadow-sm">
                    <img
                      src={enrollData.qrCode}
                      alt="QR Code para cadastrar no aplicativo autenticador"
                      width={180}
                      height={180}
                      className="w-44 h-44"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                      Chave Secreta Manual
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="bg-white border border-gray-300 px-3 py-2 rounded-sm text-xs font-mono break-all flex-1 text-navy">
                        {enrollData.secret}
                      </code>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(enrollData.secret);
                          setCopiedSecret(true);
                          setTimeout(() => setCopiedSecret(false), 2500);
                        }}
                        className="p-2 bg-white border border-gray-300 rounded-sm hover:border-gold-dark text-navy"
                        aria-label="Copiar chave secreta"
                      >
                        {copiedSecret ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleConfirmMfaEnroll} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <label htmlFor="mfa-enroll-code" className="sr-only">
                    Código de 6 dígitos
                  </label>
                  <input
                    id="mfa-enroll-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={totpVerifyCode}
                    onChange={(e) => setTotpVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Código de 6 dígitos"
                    className="bg-white border border-gray-300 rounded-sm px-4 py-2.5 text-center font-bold tracking-[0.3em] text-navy focus:outline-none focus:border-gold-dark"
                  />
                  <button
                    type="submit"
                    disabled={mfaBusy || totpVerifyCode.length !== 6}
                    className="bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-sm disabled:opacity-50"
                  >
                    Confirmar e Ativar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnrollData(null);
                      setTotpVerifyCode('');
                    }}
                    className="text-xs text-gray-600 hover:text-navy px-3 py-2"
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
