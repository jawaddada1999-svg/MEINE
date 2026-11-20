import React, { useState } from 'react';
import { Download, Info, RotateCcw, ShieldCheck } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { Language, LocalizedField } from '../../types/ibonda';
import { getLocalized } from '../../utils/formatters';
import { ConfirmModal } from '../ui/ConfirmModal';
import { PageHeader } from '../ui/PageHeader';

type SettingsTab = 'general' | 'language' | 'account' | 'security' | 'system';

function mergeLocalized(existing: LocalizedField, nextVal: string, lang: Language): LocalizedField {
  if (typeof existing === 'object' && existing !== null) {
    return { ...existing, [lang]: nextVal };
  }
  const base = typeof existing === 'string' ? existing : nextVal;
  return {
    ar: lang === 'ar' ? nextVal : base || nextVal,
    fr: lang === 'fr' ? nextVal : base || nextVal,
    en: lang === 'en' ? nextVal : base || nextVal,
  };
}

export function SettingsView() {
  const {
    settings,
    activities,
    lang,
    setLang,
    t,
    updateSettings,
    exportBackup,
    resetDemoData,
  } = useIbonda();

  const [tab, setTab] = useState<SettingsTab>('general');
  const [confirmReset, setConfirmReset] = useState(false);

  const [form, setForm] = useState(settings);

  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'general', label: t.settings.tabGeneral },
    { key: 'language', label: t.settings.tabLanguage },
    { key: 'account', label: t.settings.tabAccount },
    { key: 'security', label: t.settings.tabSecurity },
    { key: 'system', label: t.settings.tabSystem },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const inputClass = 'ibonda-input bg-white';

  return (
    <div className="space-y-5">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      {/* Tabs */}
      <div className="ibonda-tabs-bar flex flex-wrap items-center gap-1.5 p-1.5">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
              tab === item.key
                ? 'bg-[#053332] text-white shadow-xs'
                : 'text-[#000000] hover:bg-white/80 hover:text-[#DF4416]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-xl border border-[#2D6A4F]/40 bg-gradient-to-br from-[#F4F8F6] via-[#EBF2EE] to-[#E0EBE5] p-6 space-y-5 shadow-[0_3px_12px_rgba(5,51,50,0.08)]"
      >
        {tab === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.platformName}</label>
                <input
                  type="text"
                  value={getLocalized(form.platformName, lang)}
                  onChange={(e) =>
                    setForm({ ...form, platformName: mergeLocalized(form.platformName, e.target.value, lang) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.officialEmail}</label>
                <input
                  type="email"
                  value={form.officialEmail}
                  onChange={(e) => setForm({ ...form, officialEmail: e.target.value })}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.officialPhone}</label>
                <input
                  type="text"
                  value={form.officialPhone}
                  onChange={(e) => setForm({ ...form, officialPhone: e.target.value })}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.platformDesc}</label>
              <textarea
                rows={3}
                value={form.description[lang]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: { ...form.description, [lang]: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        )}

        {tab === 'language' && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#000000]">{t.settings.defaultLanguage}</label>
              <select
                value={lang}
                onChange={(e) => {
                  const chosen = e.target.value as Language;
                  setLang(chosen);
                  setForm({ ...form, defaultLanguage: chosen });
                }}
                className={inputClass}
              >
                <option value="ar">{t.common.languageName.ar} ({t.settings.rtlTag})</option>
                <option value="fr">{t.common.languageName.fr} ({t.settings.ltrTag})</option>
                <option value="en">{t.common.languageName.en} ({t.settings.ltrTag})</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-[#000000]">{t.settings.enabledLanguages}</label>
              <div className="space-y-2 rounded-lg border border-[#B2D3D0] bg-white p-3.5 text-xs">
                {(['ar', 'fr', 'en'] as Language[]).map((l) => (
                  <label key={l} className="flex items-center gap-2.5 text-[#000000] font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enabledLanguages.includes(l)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.enabledLanguages, l]
                          : form.enabledLanguages.filter((x) => x !== l);
                        if (next.length > 0) setForm({ ...form, enabledLanguages: next });
                      }}
                      className="accent-[#DF4416]"
                    />
                    <span>{t.common.languageName[l]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'account' && (
          <div className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.adminName}</label>
                <input
                  type="text"
                  value={getLocalized(form.adminName, lang)}
                  onChange={(e) =>
                    setForm({ ...form, adminName: mergeLocalized(form.adminName, e.target.value, lang) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.adminEmail}</label>
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-[#B2D3D0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#000000]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#053332]" />
              <span>{t.settings.passwordAuthNotice}</span>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="space-y-5">
            <div className="space-y-3 max-w-xl">
              <label className="flex items-center gap-2.5 rounded-lg border border-[#B2D3D0] bg-white px-3.5 py-2.5 text-xs font-bold text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.twoFactorRequired}
                  onChange={(e) => setForm({ ...form, twoFactorRequired: e.target.checked })}
                  className="accent-[#DF4416]"
                />
                <ShieldCheck className="h-4 w-4 text-[#053332]" />
                <span>{t.settings.twoFactorLabel}</span>
              </label>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.sessionTimeoutLabel}</label>
                <input
                  type="number"
                  min={15}
                  max={480}
                  value={form.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setForm({ ...form, sessionTimeoutMinutes: Number(e.target.value) || 60 })
                  }
                  className="ibonda-input bg-white w-40 font-mono"
                />
              </div>

              <div className="rounded-lg border-2 border-[#C2410C] bg-[#FED7AA] p-3.5 text-xs">
                <p className="font-black text-[#000000]">{t.settings.activeSessionTitle}</p>
                <p className="mt-1 font-semibold text-[#111827]">{t.settings.activeSessionDesc}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-extrabold text-[#000000]">{t.settings.auditLogTitle}</h3>
              <div className="ibonda-table-wrap max-h-64 overflow-y-auto divide-y divide-[#DDE8E7]">
                {activities.slice(0, 15).map((act) => (
                  <div key={act.id} className="ibonda-table-row flex items-center justify-between px-4 py-2.5 text-xs">
                    <div>
                      <p className="font-bold text-[#000000]">{getLocalized(act.message, lang)}</p>
                      <p className="text-[11px] font-medium text-[#374151]">{getLocalized(act.actor, lang)}</p>
                    </div>
                    <span className="rounded-md bg-[#E6ECEB] px-2 py-0.5 font-mono text-[11px] font-bold text-[#053332] tabular-nums">
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'system' && (
          <div className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.currencyLabel}</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value as 'MAD' | 'EUR' | 'USD' })}
                  className={inputClass}
                >
                  <option value="MAD">{t.settings.currencyNames.MAD}</option>
                  <option value="EUR">{t.settings.currencyNames.EUR}</option>
                  <option value="USD">{t.settings.currencyNames.USD}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.timezoneLabel}</label>
                <input
                  type="text"
                  value={getLocalized(form.timezone, lang)}
                  onChange={(e) =>
                    setForm({ ...form, timezone: mergeLocalized(form.timezone, e.target.value, lang) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.trialDurationLabel}</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.trialDurationDays}
                  onChange={(e) => setForm({ ...form, trialDurationDays: Number(e.target.value) || 7 })}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#000000]">{t.settings.trialWarningLabel}</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={form.trialWarningDays}
                  onChange={(e) => setForm({ ...form, trialWarningDays: Number(e.target.value) || 3 })}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-[#BCE1DD] pt-4">
              <p className="text-xs font-extrabold text-[#000000]">{t.settings.alertsSection}</p>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.notifyOnTrialExpiry}
                  onChange={(e) => setForm({ ...form, notifyOnTrialExpiry: e.target.checked })}
                  className="accent-[#DF4416]"
                />
                <span>{t.settings.notifyTrialExpiry}</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.notifyOnOverduePayment}
                  onChange={(e) => setForm({ ...form, notifyOnOverduePayment: e.target.checked })}
                  className="accent-[#DF4416]"
                />
                <span>{t.settings.notifyOverduePayment}</span>
              </label>
            </div>

            <div className="space-y-3 border-t border-[#BCE1DD] pt-4">
              <p className="text-xs font-extrabold text-[#000000]">{t.settings.backupSection}</p>
              <p className="text-xs font-medium text-[#374151] leading-relaxed">{t.settings.backupHonestNote}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportBackup}
                  className="ibonda-btn-secondary inline-flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-[#053332]" />
                  {t.settings.exportJsonBackup}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-[#FDE4E4] px-3.5 py-2 text-xs font-bold text-[#991B1B] transition-colors hover:bg-red-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t.settings.resetDemoData}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-[#BCE1DD] pt-4">
          <button
            type="submit"
            className="ibonda-btn-primary px-6"
          >
            {t.common.save}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetDemoData}
        title={t.settings.confirmResetTitle}
        message={t.settings.confirmResetMsg}
        variant="danger"
      />
    </div>
  );
}
