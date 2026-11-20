import React, { useMemo } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Layers,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { formatCurrency, formatNumber, getLocalized } from '../../utils/formatters';
import {
  GroupedComparisonChart,
  HorizontalDistributionList,
  SimpleBarChart,
  SmoothAreaChart,
} from '../ui/SvgCharts';
import { REFERENCE_TODAY } from '../../data/seedData';
import { PageHeader } from '../ui/PageHeader';
import { StatCard, StatTone } from '../ui/StatCard';

interface OverviewViewProps {
  onQuickAddAgency: () => void;
  onQuickAddPlan: () => void;
  onQuickSendNotification: () => void;
  onQuickViewDuePayments: () => void;
}

export function OverviewView({
  onQuickAddAgency,
  onQuickAddPlan,
  onQuickSendNotification,
  onQuickViewDuePayments,
}: OverviewViewProps) {
  const { agencies, subscriptions, payments, activities, settings, lang, t, setActiveNav, setSelectedAgencyId } =
    useIbonda();

  const stats = useMemo(() => {
    const totalAgencies = agencies.length;
    const activeAgencies = agencies.filter((a) => a.status === 'active').length;
    const trialAgencies = agencies.filter((a) => a.status === 'free_trial').length;
    const expiredAgencies = agencies.filter((a) => a.status === 'expired').length;
    const trialRejectedAgencies = agencies.filter((a) => a.status === 'trial_rejected').length;
    const pendingPaymentAgencies = agencies.filter((a) => a.status === 'pending_payment').length;

    const currentMonthPrefix = REFERENCE_TODAY.slice(0, 7);
    const paidPayments = payments.filter((p) => p.status === 'paid');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const monthlyRevenue = paidPayments
      .filter((p) => (p.paymentDate || p.createdAt).startsWith(currentMonthPrefix))
      .reduce((sum, p) => sum + p.amount, 0);
    const duePaymentsAmount = payments
      .filter((p) => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    const activeRate = totalAgencies > 0 ? Math.round((activeAgencies / totalAgencies) * 100) : 0;

    return {
      totalAgencies,
      activeAgencies,
      trialAgencies,
      expiredAgencies,
      trialRejectedAgencies,
      pendingPaymentAgencies,
      totalRevenue,
      monthlyRevenue,
      duePaymentsAmount,
      activeRate,
    };
  }, [agencies, payments]);

  const months = useMemo(() => ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'], []);

  const agencyGrowthData = useMemo(
    () =>
      months.map((ym) => ({
        label: ym.slice(5),
        value: agencies.filter((a) => a.createdAt.slice(0, 7) <= ym).length,
      })),
    [agencies, months]
  );

  const monthlyRevenueData = useMemo(
    () =>
      months.map((ym) => ({
        label: ym.slice(5),
        value: payments
          .filter((p) => p.status === 'paid' && (p.paymentDate || p.createdAt).slice(0, 7) === ym)
          .reduce((sum, p) => sum + p.amount, 0),
      })),
    [payments, months]
  );

  const trialsVsPaidData = useMemo(
    () =>
      months.map((ym) => {
        const inMonth = subscriptions.filter((s) => s.createdAt.slice(0, 7) <= ym);
        return {
          label: ym.slice(5),
          value: inMonth.filter((s) => s.isTrial || s.status === 'free_trial').length,
          secondaryValue: inMonth.filter((s) => !s.isTrial && s.status === 'active').length,
        };
      }),
    [subscriptions, months]
  );

  const statusDistribution = useMemo(
    () => [
      {
        label: t.agencyStatus.active,
        value: agencies.filter((a) => a.status === 'active').length,
        color: '#15803D',
      },
      {
        label: t.agencyStatus.free_trial,
        value: agencies.filter((a) => a.status === 'free_trial').length,
        color: '#053332',
      },
      {
        label: t.agencyStatus.pending_payment,
        value: agencies.filter((a) => a.status === 'pending_payment').length,
        color: '#DF4416',
      },
      {
        label: t.agencyStatus.expired,
        value: agencies.filter((a) => a.status === 'expired').length,
        color: '#B91C1C',
      },
      {
        label: t.agencyStatus.suspended,
        value: agencies.filter((a) => a.status === 'suspended').length,
        color: '#4B5563',
      },
      {
        label: t.agencyStatus.cancelled,
        value: agencies.filter((a) => a.status === 'cancelled').length,
        color: '#991B1B',
      },
      {
        label: t.agencyStatus.trial_rejected,
        value: agencies.filter((a) => a.status === 'trial_rejected').length,
        color: '#B45309',
      },
    ],
    [agencies, t]
  );

  const statCards: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    tone: StatTone;
    helper?: string;
  }[] = [
    {
      label: t.overview.totalAgencies,
      value: formatNumber(stats.totalAgencies, lang),
      icon: Building2,
      tone: 'navy',
    },
    {
      label: t.overview.activeAgencies,
      value: formatNumber(stats.activeAgencies, lang),
      icon: CheckCircle2,
      tone: 'success',
      helper: `${stats.activeRate}%`,
    },
    {
      label: t.overview.trialAgencies,
      value: formatNumber(stats.trialAgencies, lang),
      icon: Sparkles,
      tone: 'orange',
    },
    {
      label: t.overview.expiredAgencies,
      value: formatNumber(stats.expiredAgencies, lang),
      icon: AlertCircle,
      tone: 'danger',
    },
    {
      label: t.agencyStatus.trial_rejected,
      value: formatNumber(stats.trialRejectedAgencies, lang),
      icon: AlertCircle,
      tone: 'warning',
    },
    {
      label: t.overview.pendingPaymentAgencies,
      value: formatNumber(stats.pendingPaymentAgencies, lang),
      icon: Clock,
      tone: 'warning',
    },
    {
      label: t.overview.totalRevenue,
      value: formatCurrency(stats.totalRevenue, settings.currency, lang),
      icon: Wallet,
      tone: 'success',
    },
    {
      label: t.overview.monthlyRevenue,
      value: formatCurrency(stats.monthlyRevenue, settings.currency, lang),
      icon: TrendingUp,
      tone: 'success',
    },
    {
      label: t.overview.duePayments,
      value: formatCurrency(stats.duePaymentsAmount, settings.currency, lang),
      icon: CreditCard,
      tone: 'danger',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.overview.title}
        subtitle={t.overview.subtitle}
        actions={
          <>
            <button
              type="button"
              onClick={onQuickAddAgency}
              className="ibonda-btn-primary shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              {t.overview.addAgency}
            </button>
            <button
              type="button"
              onClick={onQuickAddPlan}
              className="ibonda-btn-secondary shrink-0"
            >
              <Layers className="h-3.5 w-3.5 text-[#053332]" />
              {t.overview.addPlan}
            </button>
            <button
              type="button"
              onClick={onQuickSendNotification}
              className="ibonda-btn-secondary shrink-0"
            >
              <Bell className="h-3.5 w-3.5 text-[#DF4416]" />
              {t.overview.sendNotification}
            </button>
            <button
              type="button"
              onClick={onQuickViewDuePayments}
              className="ibonda-btn-secondary shrink-0"
            >
              <CreditCard className="h-3.5 w-3.5 text-[#053332]" />
              {t.overview.viewDuePayments}
            </button>
          </>
        }
      />

      {/* 8 Full-Color Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            tone={card.tone}
            helper={card.helper}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-[#053332] bg-[#EDF7F2] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#053332]/25 bg-gradient-to-r from-[#B7DEC9] to-[#6AB894] flex items-center justify-between px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.overview.chartAgencyGrowth}</h2>
            <span className="h-2.5 w-2.5 rounded-full bg-[#053332]" aria-hidden="true" />
          </div>
          <div className="p-5 bg-white">
            <SimpleBarChart data={agencyGrowthData} primaryColor="#053332" />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#15803D] bg-[#EAFDF1] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#15803D]/25 bg-gradient-to-r from-[#86EFAC] to-[#22C55E] flex items-center justify-between px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.overview.chartMonthlyRevenue}</h2>
            <span className="h-2.5 w-2.5 rounded-full bg-[#0F5132]" aria-hidden="true" />
          </div>
          <div className="p-5 bg-white">
            <SmoothAreaChart
              data={monthlyRevenueData}
              valueFormatter={(v) => formatCurrency(v, settings.currency, lang)}
              primaryColor="#15803D"
            />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#B8320D] bg-[#FFF4EB] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#B8320D]/25 bg-gradient-to-r from-[#FDBA74] to-[#F97316] flex items-center justify-between px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.overview.chartStatusDist}</h2>
            <span className="h-2.5 w-2.5 rounded-full bg-[#9A2D0C]" aria-hidden="true" />
          </div>
          <div className="p-5 bg-white">
            <HorizontalDistributionList items={statusDistribution} />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#B45309] bg-[#FFFBEB] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#B45309]/25 bg-gradient-to-r from-[#FDE047] to-[#F59E0B] flex items-center justify-between px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.overview.chartTrialsVsPaid}</h2>
            <span className="h-2.5 w-2.5 rounded-full bg-[#78350F]" aria-hidden="true" />
          </div>
          <div className="p-5 bg-white">
            <GroupedComparisonChart
              data={trialsVsPaidData}
              primaryColor="#DF4416"
              secondaryColor="#15803D"
              primaryLabel={t.overview.trialsLabel}
              secondaryLabel={t.overview.paidLabel}
            />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="ibonda-table-wrap">
        <div className="ibonda-card-header flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#053332] text-[#FF6B42]">
              <Activity className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm font-black text-[#000000]">{t.overview.recentActivities}</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveNav('agencies')}
            className="ibonda-btn-secondary py-1 px-2.5"
          >
            <span>{t.nav.agencies}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#DF4416]" />
          </button>
        </div>

        <div className="divide-y divide-[#DDE8E7]">
          {activities.slice(0, 7).map((act) => {
            const agency = act.agencyId ? agencies.find((a) => a.id === act.agencyId) : null;
            return (
              <div
                key={act.id}
                className="ibonda-table-row flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#B8C5C3] bg-[#E6ECEB] text-[#000000]">
                    <Building2 className="h-4 w-4 text-[#053332]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#000000] truncate">
                      {getLocalized(act.message, lang)}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-[#111827]">
                      <span>{getLocalized(act.actor, lang)}</span>
                      {agency && (
                        <>
                          <span aria-hidden="true">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAgencyId(agency.id);
                              setActiveNav('agencies');
                            }}
                            className="font-extrabold text-[#DF4416] hover:text-[#000000] hover:underline"
                          >
                            {getLocalized(agency.name, lang)}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className="rounded-md border border-[#BAC7C5] bg-[#EFF3F2] px-2 py-0.5 font-mono text-[11px] font-bold text-[#000000] tabular-nums shrink-0">
                  {act.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
