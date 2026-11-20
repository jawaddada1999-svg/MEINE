import React, { useState } from 'react';
import { Check, Edit3, Info, Minus, Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { BillingCycle, Plan, PlanFeature } from '../../types/ibonda';
import { formatCurrency, getLocalized } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { StatusLabel } from '../ui/StatusLabel';
import { PageHeader } from '../ui/PageHeader';

interface PlansViewProps {
  openAddOnMount?: boolean;
  onConsumeOpenAdd?: () => void;
}

export function PlansView({ openAddOnMount, onConsumeOpenAdd }: PlansViewProps) {
  const {
    plans,
    features,
    agencies,
    settings,
    lang,
    t,
    savePlan,
    togglePlanActive,
    saveFeature,
    deleteFeature,
  } = useIbonda();

  const [showPlanModal, setShowPlanModal] = useState(Boolean(openAddOnMount));
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<PlanFeature | null>(null);
  const [confirmDeleteFeat, setConfirmDeleteFeat] = useState<PlanFeature | null>(null);

  const [planForm, setPlanForm] = useState({
    nameAr: '',
    nameFr: '',
    nameEn: '',
    descAr: '',
    descFr: '',
    descEn: '',
    price: 490,
    billingCycle: 'monthly' as BillingCycle,
    durationDays: 30,
    maxUsers: 5,
    maxProperties: 100,
    featureIds: [] as string[],
    active: true,
  });

  const [featForm, setFeatForm] = useState({
    key: '',
    nameAr: '',
    nameFr: '',
    nameEn: '',
    descAr: '',
    descFr: '',
    descEn: '',
    category: 'core' as PlanFeature['category'],
  });

  React.useEffect(() => {
    if (openAddOnMount) {
      openNewPlanModal();
      onConsumeOpenAdd?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAddOnMount]);

  const openNewPlanModal = () => {
    setEditingPlan(null);
    setPlanForm({
      nameAr: '',
      nameFr: '',
      nameEn: '',
      descAr: '',
      descFr: '',
      descEn: '',
      price: 590,
      billingCycle: 'monthly',
      durationDays: 30,
      maxUsers: 8,
      maxProperties: 200,
      featureIds: features.slice(0, 4).map((f) => f.id),
      active: true,
    });
    setShowPlanModal(true);
  };

  const openEditPlanModal = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      nameAr: plan.name.ar,
      nameFr: plan.name.fr,
      nameEn: plan.name.en,
      descAr: plan.description.ar,
      descFr: plan.description.fr,
      descEn: plan.description.en,
      price: plan.price,
      billingCycle: plan.billingCycle,
      durationDays: plan.durationDays,
      maxUsers: plan.maxUsers,
      maxProperties: plan.maxProperties,
      featureIds: [...plan.featureIds],
      active: plan.active,
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.nameAr.trim() && !planForm.nameEn.trim() && !planForm.nameFr.trim()) return;
    const fallbackName = planForm.nameEn || planForm.nameAr || planForm.nameFr;
    const fallbackDesc = planForm.descEn || planForm.descAr || planForm.descFr;

    savePlan({
      id: editingPlan?.id,
      name: {
        ar: planForm.nameAr.trim() || fallbackName,
        fr: planForm.nameFr.trim() || fallbackName,
        en: planForm.nameEn.trim() || fallbackName,
      },
      description: {
        ar: planForm.descAr.trim() || fallbackDesc,
        fr: planForm.descFr.trim() || fallbackDesc,
        en: planForm.descEn.trim() || fallbackDesc,
      },
      price: Number(planForm.price) || 0,
      billingCycle: planForm.billingCycle,
      durationDays: Math.max(1, Number(planForm.durationDays) || 30),
      maxUsers: Math.max(1, Number(planForm.maxUsers) || 1),
      maxProperties: Math.max(1, Number(planForm.maxProperties) || 1),
      featureIds: planForm.featureIds,
      active: planForm.active,
    });
    setShowPlanModal(false);
  };

  const resetFeatForm = () => {
    setEditingFeature(null);
    setFeatForm({
      key: '',
      nameAr: '',
      nameFr: '',
      nameEn: '',
      descAr: '',
      descFr: '',
      descEn: '',
      category: 'core',
    });
  };

  const handleSaveFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featForm.nameAr.trim() && !featForm.nameEn.trim() && !featForm.nameFr.trim()) return;
    const fallback = featForm.nameEn || featForm.nameAr || featForm.nameFr;
    saveFeature({
      id: editingFeature?.id,
      key: featForm.key.trim() || fallback.toLowerCase().replace(/\s+/g, '_'),
      name: {
        ar: featForm.nameAr.trim() || fallback,
        fr: featForm.nameFr.trim() || fallback,
        en: featForm.nameEn.trim() || fallback,
      },
      description: {
        ar: featForm.descAr.trim() || fallback,
        fr: featForm.descFr.trim() || fallback,
        en: featForm.descEn.trim() || fallback,
      },
      category: featForm.category,
    });
    resetFeatForm();
  };

  const inputClass = 'ibonda-input';

  const planThemes = [
    {
      card: 'border-2 border-[#15803D] bg-gradient-to-br from-[#86EFAC] via-[#4ADE80] to-[#22C55E]',
      priceBox: 'bg-white/95 border-[#15803D]/40',
      pill: 'bg-[#0F5132] text-white',
      checkBg: 'bg-[#0F5132] text-white',
    },
    {
      card: 'border-2 border-[#B8320D] bg-gradient-to-br from-[#FDBA74] via-[#FB923C] to-[#F97316]',
      priceBox: 'bg-white/95 border-[#B8320D]/40',
      pill: 'bg-[#9A2D0C] text-white',
      checkBg: 'bg-[#9A2D0C] text-white',
    },
    {
      card: 'border-2 border-[#053332] bg-gradient-to-br from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C]',
      priceBox: 'bg-white/95 border-[#053332]/40',
      pill: 'bg-[#053332] text-white',
      checkBg: 'bg-[#053332] text-[#FF6B42]',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.plans.title}
        subtitle={t.plans.subtitle}
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                resetFeatForm();
                setShowFeaturesModal(true);
              }}
              className="ibonda-btn-secondary"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#053332]" />
              {t.plans.manageFeatures}
            </button>
            <button
              type="button"
              onClick={openNewPlanModal}
              className="ibonda-btn-primary"
            >
              <Plus className="h-4 w-4" />
              {t.plans.addPlan}
            </button>
          </>
        }
      />

      <div className="flex items-start gap-2.5 rounded-xl border border-[#BAC7C5] bg-[#EFF3F2] px-4 py-3 text-xs font-bold text-[#000000]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#053332]" />
        <span>{t.plans.planChangeRuleNote}</span>
      </div>

      {/* Full-Color 3-Pack Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan, idx) => {
          const enrolledCount = agencies.filter((a) => a.currentPlanId === plan.id).length;
          const theme = planThemes[idx % planThemes.length];
          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-all hover:-translate-y-0.5 hover:shadow-xl ${theme.card} ${
                plan.active ? '' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-base font-black text-[#000000]">{getLocalized(plan.name, lang)}</h2>
                  <p className="mt-1 text-xs font-bold text-[#111827] leading-relaxed">
                    {getLocalized(plan.description, lang)}
                  </p>
                </div>
                <StatusLabel
                  tone={plan.active ? 'green' : 'slate'}
                  icon={plan.active ? 'check' : 'pause'}
                  label={plan.active ? t.plans.activeLabel : t.plans.inactiveLabel}
                />
              </div>

              <div className={`mt-4 rounded-xl border p-3.5 ${theme.priceBox}`}>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#000000] tabular-nums">
                    {formatCurrency(plan.price, settings.currency, lang)}
                  </span>
                  <span className="text-xs font-bold text-[#111827]">/ {t.billingCycle[plan.billingCycle]}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold tabular-nums">
                  <span className={`rounded-md px-2 py-0.5 ${theme.pill}`}>
                    {plan.maxUsers} {t.common.usersCount}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 ${theme.pill}`}>
                    {plan.maxProperties} {t.common.propertiesCount}
                  </span>
                  <span className="rounded-md border border-[#BAC7C5] bg-white px-2 py-0.5 text-[#000000]">
                    {enrolledCount} {t.nav.agencies}
                  </span>
                </div>
              </div>

              <ul className="mt-4 flex-1 space-y-2 rounded-xl bg-white/90 p-3.5 text-xs font-bold text-[#000000]">
                {features
                  .filter((f) => plan.featureIds.includes(f.id))
                  .map((feat) => (
                    <li key={feat.id} className="flex items-center gap-2">
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${theme.checkBg}`}>
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span>{getLocalized(feat.name, lang)}</span>
                    </li>
                  ))}
              </ul>

              <div className="mt-5 flex items-center gap-2 border-t border-black/15 pt-3.5">
                <button
                  type="button"
                  onClick={() => openEditPlanModal(plan)}
                  className="ibonda-btn-secondary flex-1 justify-center py-2"
                >
                  <Edit3 className="h-3.5 w-3.5 text-[#DF4416]" />
                  {t.common.edit}
                </button>
                <button
                  type="button"
                  onClick={() => togglePlanActive(plan.id)}
                  className="rounded-lg bg-[#053332] px-3 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#0A4E4C] whitespace-nowrap"
                >
                  {plan.active ? t.plans.inactiveLabel : t.plans.activeLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix */}
      <div className="ibonda-table-wrap">
        <div className="ibonda-card-header px-5 py-3.5">
          <h2 className="text-sm font-black text-[#000000]">{t.plans.comparisonMatrix}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-xs">
            <thead>
              <tr className="ibonda-table-head">
                <th className="px-4 py-3 text-start font-bold">{t.plans.featureName}</th>
                {plans.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-center font-extrabold text-white whitespace-nowrap">
                    {getLocalized(p.name, lang)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE8E7]">
              <tr className="ibonda-table-row">
                <td className="px-4 py-3 font-extrabold text-[#000000]">{t.plans.maxUsers}</td>
                {plans.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center font-mono font-black text-[#053332] tabular-nums">
                    {p.maxUsers}
                  </td>
                ))}
              </tr>
              <tr className="ibonda-table-row">
                <td className="px-4 py-3 font-extrabold text-[#000000]">{t.plans.maxProperties}</td>
                {plans.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center font-mono font-black text-[#DF4416] tabular-nums">
                    {p.maxProperties}
                  </td>
                ))}
              </tr>
              {features.map((feat) => (
                <tr key={feat.id} className="ibonda-table-row">
                  <td className="px-4 py-3 font-bold text-[#000000]">{getLocalized(feat.name, lang)}</td>
                  {plans.map((p) => {
                    const has = p.featureIds.includes(feat.id);
                    return (
                      <td key={p.id} className="px-4 py-3 text-center">
                        {has ? (
                          <span className="mx-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#BBF7D0] text-[#14532D]">
                            <Check className="h-3 w-3" />
                          </span>
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-slate-300" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Form Modal */}
      <Modal
        open={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title={editingPlan ? t.plans.editPlan : t.plans.addPlan}
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.planNameAr}</label>
              <input
                type="text"
                value={planForm.nameAr}
                onChange={(e) => setPlanForm({ ...planForm, nameAr: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.planNameFr}</label>
              <input
                type="text"
                value={planForm.nameFr}
                onChange={(e) => setPlanForm({ ...planForm, nameFr: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.planNameEn}</label>
              <input
                type="text"
                value={planForm.nameEn}
                onChange={(e) => setPlanForm({ ...planForm, nameEn: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.descAr}</label>
              <input
                type="text"
                value={planForm.descAr}
                onChange={(e) => setPlanForm({ ...planForm, descAr: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.descFr}</label>
              <input
                type="text"
                value={planForm.descFr}
                onChange={(e) => setPlanForm({ ...planForm, descFr: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.descEn}</label>
              <input
                type="text"
                value={planForm.descEn}
                onChange={(e) => setPlanForm({ ...planForm, descEn: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.price}</label>
              <input
                type="number"
                min={0}
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) || 0 })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.billingCycle}</label>
              <select
                value={planForm.billingCycle}
                onChange={(e) => {
                  const cycle = e.target.value as BillingCycle;
                  setPlanForm({
                    ...planForm,
                    billingCycle: cycle,
                    durationDays: cycle === 'annual' ? 365 : cycle === 'quarterly' ? 90 : 30,
                  });
                }}
                className={inputClass}
              >
                <option value="monthly">{t.billingCycle.monthly}</option>
                <option value="quarterly">{t.billingCycle.quarterly}</option>
                <option value="annual">{t.billingCycle.annual}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.durationDays}</label>
              <input
                type="number"
                min={1}
                value={planForm.durationDays}
                onChange={(e) => setPlanForm({ ...planForm, durationDays: Number(e.target.value) || 30 })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.maxUsers}</label>
              <input
                type="number"
                min={1}
                value={planForm.maxUsers}
                onChange={(e) => setPlanForm({ ...planForm, maxUsers: Number(e.target.value) || 1 })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.plans.maxProperties}</label>
              <input
                type="number"
                min={1}
                value={planForm.maxProperties}
                onChange={(e) => setPlanForm({ ...planForm, maxProperties: Number(e.target.value) || 1 })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#000000]">{t.plans.includedFeatures}</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto rounded-lg border border-[#C6D9D7] bg-[#F2F7F7] p-3">
              {features.map((feat) => {
                const checked = planForm.featureIds.includes(feat.id);
                return (
                  <label key={feat.id} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-[#000000] hover:bg-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setPlanForm({
                          ...planForm,
                          featureIds: checked
                            ? planForm.featureIds.filter((id) => id !== feat.id)
                            : [...planForm.featureIds, feat.id],
                        });
                      }}
                      className="accent-[#DF4416]"
                    />
                    <span>{getLocalized(feat.name, lang)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#000000] cursor-pointer">
            <input
              type="checkbox"
              checked={planForm.active}
              onChange={(e) => setPlanForm({ ...planForm, active: e.target.checked })}
              className="accent-[#DF4416]"
            />
            <span>{t.plans.planStatus}: {planForm.active ? t.plans.activeLabel : t.plans.inactiveLabel}</span>
          </label>

          <div className="flex justify-end gap-2 border-t border-[#D6E4E3] pt-4">
            <button
              type="button"
              onClick={() => setShowPlanModal(false)}
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

      {/* Feature Management Modal */}
      <Modal
        open={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        title={t.plans.manageFeatures}
        maxWidthClass="max-w-3xl"
      >
        <div className="space-y-5">
          <form onSubmit={handleSaveFeature} className="rounded-xl border border-[#C6D1CF] bg-[#EFF3F2] p-4 space-y-3">
            <h4 className="text-xs font-extrabold text-[#000000]">
              {editingFeature ? t.plans.editFeature : t.plans.addFeature}
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder={t.plans.planNameAr}
                value={featForm.nameAr}
                onChange={(e) => setFeatForm({ ...featForm, nameAr: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder={t.plans.planNameFr}
                value={featForm.nameFr}
                onChange={(e) => setFeatForm({ ...featForm, nameFr: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder={t.plans.planNameEn}
                value={featForm.nameEn}
                onChange={(e) => setFeatForm({ ...featForm, nameEn: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex justify-end gap-2">
              {editingFeature && (
                <button
                  type="button"
                  onClick={resetFeatForm}
                  className="ibonda-btn-secondary py-1.5 px-3"
                >
                  {t.common.cancel}
                </button>
              )}
              <button
                type="submit"
                className="ibonda-btn-primary py-1.5 px-4"
              >
                {editingFeature ? t.common.save : t.common.add}
              </button>
            </div>
          </form>

          <div className="divide-y divide-[#DDE8E7] rounded-xl border border-[#C6D9D7] overflow-hidden">
            {features.map((feat) => (
              <div key={feat.id} className="flex items-center justify-between px-4 py-3 text-xs">
                <div>
                  <p className="font-bold text-[#000000]">{getLocalized(feat.name, lang)}</p>
                  <p className="text-[11px] font-semibold text-[#111827]">{getLocalized(feat.description, lang)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFeature(feat);
                      setFeatForm({
                        key: feat.key,
                        nameAr: feat.name.ar,
                        nameFr: feat.name.fr,
                        nameEn: feat.name.en,
                        descAr: feat.description.ar,
                        descFr: feat.description.fr,
                        descEn: feat.description.en,
                        category: feat.category,
                      });
                    }}
                    className="rounded border border-[#C6D9D7] p-1.5 text-[#000000] hover:bg-[#EDF5F4]"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteFeat(feat)}
                    className="rounded border border-red-200 p-1.5 text-[#DC4545] hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(confirmDeleteFeat)}
        onClose={() => setConfirmDeleteFeat(null)}
        onConfirm={() => {
          if (confirmDeleteFeat) deleteFeature(confirmDeleteFeat.id);
        }}
        title={t.common.delete}
        message={t.plans.confirmDeleteFeature}
        variant="danger"
      />
    </div>
  );
}
