import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Edit3,
  Eye,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Palette,
  PauseCircle,
  Phone,
  PlayCircle,
  Plus,
  RotateCcw,
  Search,
  Table2,
  Users,
  XCircle,
} from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { Agency, AgencyStatus, LocalizedField } from '../../types/ibonda';
import { addDaysToIso, formatCurrency, getLocalized } from '../../utils/formatters';
import { REFERENCE_TODAY } from '../../data/seedData';
import { Modal } from '../ui/Modal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { ContactActionMenu } from '../ui/ContactActionMenu';
import { agencyStatusTone, paymentStatusTone, StatusLabel } from '../ui/StatusLabel';
import { PageHeader } from '../ui/PageHeader';
import { TablePagination } from '../ui/TablePagination';
import { AgencyBrandingPanel } from './AgencyBrandingPanel';

interface AgenciesViewProps {
  openAddOnMount?: boolean;
  onConsumeOpenAdd?: () => void;
}

const LOGO_COLORS = ['#053332', '#DF4416', '#15803D', '#0A4E4C', '#D97706', '#111827'];
const PAGE_SIZE = 6;

const PACK_ACCENTS: Record<
  string,
  {
    cardSurface: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    dot: string;
    priceText: string;
  }
> = {
  plan_starter: {
    cardSurface: 'from-[#86EFAC] via-[#4ADE80] to-[#22C55E] border-2 border-[#15803D]',
    badgeBg: 'bg-[#DCFCE7]',
    badgeText: 'text-[#0F5132]',
    badgeBorder: 'border-[#15803D]',
    dot: 'bg-[#0F5132]',
    priceText: 'text-[#000000]',
  },
  plan_pro: {
    cardSurface: 'from-[#FDBA74] via-[#FB923C] to-[#F97316] border-2 border-[#B8320D]',
    badgeBg: 'bg-[#FFEDD5]',
    badgeText: 'text-[#9A2D0C]',
    badgeBorder: 'border-[#B8320D]',
    dot: 'bg-[#9A2D0C]',
    priceText: 'text-[#000000]',
  },
  plan_enterprise: {
    cardSurface: 'from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C] border-2 border-[#053332]',
    badgeBg: 'bg-[#E6F2EC]',
    badgeText: 'text-[#053332]',
    badgeBorder: 'border-[#053332]',
    dot: 'bg-[#053332]',
    priceText: 'text-[#000000]',
  },
};

function getPackAccent(planId: string) {
  return (
    PACK_ACCENTS[planId] || {
      cardSurface: 'from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C] border-2 border-[#053332]',
      badgeBg: 'bg-[#E6F2EC]',
      badgeText: 'text-[#053332]',
      badgeBorder: 'border-[#053332]',
      dot: 'bg-[#053332]',
      priceText: 'text-[#000000]',
    }
  );
}

function agencyStatusSelectClass(status: AgencyStatus): string {
  switch (status) {
    case 'active':
      return 'border-emerald-400 bg-[#DCFCE7] text-[#14532D]';
    case 'free_trial':
      return 'border-[#C6D1CF] bg-[#EFF3F2] text-[#053332]';
    case 'pending_payment':
      return 'border-amber-400 bg-[#FEF2D6] text-[#92400E]';
    case 'expired':
    case 'cancelled':
      return 'border-red-400 bg-[#FECACA] text-[#991B1B]';
    case 'trial_rejected':
      return 'border-amber-400 bg-amber-50 text-amber-900';
    case 'suspended':
      return 'border-[#C2D0CF] bg-[#EEF2F2] text-[#1F2937]';
  }
}

export function AgenciesView({ openAddOnMount, onConsumeOpenAdd }: AgenciesViewProps) {
  const {
    agencies,
    plans,
    features,
    users,
    payments,
    activities,
    subscriptions,
    settings,
    lang,
    t,
    selectedAgencyId,
    setSelectedAgencyId,
    setActiveNav,
    addAgency,
    updateAgency,
    updateAgencyStatus,
    suspendAgency,
    activateAgency,
    cancelAgencySubscription,
    changeSubscriptionPlan,
    extendSubscription,
  } = useIbonda();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'pack_grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);

  const [detailTab, setDetailTab] = useState<'overview' | 'branding'>('overview');

  const [showFormModal, setShowFormModal] = useState(Boolean(openAddOnMount));
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [previewAgency, setPreviewAgency] = useState<Agency | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    type: 'suspend' | 'cancel';
    agency: Agency;
  } | null>(null);

  const [changePlanAgency, setChangePlanAgency] = useState<Agency | null>(null);
  const [nextPlanId, setNextPlanId] = useState<string>(plans[0]?.id || '');

  const [extendAgency, setExtendAgency] = useState<Agency | null>(null);
  const [extendDays, setExtendDays] = useState<number>(30);

  const [notesDraft, setNotesDraft] = useState<string>('');
  const [notesAgencyId, setNotesAgencyId] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    nameAr: '',
    nameFr: '',
    nameEn: '',
    logoColor: LOGO_COLORS[0],
    cityAr: '',
    cityFr: '',
    cityEn: '',
    addressAr: '',
    addressFr: '',
    addressEn: '',
    phone: '',
    email: '',
    managerNameAr: '',
    managerNameFr: '',
    managerNameEn: '',
    managerEmail: '',
    managerPhone: '',
    planId: plans[0]?.id || '',
    startDate: REFERENCE_TODAY,
    durationDays: 7,
    initialStatus: 'free_trial' as AgencyStatus,
    adminNotes: '',
  });
  const [formError, setFormError] = useState<string>('');

  React.useEffect(() => {
    if (openAddOnMount) {
      openCreateModal();
      onConsumeOpenAdd?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAddOnMount]);

  const cities = useMemo(
    () => Array.from(new Set(agencies.map((a) => getLocalized(a.city, lang)).filter(Boolean))).sort(),
    [agencies, lang]
  );

  const filteredAgencies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agencies.filter((a) => {
      const aName = getLocalized(a.name, lang);
      const aManager = getLocalized(a.managerName, lang);
      const aCity = getLocalized(a.city, lang);
      const matchesQ =
        !q ||
        aName.toLowerCase().includes(q) ||
        aManager.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        aCity.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesPlan = planFilter === 'all' || a.currentPlanId === planFilter;
      const matchesCity = cityFilter === 'all' || aCity === cityFilter;
      return matchesQ && matchesStatus && matchesPlan && matchesCity;
    });
  }, [agencies, search, statusFilter, planFilter, cityFilter, lang]);

  const packCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of plans) map[p.id] = 0;
    for (const a of agencies) {
      map[a.currentPlanId] = (map[a.currentPlanId] || 0) + 1;
    }
    return map;
  }, [agencies, plans]);

  const paginatedAgencies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAgencies.slice(start, start + PAGE_SIZE);
  }, [filteredAgencies, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, planFilter, cityFilter]);

  const selectedAgency = useMemo(
    () => agencies.find((a) => a.id === selectedAgencyId) || null,
    [agencies, selectedAgencyId]
  );

  React.useEffect(() => {
    if (selectedAgency && notesAgencyId !== selectedAgency.id) {
      setNotesDraft(getLocalized(selectedAgency.adminNotes, lang));
      setNotesAgencyId(selectedAgency.id);
    } else if (selectedAgency) {
      setNotesDraft(getLocalized(selectedAgency.adminNotes, lang));
    }
  }, [selectedAgency, notesAgencyId, lang]);

  const mergeLocalized = (existing: LocalizedField | undefined, next: string): LocalizedField => {
    if (existing && typeof existing === 'object') {
      return { ...existing, [lang]: next };
    }
    const base = typeof existing === 'string' ? existing : next;
    return {
      ar: lang === 'ar' ? next : base || next,
      fr: lang === 'fr' ? next : base || next,
      en: lang === 'en' ? next : base || next,
    };
  };

  const buildLocalizedTriple = (
    arVal: string,
    frVal: string,
    enVal: string
  ): LocalizedField => {
    const fallback =
      (lang === 'ar' ? arVal.trim() : lang === 'fr' ? frVal.trim() : enVal.trim()) ||
      arVal.trim() ||
      frVal.trim() ||
      enVal.trim();
    return {
      ar: arVal.trim() || fallback,
      fr: frVal.trim() || fallback,
      en: enVal.trim() || fallback,
    };
  };

  const readFieldLang = (field: LocalizedField | undefined, l: 'ar' | 'fr' | 'en'): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[l] || '';
  };

  const openCreateModal = () => {
    setEditingAgency(null);
    setFormError('');
    setFormState({
      nameAr: '',
      nameFr: '',
      nameEn: '',
      logoColor: LOGO_COLORS[0],
      cityAr: '',
      cityFr: '',
      cityEn: '',
      addressAr: '',
      addressFr: '',
      addressEn: '',
      phone: '',
      email: '',
      managerNameAr: '',
      managerNameFr: '',
      managerNameEn: '',
      managerEmail: '',
      managerPhone: '',
      planId: plans.find((p) => p.active)?.id || plans[0]?.id || '',
      startDate: REFERENCE_TODAY,
      durationDays: settings.trialDurationDays,
      initialStatus: 'free_trial',
      adminNotes: '',
    });
    setShowFormModal(true);
  };

  const openEditModal = (agency: Agency) => {
    setEditingAgency(agency);
    setFormError('');
    setFormState({
      nameAr: readFieldLang(agency.name, 'ar'),
      nameFr: readFieldLang(agency.name, 'fr'),
      nameEn: readFieldLang(agency.name, 'en'),
      logoColor: agency.logoColor,
      cityAr: readFieldLang(agency.city, 'ar'),
      cityFr: readFieldLang(agency.city, 'fr'),
      cityEn: readFieldLang(agency.city, 'en'),
      addressAr: readFieldLang(agency.address, 'ar'),
      addressFr: readFieldLang(agency.address, 'fr'),
      addressEn: readFieldLang(agency.address, 'en'),
      phone: agency.phone,
      email: agency.email,
      managerNameAr: readFieldLang(agency.managerName, 'ar'),
      managerNameFr: readFieldLang(agency.managerName, 'fr'),
      managerNameEn: readFieldLang(agency.managerName, 'en'),
      managerEmail: agency.managerEmail,
      managerPhone: agency.managerPhone,
      planId: agency.currentPlanId,
      startDate: agency.subscriptionStart,
      durationDays: 30,
      initialStatus: agency.status,
      adminNotes: getLocalized(agency.adminNotes, lang),
    });
    setShowFormModal(true);
  };

  const computedEndDate = addDaysToIso(
    formState.startDate,
    formState.initialStatus === 'free_trial' ? settings.trialDurationDays : formState.durationDays
  );

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const anyName = formState.nameAr.trim() || formState.nameFr.trim() || formState.nameEn.trim();
    const anyCity = formState.cityAr.trim() || formState.cityFr.trim() || formState.cityEn.trim();
    const anyManager =
      formState.managerNameAr.trim() ||
      formState.managerNameFr.trim() ||
      formState.managerNameEn.trim();

    if (!anyName || !anyCity || !formState.phone.trim()) {
      setFormError(t.common.requiredField);
      return;
    }
    if (!emailRegex.test(formState.email.trim()) || !emailRegex.test(formState.managerEmail.trim())) {
      setFormError(t.common.invalidEmail);
      return;
    }
    if (!anyManager || !formState.managerPhone.trim()) {
      setFormError(t.common.requiredField);
      return;
    }

    if (editingAgency) {
      updateAgency(editingAgency.id, {
        name: buildLocalizedTriple(formState.nameAr, formState.nameFr, formState.nameEn),
        logoColor: formState.logoColor,
        city: buildLocalizedTriple(formState.cityAr, formState.cityFr, formState.cityEn),
        address: buildLocalizedTriple(formState.addressAr, formState.addressFr, formState.addressEn),
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        managerName: buildLocalizedTriple(
          formState.managerNameAr,
          formState.managerNameFr,
          formState.managerNameEn
        ),
        managerEmail: formState.managerEmail.trim(),
        managerPhone: formState.managerPhone.trim(),
        adminNotes: mergeLocalized(editingAgency.adminNotes, formState.adminNotes.trim()),
      });
      setShowFormModal(false);
    } else {
      const res = addAgency({
        name: anyName,
        nameAr: formState.nameAr.trim(),
        nameFr: formState.nameFr.trim(),
        nameEn: formState.nameEn.trim(),
        logoColor: formState.logoColor,
        city: anyCity,
        cityAr: formState.cityAr.trim(),
        cityFr: formState.cityFr.trim(),
        cityEn: formState.cityEn.trim(),
        address:
          formState.addressAr.trim() || formState.addressFr.trim() || formState.addressEn.trim(),
        addressAr: formState.addressAr.trim(),
        addressFr: formState.addressFr.trim(),
        addressEn: formState.addressEn.trim(),
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        managerName: anyManager,
        managerNameAr: formState.managerNameAr.trim(),
        managerNameFr: formState.managerNameFr.trim(),
        managerNameEn: formState.managerNameEn.trim(),
        managerEmail: formState.managerEmail.trim(),
        managerPhone: formState.managerPhone.trim(),
        planId: formState.planId,
        startDate: formState.startDate,
        durationDays: formState.durationDays,
        initialStatus: formState.initialStatus,
        adminNotes: formState.adminNotes.trim(),
      });
      if (!res.ok) {
        setFormError(res.error || t.common.requiredField);
        return;
      }
      setShowFormModal(false);
    }
  };

  const renderAgencyAvatar = (agency: Agency, sizeClass = 'h-9 w-9 text-xs') => {
    const customLogo = agency.branding?.logoUrl;
    const bg = agency.branding?.primaryColor || agency.logoColor || '#053332';
    const agencyName = getLocalized(agency.name, lang);
    const initials = getLocalized(agency.logoInitials, lang);
    if (customLogo) {
      return (
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#C6D9D7] bg-white ${sizeClass}`}
        >
          <img src={customLogo} alt={agencyName} className="h-full w-full object-contain p-0.5" />
        </div>
      );
    }
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg font-bold text-white ${sizeClass}`}
        style={{ backgroundColor: bg }}
      >
        {initials}
      </div>
    );
  };

  if (selectedAgency) {
    const plan = plans.find((p) => p.id === selectedAgency.currentPlanId);
    const agencyUsers = users.filter((u) => u.agencyId === selectedAgency.id);
    const agencyPayments = payments.filter((p) => p.agencyId === selectedAgency.id);
    const agencyActs = activities.filter((a) => a.agencyId === selectedAgency.id);
    const statusStyle = agencyStatusTone(selectedAgency.status);
    const selectedName = getLocalized(selectedAgency.name, lang);
    const selectedCity = getLocalized(selectedAgency.city, lang);

    return (
      <div className="space-y-6">
        {/* Top Back & Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDetailTab('overview');
                setSelectedAgencyId(null);
              }}
              className="ibonda-btn-secondary"
            >
              {lang === 'ar' ? (
                <ArrowRight className="h-3.5 w-3.5 text-[#DF4416]" />
              ) : (
                <ArrowLeft className="h-3.5 w-3.5 text-[#DF4416]" />
              )}
              {t.common.backToList}
            </button>
            <div className="flex items-center gap-3">
              {renderAgencyAvatar(selectedAgency, 'h-11 w-11 text-sm')}
              <div>
                <h1 className="text-lg font-extrabold text-[#000000]">{selectedName}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#374151]">
                  <span className="font-semibold text-[#053332]">{selectedCity}</span>
                  <span aria-hidden="true">·</span>
                  <StatusLabel
                    tone={statusStyle.tone}
                    icon={statusStyle.icon}
                    label={t.agencyStatus[selectedAgency.status]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ContactActionMenu
              phone={selectedAgency.phone}
              secondaryPhone={selectedAgency.managerPhone}
              contactName={getLocalized(selectedAgency.managerName, lang)}
            />
            <button
              type="button"
              onClick={() => setPreviewAgency(selectedAgency)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C6D1CF] bg-[#EFF3F2] px-3 py-2 text-xs font-bold text-[#053332] hover:bg-[#E1E9E7] whitespace-nowrap"
            >
              <Eye className="h-3.5 w-3.5 text-[#053332]" />
              {t.agencies.previewPortal}
            </button>
            <button
              type="button"
              onClick={() => openEditModal(selectedAgency)}
              className="ibonda-btn-secondary"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#DF4416]" />
              {t.common.edit}
            </button>
            <button
              type="button"
              onClick={() => {
                setNextPlanId(selectedAgency.currentPlanId);
                setChangePlanAgency(selectedAgency);
              }}
              className="ibonda-btn-secondary"
            >
              {t.agencies.changePlan}
            </button>
            <button
              type="button"
              onClick={() => {
                setExtendDays(30);
                setExtendAgency(selectedAgency);
              }}
              className="ibonda-btn-secondary"
            >
              {t.agencies.extendSub}
            </button>
            {selectedAgency.status === 'suspended' ? (
              <button
                type="button"
                onClick={() => activateAgency(selectedAgency.id)}
                className="ibonda-btn-primary"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                {t.agencies.activateAgency}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmAction({ type: 'suspend', agency: selectedAgency })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-[#FEF2D6] px-3 py-2 text-xs font-bold text-[#92400E] hover:bg-amber-200 whitespace-nowrap"
              >
                <PauseCircle className="h-3.5 w-3.5" />
                {t.agencies.suspendAgency}
              </button>
            )}
            {selectedAgency.status !== 'cancelled' && (
              <button
                type="button"
                onClick={() => setConfirmAction({ type: 'cancel', agency: selectedAgency })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-[#FDE4E4] px-3 py-2 text-xs font-bold text-[#991B1B] hover:bg-red-200 whitespace-nowrap"
              >
                <XCircle className="h-3.5 w-3.5" />
                {t.agencies.cancelSub}
              </button>
            )}
          </div>
        </div>

        {/* Agency Details Segmented Tabs: Overview vs Agency Branding */}
        <div className="ibonda-tabs-bar inline-flex">
          <button
            type="button"
            onClick={() => setDetailTab('overview')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
              detailTab === 'overview'
                ? 'bg-[#053332] text-white shadow-xs'
                : 'text-[#000000] hover:bg-white/80 hover:text-[#DF4416]'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            {t.agencies.overviewTab}
          </button>
          <button
            type="button"
            onClick={() => setDetailTab('branding')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
              detailTab === 'branding'
                ? 'bg-[#DF4416] text-white shadow-xs'
                : 'text-[#000000] hover:bg-white/80 hover:text-[#053332]'
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            {t.agencies.brandingTab}
          </button>
        </div>

        {detailTab === 'branding' ? (
          <AgencyBrandingPanel agency={selectedAgency} />
        ) : (
          <>
            {/* Full-Color Info Cards */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="rounded-xl border-2 border-[#053332] bg-gradient-to-br from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
                <div className="border-b border-[#053332]/30 bg-[#053332] px-5 py-3">
                  <h2 className="text-sm font-extrabold text-white">{t.agencies.agencyInfoSection}</h2>
                </div>
                <div className="p-5 space-y-4">
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.city}</dt>
                      <dd className="font-extrabold text-[#000000]">{selectedCity}</dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.address}</dt>
                      <dd className="font-extrabold text-[#000000] text-end">
                        {getLocalized(selectedAgency.address, lang) || '—'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.phone}</dt>
                      <dd className="font-mono font-bold text-[#000000] tabular-nums" dir="ltr">{selectedAgency.phone}</dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.email}</dt>
                      <dd className="font-mono font-bold text-[#053332] truncate">{selectedAgency.email}</dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.common.propertiesCount}</dt>
                      <dd className="font-black text-[#DF4416] tabular-nums">{selectedAgency.propertiesCount}</dd>
                    </div>
                  </dl>

                  <div className="border-t border-[#053332]/25 pt-4">
                    <h3 className="text-xs font-black text-[#000000] mb-2.5">{t.agencies.managerInfoSection}</h3>
                    <dl className="space-y-2 text-xs">
                      <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                        <dt className="font-bold text-[#111827]">{t.agencies.colManager}</dt>
                        <dd className="font-extrabold text-[#000000]">{getLocalized(selectedAgency.managerName, lang)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                        <dt className="font-bold text-[#111827]">{t.agencies.managerEmail}</dt>
                        <dd className="font-mono font-bold text-[#053332] truncate">{selectedAgency.managerEmail}</dd>
                      </div>
                      <div className="flex justify-between gap-2 rounded-lg border border-[#053332]/20 bg-white/90 px-3 py-2">
                        <dt className="font-bold text-[#111827]">{t.agencies.managerPhone}</dt>
                        <dd className="font-mono font-bold text-[#000000] tabular-nums" dir="ltr">{selectedAgency.managerPhone}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-[#B8320D] bg-gradient-to-br from-[#FDBA74] via-[#FB923C] to-[#F97316] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
                <div className="border-b border-[#B8320D]/30 bg-[#DF4416] px-5 py-3">
                  <h2 className="text-sm font-extrabold text-white">{t.agencies.subscriptionInfoSection}</h2>
                </div>
                <div className="p-5 space-y-4">
                  <dl className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-[#B8320D]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.colPlan}</dt>
                      <dd
                        className={`rounded-md border px-2 py-0.5 font-bold ${getPackAccent(selectedAgency.currentPlanId).badgeBorder} ${getPackAccent(selectedAgency.currentPlanId).badgeBg} ${getPackAccent(selectedAgency.currentPlanId).badgeText}`}
                      >
                        {plan ? getLocalized(plan.name, lang) : '—'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-[#B8320D]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.colStatus}</dt>
                      <dd>
                        <select
                          value={selectedAgency.status}
                          onChange={(e) => updateAgencyStatus(selectedAgency.id, e.target.value as AgencyStatus)}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none cursor-pointer ${agencyStatusSelectClass(
                            selectedAgency.status
                          )}`}
                        >
                          {(['free_trial', 'active', 'pending_payment', 'expired', 'suspended', 'cancelled', 'trial_rejected'] as AgencyStatus[]).map(
                            (st) => (
                              <option key={st} value={st} className="bg-white text-[#000000]">
                                {t.agencyStatus[st]}
                              </option>
                            )
                          )}
                        </select>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#B8320D]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.startDate}</dt>
                      <dd className="font-mono font-bold text-[#000000] tabular-nums">{selectedAgency.subscriptionStart}</dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#B8320D]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.agencies.endDate}</dt>
                      <dd className="font-mono font-bold text-[#000000] tabular-nums">{selectedAgency.subscriptionEnd}</dd>
                    </div>
                    <div className="flex justify-between gap-2 rounded-lg border border-[#B8320D]/20 bg-white/90 px-3 py-2">
                      <dt className="font-bold text-[#111827]">{t.plans.price}</dt>
                      <dd className="font-black text-[#000000] tabular-nums">
                        {plan ? formatCurrency(plan.price, settings.currency, lang) : '—'}
                      </dd>
                    </div>
                  </dl>

                  <div className="border-t border-[#9A2D0C]/25 pt-4">
                    <h3 className="text-xs font-black text-[#000000] mb-2">{t.agencies.adminNotes}</h3>
                    <textarea
                      rows={3}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      className="ibonda-input bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateAgency(selectedAgency.id, {
                          adminNotes: mergeLocalized(selectedAgency.adminNotes, notesDraft),
                        })
                      }
                      className="ibonda-btn-primary mt-2"
                    >
                      {t.agencies.saveNotes}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-[#15803D] bg-gradient-to-br from-[#86EFAC] via-[#4ADE80] to-[#22C55E] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
                <div className="border-b border-[#15803D]/30 bg-[#0F5132] px-5 py-3">
                  <h2 className="text-sm font-extrabold text-white">{t.agencies.integrationsTitle}</h2>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-bold leading-relaxed text-[#000000]">{t.agencies.integrationsNote}</p>
                  <div className="divide-y divide-[#D6E4E3] rounded-lg border border-[#C6D9D7] bg-white overflow-hidden">
                    {selectedAgency.integrations.map((item) => {
                      const tone =
                        item.status === 'connected'
                          ? 'teal'
                          : item.status === 'connection_error'
                          ? 'red'
                          : item.status === 'connection_required'
                          ? 'amber'
                          : 'slate';
                      const icon =
                        item.status === 'connected'
                          ? 'check'
                          : item.status === 'connection_error'
                          ? 'alert'
                          : 'clock';
                      return (
                        <div key={item.provider} className="ibonda-table-row flex items-center justify-between px-3.5 py-2.5 text-xs">
                          <div>
                            <p className="font-bold text-[#000000]">{t.integrationProvider[item.provider]}</p>
                            {item.accountLabel && (
                              <p className="text-[11px] font-semibold text-[#053332]">
                                {getLocalized(item.accountLabel, lang)}
                              </p>
                            )}
                          </div>
                          <StatusLabel tone={tone} icon={icon} label={t.integrationStatus[item.status]} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Employees & Payments */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="ibonda-table-wrap">
                <div className="ibonda-card-header flex items-center justify-between px-5 py-3.5">
                  <h2 className="text-sm font-extrabold text-[#000000]">
                    {t.agencies.employeesTitle} ({agencyUsers.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveNav('users')}
                    className="ibonda-btn-secondary py-1 px-2.5"
                  >
                    <Users className="h-3.5 w-3.5 text-[#DF4416]" />
                    {t.agencies.viewUsers}
                  </button>
                </div>
                <div className="divide-y divide-[#DDE8E7]">
                  {agencyUsers.length === 0 ? (
                    <p className="p-5 text-xs text-[#374151]">{t.common.noResults}</p>
                  ) : (
                    agencyUsers.map((usr) => (
                      <div key={usr.id} className="ibonda-table-row flex items-center justify-between px-5 py-3 text-xs">
                        <div>
                          <p className="font-bold text-[#000000]">{getLocalized(usr.fullName, lang)}</p>
                          <p className="font-mono text-[11px] text-[#374151]">{usr.email}</p>
                        </div>
                        <div className="text-end">
                          <span className="inline-block rounded-md border border-[#C6D1CF] bg-[#EFF3F2] px-2 py-0.5 text-[11px] font-bold text-[#053332]">
                            {t.userRole[usr.role]}
                          </span>
                          <p className="mt-1 text-[11px] font-medium text-[#374151]">{t.userStatus[usr.status]}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="ibonda-table-wrap">
                <div className="ibonda-card-header flex items-center justify-between px-5 py-3.5">
                  <h2 className="text-sm font-extrabold text-[#000000]">
                    {t.agencies.paymentsTitle} ({agencyPayments.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveNav('payments')}
                    className="ibonda-btn-secondary py-1 px-2.5"
                  >
                    {t.nav.payments}
                  </button>
                </div>
                <div className="divide-y divide-[#DDE8E7]">
                  {agencyPayments.length === 0 ? (
                    <p className="p-5 text-xs text-[#374151]">{t.common.noResults}</p>
                  ) : (
                    agencyPayments.map((pay) => {
                      const ps = paymentStatusTone(pay.status);
                      return (
                        <div key={pay.id} className="ibonda-table-row flex items-center justify-between px-5 py-3 text-xs">
                          <div>
                            <p className="font-mono font-bold text-[#000000]">{pay.transactionRef}</p>
                            <p className="text-[11px] font-medium text-[#374151]">
                              {t.paymentMethod[pay.method]} · {pay.paymentDate || pay.dueDate}
                            </p>
                          </div>
                          <div className="text-end">
                            <p className="font-extrabold text-[#000000] tabular-nums mb-1">
                              {formatCurrency(pay.amount, settings.currency, lang)}
                            </p>
                            <StatusLabel tone={ps.tone} icon={ps.icon} label={t.paymentStatus[pay.status]} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Agency Activity Log */}
            <div className="ibonda-table-wrap">
              <div className="ibonda-card-header px-5 py-3.5">
                <h2 className="text-sm font-extrabold text-[#000000]">{t.agencies.activityTitle}</h2>
              </div>
              <div className="divide-y divide-[#DDE8E7]">
                {agencyActs.length === 0 ? (
                  <p className="p-5 text-xs text-[#374151]">{t.common.noResults}</p>
                ) : (
                  agencyActs.map((act) => (
                    <div key={act.id} className="ibonda-table-row flex items-center justify-between px-5 py-3 text-xs">
                      <span className="font-semibold text-[#000000]">{getLocalized(act.message, lang)}</span>
                      <span className="rounded-md border border-[#C6D9D7] bg-[#F2F7F7] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums">
                        {act.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {renderSharedModals()}
      </div>
    );
  }

  function renderSharedModals() {
    const previewPlan = previewAgency ? plans.find((p) => p.id === previewAgency.currentPlanId) : null;
    const previewUsersCount = previewAgency
      ? users.filter((u) => u.agencyId === previewAgency.id).length
      : 0;
    const previewBrandPrimary = previewAgency?.branding?.primaryColor || previewAgency?.logoColor || '#053332';
    const previewBrandSecondary = previewAgency?.branding?.secondaryColor || '#DF4416';
    const previewDisplayName = previewAgency
      ? getLocalized(previewAgency.branding?.displayName || previewAgency.name, lang)
      : '';

    return (
      <>
        {/* Add / Edit Agency Modal with Full Trilingual Support */}
        <Modal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          title={editingAgency ? t.agencies.editAgency : t.agencies.addAgency}
          maxWidthClass="max-w-3xl"
        >
          <form onSubmit={handleSaveForm} className="space-y-5">
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC4545]">
                {formError}
              </div>
            )}

            <div className="rounded-lg border border-[#C6D1CF] bg-[#EFF3F2] px-3.5 py-2.5 text-[11px] font-semibold text-[#053332]">
              {t.agencies.multilingualHint}
            </div>

            <div>
              <h4 className="mb-3 text-xs font-extrabold text-[#000000]">{t.agencies.agencyInfoSection}</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.nameAr} *</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formState.nameAr}
                      onChange={(e) => setFormState({ ...formState, nameAr: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.nameFr}</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formState.nameFr}
                      onChange={(e) => setFormState({ ...formState, nameFr: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.nameEn}</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formState.nameEn}
                      onChange={(e) => setFormState({ ...formState, nameEn: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.cityAr} *</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formState.cityAr}
                      onChange={(e) => setFormState({ ...formState, cityAr: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.cityFr}</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formState.cityFr}
                      onChange={(e) => setFormState({ ...formState, cityFr: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.cityEn}</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formState.cityEn}
                      onChange={(e) => setFormState({ ...formState, cityEn: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.email} *</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="ibonda-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.phone} *</label>
                    <input
                      type="text"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="ibonda-input font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.addressAr}</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formState.addressAr}
                      onChange={(e) => setFormState({ ...formState, addressAr: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.addressFr}</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formState.addressFr}
                      onChange={(e) => setFormState({ ...formState, addressFr: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.addressEn}</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formState.addressEn}
                      onChange={(e) => setFormState({ ...formState, addressEn: e.target.value })}
                      className="ibonda-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#000000]">{t.agencies.logoColor}</label>
                  <div className="flex items-center gap-2 rounded-lg border border-[#C6D9D7] bg-[#F2F7F7] p-2 w-fit">
                    {LOGO_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormState({ ...formState, logoColor: color })}
                        className={`h-7 w-7 rounded-lg border-2 transition-transform ${
                          formState.logoColor === color ? 'border-[#DF4416] scale-110 ring-2 ring-[#DF4416]/30' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#D6E4E3] pt-4 space-y-3">
              <h4 className="text-xs font-extrabold text-[#000000]">{t.agencies.managerInfoSection}</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.managerNameAr} *</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formState.managerNameAr}
                    onChange={(e) => setFormState({ ...formState, managerNameAr: e.target.value })}
                    className="ibonda-input"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.managerNameFr}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formState.managerNameFr}
                    onChange={(e) => setFormState({ ...formState, managerNameFr: e.target.value })}
                    className="ibonda-input"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.managerNameEn}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formState.managerNameEn}
                    onChange={(e) => setFormState({ ...formState, managerNameEn: e.target.value })}
                    className="ibonda-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.managerEmail} *</label>
                  <input
                    type="email"
                    required
                    value={formState.managerEmail}
                    onChange={(e) => setFormState({ ...formState, managerEmail: e.target.value })}
                    className="ibonda-input font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.managerPhone} *</label>
                  <input
                    type="text"
                    required
                    value={formState.managerPhone}
                    onChange={(e) => setFormState({ ...formState, managerPhone: e.target.value })}
                    className="ibonda-input font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {!editingAgency && (
              <div className="border-t border-[#D6E4E3] pt-4">
                <h4 className="mb-3 text-xs font-extrabold text-[#000000]">{t.agencies.subscriptionInfoSection}</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.selectPlan}</label>
                    <select
                      value={formState.planId}
                      onChange={(e) => {
                        const chosen = plans.find((p) => p.id === e.target.value);
                        setFormState({
                          ...formState,
                          planId: e.target.value,
                          durationDays:
                            formState.initialStatus === 'free_trial'
                              ? settings.trialDurationDays
                              : chosen?.durationDays || 30,
                        });
                      }}
                      className="ibonda-input"
                    >
                      {plans
                        .filter((p) => p.active)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {getLocalized(p.name, lang)} — {formatCurrency(p.price, settings.currency, lang)}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.initialStatus}</label>
                    <select
                      value={formState.initialStatus}
                      onChange={(e) => {
                        const st = e.target.value as AgencyStatus;
                        const plan = plans.find((p) => p.id === formState.planId);
                        setFormState({
                          ...formState,
                          initialStatus: st,
                          durationDays:
                            st === 'free_trial' ? settings.trialDurationDays : plan?.durationDays || 30,
                        });
                      }}
                      className="ibonda-input"
                    >
                      <option value="free_trial">{t.agencyStatus.free_trial}</option>
                      <option value="pending_payment">{t.agencyStatus.pending_payment}</option>
                      <option value="active">{t.agencyStatus.active}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.startDate}</label>
                    <input
                      type="date"
                      value={formState.startDate}
                      onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                      className="ibonda-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#000000]">
                      {t.agencies.durationDays} ({t.agencies.endDate}: {computedEndDate})
                    </label>
                    <input
                      type="number"
                      min={1}
                      disabled={formState.initialStatus === 'free_trial'}
                      value={
                        formState.initialStatus === 'free_trial'
                          ? settings.trialDurationDays
                          : formState.durationDays
                      }
                      onChange={(e) =>
                        setFormState({ ...formState, durationDays: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="ibonda-input font-mono disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.adminNotes}</label>
              <textarea
                rows={2}
                value={formState.adminNotes}
                onChange={(e) => setFormState({ ...formState, adminNotes: e.target.value })}
                className="ibonda-input"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[#D6E4E3] pt-4">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="ibonda-btn-secondary px-4"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="ibonda-btn-primary px-5"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        </Modal>

        {/* Change Plan Modal */}
        <Modal
          open={Boolean(changePlanAgency)}
          onClose={() => setChangePlanAgency(null)}
          title={t.agencies.changePlan}
          subtitle={changePlanAgency ? getLocalized(changePlanAgency.name, lang) : undefined}
          maxWidthClass="max-w-md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setChangePlanAgency(null)}
                className="ibonda-btn-secondary px-4"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (changePlanAgency) {
                    const sub = subscriptions.find((s) => s.agencyId === changePlanAgency.id);
                    if (sub) changeSubscriptionPlan(sub.id, nextPlanId);
                    else updateAgency(changePlanAgency.id, { currentPlanId: nextPlanId });
                  }
                  setChangePlanAgency(null);
                }}
                className="ibonda-btn-primary px-4"
              >
                {t.common.confirm}
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#000000]">{t.agencies.selectPlan}</label>
            <select
              value={nextPlanId}
              onChange={(e) => setNextPlanId(e.target.value)}
              className="ibonda-input"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {getLocalized(p.name, lang)} — {formatCurrency(p.price, settings.currency, lang)}
                </option>
              ))}
            </select>
          </div>
        </Modal>

        {/* Extend Subscription Modal */}
        <Modal
          open={Boolean(extendAgency)}
          onClose={() => setExtendAgency(null)}
          title={t.agencies.extendSub}
          subtitle={extendAgency ? getLocalized(extendAgency.name, lang) : undefined}
          maxWidthClass="max-w-md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setExtendAgency(null)}
                className="ibonda-btn-secondary px-4"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (extendAgency) {
                    const sub = subscriptions.find((s) => s.agencyId === extendAgency.id);
                    if (sub) extendSubscription(sub.id, extendDays);
                  }
                  setExtendAgency(null);
                }}
                className="ibonda-btn-primary px-4"
              >
                {t.common.confirm}
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#000000]">{t.subscriptions.extendDaysLabel}</label>
            <input
              type="number"
              min={1}
              max={365}
              value={extendDays}
              onChange={(e) => setExtendDays(Math.max(1, Number(e.target.value) || 1))}
              className="ibonda-input font-mono"
            />
          </div>
        </Modal>

        {/* Branded Agency Portal Preview Modal */}
        <Modal
          open={Boolean(previewAgency)}
          onClose={() => setPreviewAgency(null)}
          title={t.agencies.previewTitle}
          subtitle={previewAgency ? `${previewDisplayName} · ${previewPlan ? getLocalized(previewPlan.name, lang) : ''}` : ''}
          maxWidthClass="max-w-2xl"
          footer={
            <button
              type="button"
              onClick={() => setPreviewAgency(null)}
              className="ibonda-btn-primary px-4"
            >
              {t.common.close}
            </button>
          }
        >
          {previewAgency && previewPlan && (
            <div className="space-y-4">
              <div
                className="flex items-center justify-between rounded-xl p-4 text-white"
                style={{ backgroundColor: previewBrandPrimary }}
              >
                <div className="flex items-center gap-3">
                  {renderAgencyAvatar(previewAgency, 'h-10 w-10 text-sm')}
                  <div>
                    <p className="text-sm font-bold">{previewDisplayName}</p>
                    <p className="text-[11px] opacity-80">{getLocalized(previewAgency.city, lang)}</p>
                  </div>
                </div>
                <span
                  className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: previewBrandSecondary }}
                >
                  {getLocalized(previewPlan.name, lang)}
                </span>
              </div>

              <div className="rounded-lg border border-[#C6D9D7] bg-[#F2F7F7] px-3.5 py-2.5 text-xs font-medium text-[#000000]">
                {t.agencies.previewReadOnlyNotice}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] p-3">
                  <p className="text-[11px] font-semibold text-[#374151]">{t.plans.maxUsers}</p>
                  <p className="mt-1 text-base font-extrabold text-[#000000] tabular-nums">
                    {previewUsersCount} / {previewPlan.maxUsers}
                  </p>
                </div>
                <div className="rounded-lg border-2 border-[#B8320D] bg-[#FED7AA] p-3">
                  <p className="text-[11px] font-semibold text-[#374151]">{t.plans.maxProperties}</p>
                  <p className="mt-1 text-base font-extrabold text-[#000000] tabular-nums">
                    {previewAgency.propertiesCount} / {previewPlan.maxProperties}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-extrabold text-[#000000]">{t.agencies.previewEnabledFeatures}</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {features.map((feat) => {
                    const enabled = previewPlan.featureIds.includes(feat.id);
                    return (
                      <div
                        key={feat.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
                          enabled
                            ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#000000]'
                            : 'border-[#D6E4E3] bg-slate-50 text-[#4B5563]'
                        }`}
                      >
                        {enabled ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#14532D]" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-[#4B5563]" />
                        )}
                        <span className="truncate">{getLocalized(feat.name, lang)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmModal
          open={Boolean(confirmAction)}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => {
            if (!confirmAction) return;
            if (confirmAction.type === 'suspend') suspendAgency(confirmAction.agency.id);
            else cancelAgencySubscription(confirmAction.agency.id);
          }}
          title={
            confirmAction?.type === 'suspend'
              ? t.agencies.confirmSuspendTitle
              : t.agencies.confirmCancelTitle
          }
          message={
            confirmAction?.type === 'suspend'
              ? t.agencies.confirmSuspendMsg
              : t.agencies.confirmCancelMsg
          }
          variant="danger"
        />
      </>
    );
  }

  const plansToDisplayInGrid = plans.filter(
    (p) => planFilter === 'all' || p.id === planFilter
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.agencies.title}
        subtitle={t.agencies.subtitle}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="ibonda-btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t.agencies.addAgency}
          </button>
        }
      />

      {/* Interactive Full-Colored Pack Summary Strip — Divide Agencies by Pack */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#053332]" />
            <h2 className="text-xs font-extrabold text-[#000000]">{t.agencies.packDistributionTitle}</h2>
          </div>
          <span className="text-[11px] font-extrabold text-[#000000] tabular-nums">
            {filteredAgencies.length} / {agencies.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* All Packs Full-Color Card */}
          <button
            type="button"
            onClick={() => setPlanFilter('all')}
            className={`rounded-xl border-2 border-[#B45309] bg-gradient-to-br from-[#FDE047] via-[#FBBF24] to-[#F59E0B] p-4 text-start shadow-[0_3px_12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 ${
              planFilter === 'all' ? 'ring-2 ring-[#000000]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#000000] truncate">{t.agencies.allPacks}</span>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#053332]" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between gap-2">
              <span className="text-2xl font-black text-[#000000] tabular-nums">{agencies.length}</span>
              <span className="rounded-md bg-[#78350F] px-2 py-0.5 text-[11px] font-bold text-white">
                {t.agencies.packAgencyCount}
              </span>
            </div>
          </button>

          {plans.map((p) => {
            const accent = getPackAccent(p.id);
            const selected = planFilter === p.id;
            const count = packCounts[p.id] || 0;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanFilter(selected ? 'all' : p.id)}
                className={`rounded-xl bg-gradient-to-br ${accent.cardSurface} p-4 text-start shadow-[0_3px_12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 ${
                  selected ? 'ring-2 ring-[#000000]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-[#000000] truncate">
                    {getLocalized(p.name, lang)}
                  </span>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accent.dot}`} />
                </div>
                <div className="mt-2.5 flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-black text-[#000000] tabular-nums">{count}</span>
                  <span className="rounded-md bg-[#053332] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">
                    {formatCurrency(p.price, settings.currency, lang)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filters & View Mode Switcher Bar */}
      <div className="ibonda-filter-bar">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#053332]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.agencies.searchPlaceholder}
            className="ibonda-input ps-9 pe-3 bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ibonda-select bg-white"
          aria-label={t.agencies.filterStatus}
        >
          <option value="all">{t.agencies.filterStatus}: {t.common.all}</option>
          {(['free_trial', 'active', 'pending_payment', 'expired', 'suspended', 'cancelled', 'trial_rejected'] as AgencyStatus[]).map(
            (st) => (
              <option key={st} value={st}>
                {t.agencyStatus[st]}
              </option>
            )
          )}
        </select>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="ibonda-select bg-white"
          aria-label={t.agencies.filterPlan}
        >
          <option value="all">{t.agencies.filterPlan}: {t.common.all}</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {getLocalized(p.name, lang)}
            </option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="ibonda-select bg-white"
          aria-label={t.agencies.filterCity}
        >
          <option value="all">{t.agencies.filterCity}: {t.common.all}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {(search || statusFilter !== 'all' || planFilter !== 'all' || cityFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setPlanFilter('all');
              setCityFilter('all');
            }}
            className="ibonda-btn-secondary"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#DF4416]" />
            {t.common.resetFilters}
          </button>
        )}

        {/* Table vs Pack-Grouped Grid Switcher */}
        <div className="inline-flex items-center rounded-lg border border-[#B2C9C7] bg-white p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              viewMode === 'table'
                ? 'bg-[#053332] text-white'
                : 'text-[#000000] hover:text-[#DF4416]'
            }`}
          >
            <Table2 className="h-3.5 w-3.5" />
            {t.agencies.viewModeTable}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pack_grid')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              viewMode === 'pack_grid'
                ? 'bg-[#DF4416] text-white'
                : 'text-[#000000] hover:text-[#053332]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            {t.agencies.viewModePackGrid}
          </button>
        </div>
      </div>

      {/* Mode 1: Pack-Grouped Grid View */}
      {viewMode === 'pack_grid' ? (
        <div className="space-y-5">
          {plansToDisplayInGrid.map((plan) => {
            const packAgencies = filteredAgencies.filter((a) => a.currentPlanId === plan.id);
            const accent = getPackAccent(plan.id);
            return (
              <section
                key={plan.id}
                className="ibonda-card overflow-hidden"
              >
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-black/15 bg-gradient-to-r ${accent.cardSurface} border-0 px-5 py-3.5`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accent.dot}`} />
                    <h3 className="text-sm font-black text-[#000000] truncate">
                      {getLocalized(plan.name, lang)}
                    </h3>
                    <span className="text-xs font-bold text-[#000000]/80 hidden sm:inline">
                      · {getLocalized(plan.description, lang)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-md border border-[#BAC7C5] bg-white px-2.5 py-0.5 text-[11px] font-extrabold text-[#000000] tabular-nums">
                      {formatCurrency(plan.price, settings.currency, lang)} / {t.billingCycle[plan.billingCycle]}
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold tabular-nums ${accent.badgeBorder} ${accent.badgeBg} ${accent.badgeText}`}
                    >
                      {packAgencies.length} {t.agencies.packAgencyCount}
                    </span>
                  </div>
                </div>

                {packAgencies.length === 0 ? (
                  <p className="p-6 text-center text-xs text-[#111827]">{t.agencies.emptyPackNote}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    {packAgencies.map((agency) => {
                      return (
                        <div
                          key={agency.id}
                          className={`flex flex-col justify-between rounded-xl bg-gradient-to-br ${accent.cardSurface} p-4 transition-all hover:shadow-lg`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailTab('overview');
                                  setSelectedAgencyId(agency.id);
                                }}
                                className="flex items-center gap-3 text-start min-w-0 group"
                              >
                                {renderAgencyAvatar(agency, 'h-10 w-10 text-xs')}
                                <div className="min-w-0">
                                  <p className="text-sm font-extrabold text-[#000000] truncate group-hover:text-[#DF4416] group-hover:underline">
                                    {getLocalized(agency.name, lang)}
                                  </p>
                                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#053332]">
                                    <MapPin className="h-3 w-3 text-[#DF4416]" />
                                    {getLocalized(agency.city, lang)}
                                  </p>
                                </div>
                              </button>
                              <select
                                value={agency.status}
                                onChange={(e) =>
                                  updateAgencyStatus(agency.id, e.target.value as AgencyStatus)
                                }
                                className={`rounded-lg border px-2 py-1 text-[10px] font-bold outline-none cursor-pointer ${agencyStatusSelectClass(
                                  agency.status
                                )}`}
                              >
                                {(
                                  [
                                    'free_trial',
                                    'active',
                                    'pending_payment',
                                    'expired',
                                    'suspended',
                                    'cancelled',
                                    'trial_rejected',
                                  ] as AgencyStatus[]
                                ).map((st) => (
                                  <option key={st} value={st} className="bg-white text-[#000000]">
                                    {t.agencyStatus[st]}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1.5 rounded-lg border border-white/80 bg-white/90 p-3 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-[#374151]">{t.agencies.colManager}</span>
                                <span className="font-bold text-[#000000] truncate">
                                  {getLocalized(agency.managerName, lang)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1 text-[#374151]">
                                  <Phone className="h-3 w-3 text-[#DF4416]" />
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-[#000000] tabular-nums" dir="ltr">
                                  {agency.phone}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1 text-[#374151]">
                                  <Mail className="h-3 w-3 text-[#053332]" />
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-[#053332] truncate">
                                  {agency.email}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E5EEED]">
                                <span className="text-[11px] font-medium text-[#374151]">{t.agencies.colPeriod}</span>
                                <span className="font-mono text-[11px] font-semibold text-[#000000] tabular-nums">
                                  {agency.subscriptionStart} → {agency.subscriptionEnd}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 pt-2">
                            <ContactActionMenu
                              phone={agency.phone}
                              secondaryPhone={agency.managerPhone}
                              contactName={getLocalized(agency.managerName, lang)}
                              compact
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setDetailTab('overview');
                                setSelectedAgencyId(agency.id);
                              }}
                              className="flex-1 rounded-lg bg-[#053332] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#0A4E4C] whitespace-nowrap"
                            >
                              {t.common.viewDetails}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDetailTab('branding');
                                setSelectedAgencyId(agency.id);
                              }}
                              className="rounded-lg border border-[#C6D9D7] bg-white p-1.5 text-[#053332] hover:bg-[#FFEDD5] hover:text-[#DF4416]"
                              title={t.agencies.brandingTab}
                            >
                              <Palette className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(agency)}
                              className="rounded-lg border border-[#C6D9D7] bg-white p-1.5 text-[#000000] hover:bg-[#FFEDD5] hover:text-[#DF4416]"
                              title={t.common.edit}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Mode 2: Agencies Table */
        <div className="ibonda-table-wrap">
          {filteredAgencies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4">
              <Building2 className="h-8 w-8 text-[#9DB3B1]" />
              <p className="mt-3 text-sm font-bold text-[#000000]">{t.common.noResults}</p>
              <p className="mt-1 text-xs text-[#374151]">{t.common.noResultsDesc}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-start text-xs">
                  <thead>
                    <tr className="ibonda-table-head">
                      <th className="px-4 py-3 text-start font-bold whitespace-nowrap">{t.agencies.colAgency}</th>
                      <th className="px-4 py-3 text-start font-bold whitespace-nowrap">{t.agencies.colManager}</th>
                      <th className="px-4 py-3 text-start font-bold whitespace-nowrap">{t.agencies.colContact}</th>
                      <th className="px-4 py-3 text-start font-bold whitespace-nowrap">{t.agencies.colPlan}</th>
                      <th className="px-4 py-3 text-start font-bold whitespace-nowrap">{t.agencies.colPeriod}</th>
                      <th className="px-4 py-3 text-start font-bold whitespace-nowrap">{t.agencies.colStatus}</th>
                      <th className="px-4 py-3 text-end font-bold whitespace-nowrap">{t.common.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE8E7]">
                    {paginatedAgencies.map((agency) => {
                      const plan = plans.find((p) => p.id === agency.currentPlanId);
                      const accent = getPackAccent(agency.currentPlanId);
                      return (
                        <tr key={agency.id} className="ibonda-table-row">
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                setDetailTab('overview');
                                setSelectedAgencyId(agency.id);
                              }}
                              className="flex items-center gap-3 text-start group"
                            >
                              {renderAgencyAvatar(agency)}
                              <div>
                                <p className="font-extrabold text-[#000000] group-hover:text-[#DF4416] group-hover:underline">
                                  {getLocalized(agency.name, lang)}
                                </p>
                                <p className="text-[11px] text-[#053332] font-semibold">
                                  {getLocalized(agency.city, lang)}
                                </p>
                              </div>
                            </button>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[#000000] whitespace-nowrap">
                            {getLocalized(agency.managerName, lang)}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <ContactActionMenu
                                phone={agency.phone}
                                secondaryPhone={agency.managerPhone}
                                contactName={getLocalized(agency.managerName, lang)}
                                compact
                              />
                              <div className="hidden xl:block">
                                <p className="font-mono text-[11px] font-semibold text-[#053332]">{agency.email}</p>
                                <p className="font-mono text-[11px] font-medium text-[#374151] tabular-nums" dir="ltr">
                                  {agency.phone}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${accent.badgeBorder} ${accent.badgeBg} ${accent.badgeText}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                              {plan ? getLocalized(plan.name, lang) : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                            {agency.subscriptionStart} → {agency.subscriptionEnd}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <select
                              value={agency.status}
                              onChange={(e) => updateAgencyStatus(agency.id, e.target.value as AgencyStatus)}
                              aria-label={t.agencies.colStatus}
                              className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none transition-colors cursor-pointer ${agencyStatusSelectClass(
                                agency.status
                              )}`}
                            >
                              {(
                                [
                                  'free_trial',
                                  'active',
                                  'pending_payment',
                                  'expired',
                                  'suspended',
                                  'cancelled',
                                  'trial_rejected',
                                ] as AgencyStatus[]
                              ).map((st) => (
                                <option key={st} value={st} className="bg-white text-[#000000]">
                                  {t.agencyStatus[st]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailTab('overview');
                                  setSelectedAgencyId(agency.id);
                                }}
                                className="rounded-lg bg-[#053332] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#0A4E4C] whitespace-nowrap"
                              >
                                {t.common.viewDetails}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailTab('branding');
                                  setSelectedAgencyId(agency.id);
                                }}
                                className="rounded-lg border border-[#C6D1CF] bg-[#EFF3F2] p-1.5 text-[#053332] hover:bg-[#E1E9E7]"
                                title={t.agencies.brandingTab}
                              >
                                <Palette className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(agency)}
                                className="rounded-lg border border-[#C6D9D7] bg-white p-1.5 text-[#000000] hover:border-[#DF4416] hover:bg-[#FFEDD5] hover:text-[#DF4416]"
                                title={t.common.edit}
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <TablePagination
                totalItems={filteredAgencies.length}
                pageSize={PAGE_SIZE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      )}

      {renderSharedModals()}
    </div>
  );
}
