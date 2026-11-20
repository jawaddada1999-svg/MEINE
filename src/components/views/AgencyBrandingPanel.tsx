import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Home,
  ImagePlus,
  LayoutDashboard,
  Palette,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { Agency, LocalizedField } from '../../types/ibonda';
import { useIbonda } from '../../store/IbondaStore';
import { formatCurrency, getLocalized } from '../../utils/formatters';

interface AgencyBrandingPanelProps {
  agency: Agency;
}

function normalizeHex(val: string, fallback: string): string {
  const clean = val.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean.toUpperCase();
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) return `#${clean.toUpperCase()}`;
  return fallback;
}

function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0;
  const rgb = [0, 2, 4].map((idx) => {
    const c = parseInt(clean.slice(idx, idx + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableTextOnBg(bgHex: string): string {
  return getRelativeLuminance(bgHex) > 0.45 ? '#000000' : '#FFFFFF';
}

export function AgencyBrandingPanel({ agency }: AgencyBrandingPanelProps) {
  const { plans, users, settings, lang, t, updateAgencyBranding, resetAgencyBranding } = useIbonda();

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const [displayNameDraft, setDisplayNameDraft] = useState<string>(() =>
    getLocalized(agency.branding?.displayName || agency.name, lang)
  );
  const [logoUrl, setLogoUrl] = useState<string>(() => agency.branding?.logoUrl || '');
  const [bannerUrl, setBannerUrl] = useState<string>(() => agency.branding?.bannerUrl || '');
  const [primaryColor, setPrimaryColor] = useState<string>(
    () => agency.branding?.primaryColor || agency.logoColor || '#053332'
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    () => agency.branding?.secondaryColor || '#DF4416'
  );
  const [accentColor, setAccentColor] = useState<string>(
    () => agency.branding?.accentColor || '#0D7A72'
  );

  useEffect(() => {
    setDisplayNameDraft(getLocalized(agency.branding?.displayName || agency.name, lang));
    setLogoUrl(agency.branding?.logoUrl || '');
    setBannerUrl(agency.branding?.bannerUrl || '');
    setPrimaryColor(agency.branding?.primaryColor || agency.logoColor || '#053332');
    setSecondaryColor(agency.branding?.secondaryColor || '#DF4416');
    setAccentColor(agency.branding?.accentColor || '#0D7A72');
  }, [agency.id, agency.branding, agency.name, agency.logoColor, lang]);

  const primaryHex = normalizeHex(primaryColor, '#053332');
  const secondaryHex = normalizeHex(secondaryColor, '#DF4416');
  const accentHex = normalizeHex(accentColor, '#0D7A72');

  const primaryContrast = useMemo(() => {
    const fg = getReadableTextOnBg(primaryHex);
    return getContrastRatio(primaryHex, fg);
  }, [primaryHex]);

  const secondaryContrast = useMemo(
    () => getContrastRatio(secondaryHex, '#FFFFFF'),
    [secondaryHex]
  );

  const hasLowContrast = primaryContrast < 4.5 || secondaryContrast < 3.0;

  const agencyPlan = plans.find((p) => p.id === agency.currentPlanId);
  const agencyUsersCount = users.filter((u) => u.agencyId === agency.id).length;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'bannerUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (field === 'logoUrl') setLogoUrl(reader.result);
        else setBannerUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const mergeLocalizedDisplayName = (nextVal: string): LocalizedField => {
    const trimmed = nextVal.trim();
    const existing = agency.branding?.displayName || agency.name;
    if (!trimmed) return existing;
    if (typeof existing === 'object') {
      return { ...existing, [lang]: trimmed };
    }
    return {
      ar: lang === 'ar' ? trimmed : existing || trimmed,
      fr: lang === 'fr' ? trimmed : existing || trimmed,
      en: lang === 'en' ? trimmed : existing || trimmed,
    };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyBranding(agency.id, {
      displayName: mergeLocalizedDisplayName(displayNameDraft),
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      primaryColor: primaryHex,
      secondaryColor: secondaryHex,
      accentColor: accentHex,
    });
  };

  const handleReset = () => {
    resetAgencyBranding(agency.id);
    setDisplayNameDraft(getLocalized(agency.name, lang));
    setLogoUrl('');
    setBannerUrl('');
    setPrimaryColor('#053332');
    setSecondaryColor('#DF4416');
    setAccentColor('#0D7A72');
  };

  const sidebarText = getReadableTextOnBg(primaryHex);
  const secondaryText = getReadableTextOnBg(secondaryHex);
  const accentText = getReadableTextOnBg(accentHex);
  const effectiveDisplayName = displayNameDraft.trim() || getLocalized(agency.name, lang);
  const initials = getLocalized(agency.logoInitials, lang);
  const agencyCity = getLocalized(agency.city, lang);

  return (
    <div className="space-y-5">
      {/* Isolation Guarantee Banner */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#C6D1CF] bg-[#EFF3F2] px-4 py-3 text-xs font-bold text-[#000000]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#053332]" />
        <span>{t.agencies.isolationNotice}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Start Column: Branding Customization Form */}
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-[#2D6A4F]/40 bg-gradient-to-br from-[#F4F8F6] to-[#E3ECE8] xl:col-span-5 p-5 space-y-5 shadow-[0_3px_12px_rgba(5,51,50,0.08)]"
        >
          <div className="flex items-start gap-3 border-b border-[#BCE1DD] pb-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#053332] text-[#DF4416]">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#000000]">{t.agencies.brandingTitle}</h2>
              <p className="mt-0.5 text-xs font-medium text-[#374151] leading-relaxed">
                {t.agencies.brandingSubtitle}
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#000000]">
              {t.agencies.displayName}
            </label>
            <input
              type="text"
              value={displayNameDraft}
              onChange={(e) => setDisplayNameDraft(e.target.value)}
              className="ibonda-input bg-white"
            />
          </div>

          {/* Logo Upload & Preview */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#000000]">
              {t.agencies.uploadLogo}
            </label>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#C6D9D7] text-sm font-bold"
                style={{
                  backgroundColor: logoUrl ? '#FFFFFF' : primaryHex,
                  color: sidebarText,
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={effectiveDisplayName}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logoUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="ibonda-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5"
                >
                  <ImagePlus className="h-3.5 w-3.5 text-[#DF4416]" />
                  {t.agencies.uploadLogo}
                </button>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-[#DC4545] hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t.agencies.removeLogo}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Optional Header Banner Upload */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#000000]">
              {t.agencies.uploadBanner}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'bannerUrl')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="ibonda-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5"
              >
                <ImagePlus className="h-3.5 w-3.5 text-[#053332]" />
                {t.agencies.uploadBanner}
              </button>
              {bannerUrl && (
                <button
                  type="button"
                  onClick={() => setBannerUrl('')}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-[#DC4545] hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t.agencies.removeBanner}
                </button>
              )}
            </div>
          </div>

          {/* 3 Color Pickers + HEX Inputs */}
          <div className="space-y-2.5 border-t border-[#BCE1DD] pt-4">
            {(
              [
                { key: 'primary', label: t.agencies.primaryColor, val: primaryColor, norm: primaryHex, setter: setPrimaryColor },
                { key: 'secondary', label: t.agencies.secondaryColor, val: secondaryColor, norm: secondaryHex, setter: setSecondaryColor },
                { key: 'accent', label: t.agencies.accentColor, val: accentColor, norm: accentHex, setter: setAccentColor },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#C6D9D7] bg-white px-3 py-2"
              >
                <label className="text-xs font-bold text-[#000000]">{item.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={item.norm}
                    onChange={(e) => item.setter(e.target.value.toUpperCase())}
                    className="h-8 w-10 cursor-pointer rounded-md border border-[#C6D9D7] bg-white p-0.5"
                    aria-label={item.label}
                  />
                  <input
                    type="text"
                    value={item.val}
                    maxLength={7}
                    onChange={(e) => item.setter(e.target.value)}
                    className="ibonda-input w-24 py-1.5 font-mono uppercase bg-white"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>

          {hasLowContrast && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-[#FEF2D6] px-3 py-2 text-[11px] font-bold text-[#92400E]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D97706]" />
              <span>{t.agencies.lowContrastWarning}</span>
            </div>
          )}

          {/* Save & Reset Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#BCE1DD] pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="ibonda-btn-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.agencies.resetBranding}
            </button>
            <button
              type="submit"
              className="ibonda-btn-primary"
            >
              <Save className="h-3.5 w-3.5" />
              {t.agencies.saveBranding}
            </button>
          </div>
        </form>

        {/* End Column: Live Agency Dashboard Preview */}
        <div className="rounded-xl border border-[#2D6A4F]/40 bg-gradient-to-br from-[#F2F7F4] to-[#E2EEE8] xl:col-span-7 overflow-hidden flex flex-col shadow-[0_3px_12px_rgba(5,51,50,0.08)]">
          <div className="border-b border-[#2D6A4F]/30 bg-gradient-to-r from-[#D8EFE4] to-[#BBE2CF] flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#000000]">{t.agencies.livePreviewTitle}</h3>
              <p className="text-xs font-semibold text-[#053332]">{t.agencies.previewNote}</p>
            </div>
            {agencyPlan && (
              <span className="rounded-md border border-[#B2D3D0] bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#053332] whitespace-nowrap">
                {getLocalized(agencyPlan.name, lang)}
              </span>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="flex-1 overflow-hidden rounded-xl border border-[#C6D9D7] bg-white flex min-h-[420px]">
              {/* Branded Agency Sidebar */}
              <div
                className="w-44 shrink-0 flex flex-col justify-between p-3.5 transition-colors"
                style={{ backgroundColor: primaryHex, color: sidebarText }}
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-white/15">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/15 text-xs font-bold">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={effectiveDisplayName}
                          className="h-full w-full object-contain bg-white p-0.5"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <span className="truncate text-xs font-bold">{effectiveDisplayName}</span>
                  </div>

                  <div className="mt-4 space-y-1 text-[11px] font-medium">
                    <div
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                      style={{ backgroundColor: secondaryHex, color: secondaryText }}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{t.agencies.previewSidebarHome}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 opacity-85">
                      <Home className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{t.agencies.previewSidebarProperties}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 opacity-85">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{t.agencies.previewSidebarClients}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 opacity-85">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{t.agencies.previewSidebarVisits}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-black/15 px-2.5 py-2 text-[10px] opacity-85">
                  {t.agencies.poweredByPlatform}
                </div>
              </div>

              {/* Branded Agency Main Viewport */}
              <div className="flex-1 flex flex-col min-w-0 bg-white">
                <div
                  className="relative flex items-center justify-between border-b border-[#DDE8E7] bg-white px-4 py-3 overflow-hidden"
                  style={
                    bannerUrl
                      ? {
                          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.92), rgba(255,255,255,0.82)), url(${bannerUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                >
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#000000] truncate">
                      {effectiveDisplayName}
                    </p>
                    <p className="text-[10px] font-medium text-[#374151] truncate">{agencyCity}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold"
                      style={{ backgroundColor: secondaryHex, color: secondaryText }}
                    >
                      <Plus className="h-3 w-3" />
                      {t.agencies.previewPrimaryBtn}
                    </span>
                    <span
                      className="hidden sm:inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold"
                      style={{ backgroundColor: accentHex, color: accentText }}
                    >
                      {t.agencies.previewAccentBtn}
                    </span>
                  </div>
                </div>

                {/* Branded Stat Cards + Mini Table */}
                <div className="p-4 space-y-4 flex-1">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-lg border border-[#D6E4E3] bg-[#F4FAFA] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#374151] truncate">
                          {t.agencies.previewStatProperties}
                        </span>
                        <Building2 className="h-3.5 w-3.5 shrink-0" style={{ color: secondaryHex }} />
                      </div>
                      <p className="mt-1.5 text-base font-extrabold text-[#000000] tabular-nums">
                        {agency.propertiesCount}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#D6E4E3] bg-[#FFF5F2] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#374151] truncate">
                          {t.agencies.previewStatLeads}
                        </span>
                        <Users className="h-3.5 w-3.5 shrink-0" style={{ color: accentHex }} />
                      </div>
                      <p className="mt-1.5 text-base font-extrabold text-[#000000] tabular-nums">
                        {agencyUsersCount} / {agencyPlan?.maxUsers || 5}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#D6E4E3] bg-[#EEF5F5] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#374151] truncate">
                          {t.agencies.previewStatVisits}
                        </span>
                        <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: primaryHex }} />
                      </div>
                      <p className="mt-1.5 text-base font-extrabold text-[#000000] tabular-nums">14</p>
                    </div>
                  </div>

                  {/* Mini Table inside Agency Portal Preview */}
                  <div className="overflow-hidden rounded-lg border border-[#D6E4E3] bg-white">
                    <div className="flex items-center justify-between border-b border-[#D6E4E3] bg-[#EEF5F5] px-3 py-2">
                      <span className="text-[11px] font-extrabold text-[#000000]">
                        {t.agencies.previewTableTitle}
                      </span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: accentHex }}
                      />
                    </div>
                    <div className="divide-y divide-[#E5EEED] text-[11px]">
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="font-semibold text-[#000000]">{t.agencies.previewRowProp1}</span>
                        <span className="font-mono font-bold text-[#000000] tabular-nums">
                          {formatCurrency(2450000, settings.currency, lang)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="font-semibold text-[#000000]">{t.agencies.previewRowProp2}</span>
                        <span className="font-mono font-bold text-[#000000] tabular-nums">
                          {formatCurrency(5900000, settings.currency, lang)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="font-semibold text-[#000000]">{t.agencies.previewRowProp3}</span>
                        <span className="font-mono font-bold text-[#000000] tabular-nums">
                          {formatCurrency(18500, settings.currency, lang)} / {t.common.monthShort}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
