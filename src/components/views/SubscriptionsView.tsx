import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  History,
  PauseCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { AgencyStatus, PaymentMethod, Subscription } from '../../types/ibonda';
import { diffDaysFromToday, formatCurrency, getLocalized } from '../../utils/formatters';
import { REFERENCE_TODAY } from '../../data/seedData';
import { Modal } from '../ui/Modal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { agencyStatusTone, paymentStatusTone, StatusLabel } from '../ui/StatusLabel';
import { PageHeader } from '../ui/PageHeader';
import { TablePagination } from '../ui/TablePagination';

type SubTab = 'all' | AgencyStatus;
const PAGE_SIZE = 6;

export function SubscriptionsView() {
  const {
    subscriptions,
    agencies,
    plans,
    settings,
    lang,
    t,
    setSelectedAgencyId,
    setActiveNav,
    createSubscription,
    changeSubscriptionPlan,
    extendSubscription,
    renewSubscription,
    convertTrialToPaid,
    suspendSubscription,
    cancelSubscription,
    activateSubscriptionAfterPayment,
    runExpiryCheck,
  } = useIbonda();

  const [tab, setTab] = useState<SubTab>('all');
  const [page, setPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    agencyId: agencies[0]?.id || '',
    planId: plans[0]?.id || '',
    startDate: REFERENCE_TODAY,
    isTrial: true,
    status: 'free_trial' as AgencyStatus,
  });

  const [extendTarget, setExtendTarget] = useState<Subscription | null>(null);
  const [extraDays, setExtraDays] = useState(14);

  const [changePlanTarget, setChangePlanTarget] = useState<Subscription | null>(null);
  const [newPlanId, setNewPlanId] = useState(plans[0]?.id || '');

  const [convertTarget, setConvertTarget] = useState<Subscription | null>(null);
  const [convertPlanId, setConvertPlanId] = useState(plans[0]?.id || '');
  const [convertMethod, setConvertMethod] = useState<PaymentMethod>('bank_transfer');
  const [confirmNow, setConfirmNow] = useState(false);

  const [activateTarget, setActivateTarget] = useState<Subscription | null>(null);
  const [activateMethod, setActivateMethod] = useState<PaymentMethod>('bank_transfer');

  const [historyTarget, setHistoryTarget] = useState<Subscription | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'suspend' | 'cancel';
    sub: Subscription;
  } | null>(null);

  const tabItems: { key: SubTab; label: string; count: number }[] = useMemo(
    () => [
      { key: 'all', label: t.subscriptions.tabAll, count: subscriptions.length },
      {
        key: 'free_trial',
        label: t.subscriptions.tabTrial,
        count: subscriptions.filter((s) => s.status === 'free_trial').length,
      },
      {
        key: 'active',
        label: t.subscriptions.tabActive,
        count: subscriptions.filter((s) => s.status === 'active').length,
      },
      {
        key: 'pending_payment',
        label: t.subscriptions.tabPending,
        count: subscriptions.filter((s) => s.status === 'pending_payment').length,
      },
      {
        key: 'expired',
        label: t.subscriptions.tabExpired,
        count: subscriptions.filter((s) => s.status === 'expired').length,
      },
      {
        key: 'suspended',
        label: t.subscriptions.tabSuspended,
        count: subscriptions.filter((s) => s.status === 'suspended').length,
      },
      {
        key: 'cancelled',
        label: t.subscriptions.tabCancelled,
        count: subscriptions.filter((s) => s.status === 'cancelled').length,
      },
    ],
    [subscriptions, t]
  );

  const filtered = useMemo(
    () => (tab === 'all' ? subscriptions : subscriptions.filter((s) => s.status === tab)),
    [subscriptions, tab]
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const expiringTrials = useMemo(
    () =>
      subscriptions.filter(
        (s) =>
          s.status === 'free_trial' &&
          diffDaysFromToday(s.endDate) >= 0 &&
          diffDaysFromToday(s.endDate) <= settings.trialWarningDays
      ),
    [subscriptions, settings.trialWarningDays]
  );

  const inputClass = 'ibonda-input';

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.subscriptions.title}
        subtitle={t.subscriptions.subtitle}
        actions={
          <>
            <button
              type="button"
              onClick={() => runExpiryCheck()}
              className="ibonda-btn-secondary"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#053332]" />
              {t.subscriptions.runExpiryCheck}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreateForm({
                  agencyId: agencies[0]?.id || '',
                  planId: plans.find((p) => p.active)?.id || plans[0]?.id || '',
                  startDate: REFERENCE_TODAY,
                  isTrial: true,
                  status: 'free_trial',
                });
                setShowCreateModal(true);
              }}
              className="ibonda-btn-primary"
            >
              <Plus className="h-4 w-4" />
              {t.subscriptions.createSub}
            </button>
          </>
        }
      />

      {/* Expiring 7-Day Trial Alert */}
      {expiringTrials.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-300 bg-gradient-to-r from-[#FEF2D6] to-[#FDE7B6] px-4 py-3 text-xs text-[#000000] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#B45309]" />
            <span className="font-bold">
              {t.subscriptions.trialAlertExpiring}:{' '}
              {expiringTrials
                .map((s) => {
                  const ag = agencies.find((a) => a.id === s.agencyId);
                  const d = diffDaysFromToday(s.endDate);
                  return `${ag ? getLocalized(ag.name, lang) : ''} (${d} ${t.common.days})`;
                })
                .join(' · ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setTab('free_trial');
              setPage(1);
            }}
            className="font-bold text-[#053332] underline whitespace-nowrap self-start sm:self-auto"
          >
            {t.subscriptions.tabTrial}
          </button>
        </div>
      )}

      {/* Segmented Category Tabs */}
      <div className="ibonda-tabs-bar">
        {tabItems.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setTab(item.key);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#053332] text-white shadow-xs'
                  : 'text-[#000000] hover:bg-white/80 hover:text-[#DF4416]'
              }`}
            >
              {item.label} <span className="tabular-nums opacity-85">({item.count})</span>
            </button>
          );
        })}
      </div>

      {/* Subscriptions Table */}
      <div className="ibonda-table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-xs">
            <thead>
              <tr className="ibonda-table-head">
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colAgency}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colPlan}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colStart}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colEnd}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colRemaining}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.subscriptions.colPrice}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colPaymentStatus}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.subscriptions.colSubStatus}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE8E7]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#374151]">
                    {t.common.noResults}
                  </td>
                </tr>
              ) : (
                paginated.map((sub) => {
                  const agency = agencies.find((a) => a.id === sub.agencyId);
                  const plan = plans.find((p) => p.id === sub.planId);
                  const daysLeft = diffDaysFromToday(sub.endDate);
                  const st = agencyStatusTone(sub.status);
                  const pst = paymentStatusTone(sub.paymentStatus);

                  return (
                    <tr key={sub.id} className="ibonda-table-row">
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (agency) {
                              setSelectedAgencyId(agency.id);
                              setActiveNav('agencies');
                            }
                          }}
                          className="font-black text-[#000000] hover:text-[#DF4416] hover:underline text-start"
                        >
                          {agency ? getLocalized(agency.name, lang) : '—'}
                        </button>
                        {sub.isTrial && (
                          <p className="text-[11px] font-bold text-[#0D7A72]">{t.subscriptions.trialBadge}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-[#C6D1CF] bg-[#EFF3F2] px-2.5 py-0.5 text-[11px] font-bold text-[#053332]">
                          {plan ? getLocalized(plan.name, lang) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                        {sub.startDate}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                        {sub.endDate}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums whitespace-nowrap">
                        {daysLeft >= 0 ? (
                          <span
                            className={`font-bold ${
                              sub.isTrial && daysLeft <= settings.trialWarningDays
                                ? 'text-[#B45309]'
                                : 'text-[#000000]'
                            }`}
                          >
                            {daysLeft} {t.common.days} {t.common.daysLeft}
                          </span>
                        ) : (
                          <span className="font-bold text-[#991B1B]">
                            {t.common.expiredDaysAgo} {Math.abs(daysLeft)} {t.common.days}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-end font-extrabold text-[#000000] tabular-nums whitespace-nowrap">
                        {formatCurrency(sub.price, settings.currency, lang)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusLabel
                          tone={pst.tone}
                          icon={pst.icon}
                          label={t.paymentStatus[sub.paymentStatus]}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusLabel
                          tone={st.tone}
                          icon={st.icon}
                          label={t.agencyStatus[sub.status]}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {sub.status === 'free_trial' && (
                            <button
                              type="button"
                              onClick={() => {
                                setConvertTarget(sub);
                                setConvertPlanId(sub.planId);
                                setConfirmNow(false);
                              }}
                              className="rounded-md bg-[#DF4416] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#BD320A] whitespace-nowrap"
                            >
                              {t.subscriptions.convertTrialAction}
                            </button>
                          )}
                          {sub.status === 'pending_payment' && (
                            <button
                              type="button"
                              onClick={() => setActivateTarget(sub)}
                              className="inline-flex items-center gap-1 rounded-md bg-[#053332] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0A4E4C] whitespace-nowrap"
                            >
                              <CheckCircle2 className="h-3 w-3 text-[#FB923C]" />
                              {t.subscriptions.activateAfterPayment}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setExtendTarget(sub);
                              setExtraDays(14);
                            }}
                            className="rounded-md border border-[#C6D9D7] bg-white p-1.5 text-[#000000] hover:bg-[#EDF5F4]"
                            title={t.subscriptions.extendAction}
                          >
                            <CalendarPlus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => renewSubscription(sub.id)}
                            className="rounded-md border border-[#C6D9D7] bg-white p-1.5 text-[#000000] hover:bg-[#EDF5F4]"
                            title={t.subscriptions.renewAction}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setChangePlanTarget(sub);
                              setNewPlanId(sub.planId);
                            }}
                            className="rounded-md border border-[#C6D9D7] bg-white px-2.5 py-1 text-[11px] font-bold text-[#000000] hover:bg-[#EDF5F4] whitespace-nowrap"
                          >
                            {t.subscriptions.changePlanAction}
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryTarget(sub)}
                            className="rounded-md border border-[#C6D9D7] bg-white p-1.5 text-[#000000] hover:bg-[#EDF5F4]"
                            title={t.subscriptions.historyAction}
                          >
                            <History className="h-3.5 w-3.5" />
                          </button>
                          {sub.status !== 'suspended' && sub.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: 'suspend', sub })}
                              className="rounded-md border border-amber-300 bg-[#FEF2D6] p-1.5 text-[#92400E] hover:bg-amber-200"
                              title={t.subscriptions.suspendAction}
                            >
                              <PauseCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {sub.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: 'cancel', sub })}
                              className="rounded-md border border-red-300 bg-[#FDE4E4] p-1.5 text-[#991B1B] hover:bg-red-200"
                              title={t.subscriptions.cancelAction}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      {/* Create Subscription Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t.subscriptions.createSub}
        maxWidthClass="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                createSubscription(createForm);
                setShowCreateModal(false);
              }}
              className="ibonda-btn-primary"
            >
              {t.common.create}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.subscriptions.colAgency}</label>
            <select
              value={createForm.agencyId}
              onChange={(e) => setCreateForm({ ...createForm, agencyId: e.target.value })}
              className={inputClass}
            >
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {getLocalized(a.name, lang)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.subscriptions.colPlan}</label>
            <select
              value={createForm.planId}
              onChange={(e) => setCreateForm({ ...createForm, planId: e.target.value })}
              className={inputClass}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.subscriptions.colStart}</label>
              <input
                type="date"
                value={createForm.startDate}
                onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.subscriptions.colSubStatus}</label>
              <select
                value={createForm.isTrial ? 'free_trial' : createForm.status}
                onChange={(e) => {
                  const val = e.target.value as AgencyStatus;
                  setCreateForm({
                    ...createForm,
                    isTrial: val === 'free_trial',
                    status: val,
                  });
                }}
                className={inputClass}
              >
                <option value="free_trial">{t.agencyStatus.free_trial} ({settings.trialDurationDays} {t.common.days})</option>
                <option value="pending_payment">{t.agencyStatus.pending_payment}</option>
                <option value="active">{t.agencyStatus.active}</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Extend Modal */}
      <Modal
        open={Boolean(extendTarget)}
        onClose={() => setExtendTarget(null)}
        title={t.subscriptions.extendAction}
        maxWidthClass="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setExtendTarget(null)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (extendTarget) extendSubscription(extendTarget.id, extraDays);
                setExtendTarget(null);
              }}
              className="ibonda-btn-primary"
            >
              {t.common.confirm}
            </button>
          </>
        }
      >
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.subscriptions.extendDaysLabel}</label>
          <input
            type="number"
            min={1}
            max={365}
            value={extraDays}
            onChange={(e) => setExtraDays(Math.max(1, Number(e.target.value) || 1))}
            className={`${inputClass} font-mono`}
          />
        </div>
      </Modal>

      {/* Change Plan Modal */}
      <Modal
        open={Boolean(changePlanTarget)}
        onClose={() => setChangePlanTarget(null)}
        title={t.subscriptions.changePlanAction}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setChangePlanTarget(null)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (changePlanTarget) changeSubscriptionPlan(changePlanTarget.id, newPlanId);
                setChangePlanTarget(null);
              }}
              className="ibonda-btn-primary"
            >
              {t.common.confirm}
            </button>
          </>
        }
      >
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.selectPlan}</label>
          <select
            value={newPlanId}
            onChange={(e) => setNewPlanId(e.target.value)}
            className={inputClass}
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {getLocalized(p.name, lang)} — {formatCurrency(p.price, settings.currency, lang)}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Convert Trial Modal */}
      <Modal
        open={Boolean(convertTarget)}
        onClose={() => setConvertTarget(null)}
        title={t.subscriptions.convertTrialModalTitle}
        maxWidthClass="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setConvertTarget(null)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (convertTarget) {
                  convertTrialToPaid(convertTarget.id, convertPlanId, convertMethod, confirmNow);
                }
                setConvertTarget(null);
              }}
              className="ibonda-btn-primary"
            >
              {t.common.confirm}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-[#C6D1CF] bg-[#EFF3F2] px-3.5 py-2.5 text-xs font-semibold text-[#053332]">
            {t.subscriptions.convertTrialRuleNote}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.selectPlan}</label>
            <select
              value={convertPlanId}
              onChange={(e) => setConvertPlanId(e.target.value)}
              className={inputClass}
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
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.method}</label>
            <select
              value={convertMethod}
              onChange={(e) => setConvertMethod(e.target.value as PaymentMethod)}
              className={inputClass}
            >
              <option value="bank_transfer">{t.paymentMethod.bank_transfer}</option>
              <option value="card">{t.paymentMethod.card}</option>
              <option value="cash">{t.paymentMethod.cash}</option>
              <option value="check">{t.paymentMethod.check}</option>
            </select>
          </div>
          <div className="space-y-2 rounded-lg border border-[#C6D9D7] p-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#000000] cursor-pointer">
              <input
                type="radio"
                checked={!confirmNow}
                onChange={() => setConfirmNow(false)}
                className="accent-[#DF4416]"
              />
              <span>{t.subscriptions.createPendingPayment}</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#000000] cursor-pointer">
              <input
                type="radio"
                checked={confirmNow}
                onChange={() => setConfirmNow(true)}
                className="accent-[#DF4416]"
              />
              <span>{t.subscriptions.confirmPaymentNow}</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Activate After Payment Confirmation Modal */}
      <Modal
        open={Boolean(activateTarget)}
        onClose={() => setActivateTarget(null)}
        title={t.subscriptions.activateAfterPayment}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setActivateTarget(null)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (activateTarget) activateSubscriptionAfterPayment(activateTarget.id, activateMethod);
                setActivateTarget(null);
              }}
              className="ibonda-btn-primary"
            >
              {t.payments.confirmPaymentAction}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs font-medium text-[#374151]">{t.payments.confirmPaymentMsg}</p>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.method}</label>
            <select
              value={activateMethod}
              onChange={(e) => setActivateMethod(e.target.value as PaymentMethod)}
              className={inputClass}
            >
              <option value="bank_transfer">{t.paymentMethod.bank_transfer}</option>
              <option value="card">{t.paymentMethod.card}</option>
              <option value="cash">{t.paymentMethod.cash}</option>
              <option value="check">{t.paymentMethod.check}</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Past History Modal */}
      <Modal
        open={Boolean(historyTarget)}
        onClose={() => setHistoryTarget(null)}
        title={t.subscriptions.historyTitle}
        maxWidthClass="max-w-lg"
        footer={
          <button
            type="button"
            onClick={() => setHistoryTarget(null)}
            className="ibonda-btn-primary"
          >
            {t.common.close}
          </button>
        }
      >
        {historyTarget && (
          <div className="space-y-3">
            {historyTarget.history.length === 0 ? (
              <p className="text-xs text-[#374151]">{t.common.noResults}</p>
            ) : (
              historyTarget.history.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-[#C6D9D7] bg-[#F2F7F7] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#000000]">{getLocalized(entry.planName, lang)}</span>
                    <span className="font-mono text-[11px] font-semibold text-[#374151]">
                      {entry.startDate} → {entry.endDate}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-[#111827]">{getLocalized(entry.note, lang)}</p>
                  <p className="mt-1 font-black text-[#DF4416] tabular-nums">
                    {formatCurrency(entry.price, settings.currency, lang)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'suspend') suspendSubscription(confirmAction.sub.id);
          else cancelSubscription(confirmAction.sub.id);
        }}
        title={
          confirmAction?.type === 'suspend'
            ? t.subscriptions.suspendAction
            : t.subscriptions.cancelAction
        }
        message={
          confirmAction?.type === 'suspend'
            ? t.subscriptions.confirmSuspendMsg
            : t.subscriptions.confirmCancelMsg
        }
      />
    </div>
  );
}
