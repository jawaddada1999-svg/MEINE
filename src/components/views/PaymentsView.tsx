import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Info,
  Plus,
  Printer,
  RotateCcw,
  Search,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { Payment, PaymentMethod, PaymentStatus } from '../../types/ibonda';
import {
  addDaysToIso,
  diffDaysFromToday,
  formatCurrency,
  formatNumber,
  getLocalized,
} from '../../utils/formatters';
import { REFERENCE_TODAY } from '../../data/seedData';
import { Modal } from '../ui/Modal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { ContactActionMenu } from '../ui/ContactActionMenu';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';
import { TablePagination } from '../ui/TablePagination';

interface PaymentsViewProps {
  initialStatusFilter?: PaymentStatus | 'all';
  onConsumeInitialFilter?: () => void;
}

const PAGE_SIZE = 6;
const BRAND_LOGO_SRC = '/assets/aistudio/IMG_8325_5ae20b19.jpeg';

function statusSelectTone(status: PaymentStatus): string {
  switch (status) {
    case 'paid':
      return 'border-[#15803D] bg-[#BBF7D0] text-[#000000]';
    case 'pending':
      return 'border-[#B45309] bg-[#FDE68A] text-[#000000]';
    case 'overdue':
      return 'border-[#B91C1C] bg-[#FECACA] text-[#000000]';
    case 'refunded':
      return 'border-[#64748B] bg-[#E2E8F0] text-[#000000]';
  }
}

export function PaymentsView({ initialStatusFilter, onConsumeInitialFilter }: PaymentsViewProps) {
  const {
    payments,
    agencies,
    subscriptions,
    plans,
    settings,
    lang,
    t,
    recordPayment,
    confirmPayment,
    markPaymentOverdue,
    refundPayment,
    updatePaymentStatus,
  } = useIbonda();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [invoicePayment, setInvoicePayment] = useState<Payment | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'confirm' | 'refund';
    payment: Payment;
  } | null>(null);

  const [form, setForm] = useState({
    agencyId: agencies[0]?.id || '',
    subscriptionId: subscriptions[0]?.id || '',
    amount: 490,
    method: 'bank_transfer' as PaymentMethod,
    transactionRef: '',
    paymentDate: '',
    dueDate: addDaysToIso(REFERENCE_TODAY, 7),
    notes: '',
  });

  React.useEffect(() => {
    if (initialStatusFilter && initialStatusFilter !== 'all') {
      setStatusFilter(initialStatusFilter);
      setPage(1);
      onConsumeInitialFilter?.();
    }
  }, [initialStatusFilter, onConsumeInitialFilter]);

  const stats = useMemo(() => {
    const monthPrefix = REFERENCE_TODAY.slice(0, 7);
    const paid = payments.filter((p) => p.status === 'paid');
    const totalRevenue = paid.reduce((s, p) => s + p.amount, 0);
    const monthRevenue = paid
      .filter((p) => (p.paymentDate || p.createdAt).startsWith(monthPrefix))
      .reduce((s, p) => s + p.amount, 0);
    const dueAmount = payments
      .filter((p) => p.status === 'pending')
      .reduce((s, p) => s + p.amount, 0);
    const overdueAmount = payments
      .filter((p) => p.status === 'overdue')
      .reduce((s, p) => s + p.amount, 0);
    return {
      totalRevenue,
      monthRevenue,
      dueAmount,
      overdueAmount,
      completedCount: paid.length,
    };
  }, [payments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      const ag = agencies.find((a) => a.id === p.agencyId);
      const matchesQ =
        !q ||
        p.transactionRef.toLowerCase().includes(q) ||
        (ag ? getLocalized(ag.name, lang) : '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
      return matchesQ && matchesStatus && matchesMethod;
    });
  }, [payments, agencies, lang, search, statusFilter, methodFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const openRecordModal = () => {
    const firstAgency = agencies[0];
    const sub = subscriptions.find((s) => s.agencyId === firstAgency?.id);
    const plan = plans.find((p) => p.id === (sub?.planId || firstAgency?.currentPlanId));
    setForm({
      agencyId: firstAgency?.id || '',
      subscriptionId: sub?.id || '',
      amount: plan?.price || 490,
      method: 'bank_transfer',
      transactionRef: `IBN-${new Date().getFullYear()}-${String(payments.length + 1104)}`,
      paymentDate: REFERENCE_TODAY,
      dueDate: addDaysToIso(REFERENCE_TODAY, 7),
      notes: '',
    });
    setShowRecordModal(true);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agencyId || !form.transactionRef.trim() || form.amount <= 0) return;
    recordPayment(form);
    setShowRecordModal(false);
  };

  const renderTimingBadge = (pay: Payment) => {
    if (pay.status === 'refunded') {
      return <span className="text-[11px] font-bold text-[#111827]">—</span>;
    }

    if (pay.status === 'paid') {
      const paidDate = pay.paymentDate || REFERENCE_TODAY;
      const diff = diffDaysFromToday(pay.dueDate, paidDate);
      if (diff < 0) {
        const lateDays = Math.abs(diff);
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-[#B45309] bg-[#FDE68A] px-2 py-0.5 text-[11px] font-bold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNumber(lateDays, lang)} {t.payments.paidLateDays}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-[#15803D] bg-[#BBF7D0] px-2 py-0.5 text-[11px] font-bold text-[#000000] whitespace-nowrap">
          {t.payments.paidOnTime}
        </span>
      );
    }

    const delta = diffDaysFromToday(pay.dueDate, REFERENCE_TODAY);
    if (delta < 0) {
      const overdueDays = Math.abs(delta);
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-[#B91C1C] bg-[#FECACA] px-2 py-0.5 text-[11px] font-bold text-[#000000] tabular-nums whitespace-nowrap">
          {formatNumber(overdueDays, lang)} {t.payments.daysOverdue}
        </span>
      );
    }
    if (delta === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-[#B45309] bg-[#FDE68A] px-2 py-0.5 text-[11px] font-bold text-[#000000] whitespace-nowrap">
          {t.payments.dueToday}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-[#053332] bg-[#D1E7DF] px-2 py-0.5 text-[11px] font-bold text-[#000000] tabular-nums whitespace-nowrap">
        {formatNumber(delta, lang)} {t.payments.daysRemaining}
      </span>
    );
  };

  const invoiceAgency = invoicePayment
    ? agencies.find((a) => a.id === invoicePayment.agencyId)
    : null;
  const invoicePlan = invoicePayment
    ? plans.find((p) => p.id === invoicePayment.planId)
    : null;

  const inputClass = 'ibonda-input';

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.payments.title}
        subtitle={t.payments.subtitle}
        actions={
          <button
            type="button"
            onClick={openRecordModal}
            className="ibonda-btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t.payments.recordPayment}
          </button>
        }
      />

      {/* 5 Full-Color Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label={t.payments.totalRevenue}
          value={formatCurrency(stats.totalRevenue, settings.currency, lang)}
          icon={Wallet}
          tone="success"
        />
        <StatCard
          label={t.payments.monthRevenue}
          value={formatCurrency(stats.monthRevenue, settings.currency, lang)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label={t.payments.duePayments}
          value={formatCurrency(stats.dueAmount, settings.currency, lang)}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label={t.payments.overduePayments}
          value={formatCurrency(stats.overdueAmount, settings.currency, lang)}
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label={t.payments.completedCount}
          value={formatNumber(stats.completedCount, lang)}
          icon={CreditCard}
          tone="orange"
        />
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#C6D1CF] bg-[#EFF3F2] px-4 py-3 text-xs font-bold text-[#000000]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#053332]" />
        <span>{t.payments.paymentRuleNotice}</span>
      </div>

      {/* Filters */}
      <div className="ibonda-filter-bar">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#053332]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`${t.common.search}...`}
            className="ibonda-input ps-9 pe-3 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.payments.colStatus}: {t.common.all}</option>
          {(['paid', 'pending', 'overdue', 'refunded'] as PaymentStatus[]).map((st) => (
            <option key={st} value={st}>
              {t.paymentStatus[st]}
            </option>
          ))}
        </select>
        <select
          value={methodFilter}
          onChange={(e) => {
            setMethodFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.payments.colMethod}: {t.common.all}</option>
          {(['bank_transfer', 'card', 'cash', 'check'] as PaymentMethod[]).map((m) => (
            <option key={m} value={m}>
              {t.paymentMethod[m]}
            </option>
          ))}
        </select>
      </div>

      {/* Payments Table */}
      <div className="ibonda-table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-xs">
            <thead>
              <tr className="ibonda-table-head">
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colRef}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colAgency}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colPlan}</th>
                <th className="px-3.5 py-3 text-end font-semibold whitespace-nowrap">{t.payments.colAmount}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colPaymentDate}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colDueDate}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colTiming}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colMethod}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colStatus}</th>
                <th className="px-3.5 py-3 text-start font-semibold whitespace-nowrap">{t.payments.colContact}</th>
                <th className="px-3.5 py-3 text-end font-semibold whitespace-nowrap">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE8E7]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-[#374151]">
                    {t.common.noResults}
                  </td>
                </tr>
              ) : (
                paginated.map((pay) => {
                  const ag = agencies.find((a) => a.id === pay.agencyId);
                  const pl = plans.find((p) => p.id === pay.planId);
                  return (
                    <tr key={pay.id} className="ibonda-table-row">
                      <td className="px-3.5 py-3.5 font-mono font-bold text-[#000000] whitespace-nowrap">
                        {pay.transactionRef}
                      </td>
                      <td className="px-3.5 py-3.5 font-bold text-[#000000] whitespace-nowrap">
                        {ag ? getLocalized(ag.name, lang) : '—'}
                      </td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-[#C6D1CF] bg-[#EFF3F2] px-2 py-0.5 text-[11px] font-bold text-[#053332]">
                          {pl ? getLocalized(pl.name, lang) : '—'}
                        </span>
                      </td>
                      <td className="px-3.5 py-3.5 text-end font-extrabold text-[#000000] tabular-nums whitespace-nowrap">
                        {formatCurrency(pay.amount, settings.currency, lang)}
                      </td>
                      <td className="px-3.5 py-3.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                        {pay.paymentDate || (
                          <span className="font-sans font-medium text-[#6B7280]">{t.payments.notPaidYet}</span>
                        )}
                      </td>
                      <td className="px-3.5 py-3.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                        {pay.dueDate}
                      </td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">{renderTimingBadge(pay)}</td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-[#C2410C] bg-[#FED7AA] px-2 py-0.5 text-[11px] font-bold text-[#000000]">
                          {t.paymentMethod[pay.method]}
                        </span>
                      </td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <select
                          value={pay.status}
                          onChange={(e) => updatePaymentStatus(pay.id, e.target.value as PaymentStatus)}
                          aria-label={t.payments.colStatus}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none transition-colors cursor-pointer ${statusSelectTone(
                            pay.status
                          )}`}
                        >
                          {(['paid', 'pending', 'overdue', 'refunded'] as PaymentStatus[]).map((st) => (
                            <option key={st} value={st} className="bg-white text-[#000000]">
                              {t.paymentStatus[st]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <ContactActionMenu
                          phone={ag?.phone || ''}
                          secondaryPhone={ag?.managerPhone}
                          contactName={ag ? getLocalized(ag.managerName, lang) : ''}
                          compact
                        />
                      </td>
                      <td className="px-3.5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {(pay.status === 'pending' || pay.status === 'overdue') && (
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: 'confirm', payment: pay })}
                              className="inline-flex items-center gap-1 rounded-md bg-[#053332] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0A4E4C] whitespace-nowrap"
                            >
                              <CheckCircle2 className="h-3 w-3 text-[#DF4416]" />
                              {t.payments.confirmPaymentAction}
                            </button>
                          )}
                          {pay.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => markPaymentOverdue(pay.id)}
                              className="rounded-md border border-amber-300 bg-[#FEF2D6] p-1.5 text-[#92400E] hover:bg-amber-200"
                              title={t.payments.markOverdueAction}
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {pay.status === 'paid' && (
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: 'refund', payment: pay })}
                              className="rounded-md border border-[#C6D9D7] bg-white p-1.5 text-[#000000] hover:bg-[#EDF5F4]"
                              title={t.payments.refundAction}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setInvoicePayment(pay)}
                            className="inline-flex items-center gap-1 rounded-md border border-[#C6D9D7] bg-[#F4FAFA] px-2.5 py-1 text-[11px] font-bold text-[#000000] hover:border-[#DF4416] hover:bg-[#FFEDD5] whitespace-nowrap"
                          >
                            <FileText className="h-3 w-3 text-[#DF4416]" />
                            {t.payments.viewInvoice}
                          </button>
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

      {/* Record Payment Modal */}
      <Modal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title={t.payments.recordPayment}
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.selectAgency}</label>
            <select
              value={form.agencyId}
              onChange={(e) => {
                const agId = e.target.value;
                const sub = subscriptions.find((s) => s.agencyId === agId);
                const plan = plans.find((p) => p.id === sub?.planId);
                setForm({
                  ...form,
                  agencyId: agId,
                  subscriptionId: sub?.id || '',
                  amount: plan?.price || form.amount,
                });
              }}
              className={inputClass}
            >
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {getLocalized(a.name, lang)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.transactionRef}</label>
              <input
                type="text"
                required
                value={form.transactionRef}
                onChange={(e) => setForm({ ...form, transactionRef: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.colAmount}</label>
              <input
                type="number"
                min={1}
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.method}</label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}
                className={inputClass}
              >
                <option value="bank_transfer">{t.paymentMethod.bank_transfer}</option>
                <option value="card">{t.paymentMethod.card}</option>
                <option value="cash">{t.paymentMethod.cash}</option>
                <option value="check">{t.paymentMethod.check}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.paymentDate}</label>
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.payments.dueDate}</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.common.notes}</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-[#D6E4E3] pt-4">
            <button
              type="button"
              onClick={() => setShowRecordModal(false)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="ibonda-btn-primary"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Modal */}
      <Modal
        open={Boolean(invoicePayment)}
        onClose={() => setInvoicePayment(null)}
        title={t.payments.invoiceTitle}
        maxWidthClass="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setInvoicePayment(null)}
              className="ibonda-btn-secondary no-print"
            >
              {t.common.close}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="ibonda-btn-primary no-print"
            >
              <Printer className="h-3.5 w-3.5" />
              {t.common.printPdf}
            </button>
          </>
        }
      >
        {invoicePayment && (
          <div className="print-only-container space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-[#D6E4E3] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={BRAND_LOGO_SRC}
                  alt={t.common.appTitle}
                  className="h-11 w-11 rounded-xl border border-[#C6D9D7] object-cover"
                />
                <div>
                  <h2 className="text-lg font-extrabold text-[#000000]">
                    {getLocalized(settings.platformName, lang) || t.common.appTitle}
                  </h2>
                  <p className="text-[#374151]">{settings.officialEmail}</p>
                  <p className="text-[#374151] font-mono" dir="ltr">{settings.officialPhone}</p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-[#374151]">{t.payments.invoiceNumber}</p>
                <p className="font-mono text-sm font-black text-[#DF4416]">{invoicePayment.transactionRef}</p>
                <p className="mt-1 font-mono text-[#000000]">{invoicePayment.paymentDate || invoicePayment.dueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#374151]">{t.payments.billedTo}</p>
                <p className="mt-1 font-bold text-[#000000]">{invoiceAgency ? getLocalized(invoiceAgency.name, lang) : '—'}</p>
                <p className="text-[#374151]">{invoiceAgency ? getLocalized(invoiceAgency.city, lang) : ''}</p>
                <p className="text-[#374151] font-mono">{invoiceAgency?.email}</p>
              </div>
              <div className="text-end">
                <p className="text-[#374151]">{t.payments.colStatus}</p>
                <p className="mt-1 font-bold text-[#000000]">{t.paymentStatus[invoicePayment.status]}</p>
                <p className="text-[#053332] font-semibold">{t.paymentMethod[invoicePayment.method]}</p>
              </div>
            </div>

            <div className="rounded-lg border border-[#C6D9D7] overflow-hidden">
              <table className="w-full text-start">
                <thead className="bg-[#053332] text-white">
                  <tr>
                    <th className="px-4 py-2.5 text-start font-semibold">{t.payments.colPlan}</th>
                    <th className="px-4 py-2.5 text-end font-semibold">{t.payments.colAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-[#000000]">
                      {invoicePlan ? getLocalized(invoicePlan.name, lang) : t.nav.subscriptions}
                    </td>
                    <td className="px-4 py-3 text-end font-extrabold text-[#000000] tabular-nums">
                      {formatCurrency(invoicePayment.amount, settings.currency, lang)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {invoicePayment.notes && (
              <p className="text-[#374151]">
                <span className="font-semibold text-[#000000]">{t.common.notes}: </span>
                {getLocalized(invoicePayment.notes, lang)}
              </p>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === 'confirm') confirmPayment(confirmAction.payment.id);
          else refundPayment(confirmAction.payment.id);
        }}
        title={
          confirmAction?.type === 'confirm'
            ? t.payments.confirmPaymentTitle
            : t.payments.confirmRefundTitle
        }
        message={
          confirmAction?.type === 'confirm'
            ? t.payments.confirmPaymentMsg
            : t.payments.confirmRefundMsg
        }
        variant={confirmAction?.type === 'confirm' ? 'primary' : 'danger'}
      />
    </div>
  );
}
