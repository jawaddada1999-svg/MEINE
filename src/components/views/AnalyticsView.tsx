import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Download,
  Printer,
  RefreshCw,
  Repeat,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { REFERENCE_TODAY } from '../../data/seedData';
import {
  addDaysToIso,
  downloadCsvFile,
  formatCurrency,
  formatNumber,
  getLocalized,
} from '../../utils/formatters';
import {
  GroupedComparisonChart,
  HorizontalDistributionList,
  SimpleBarChart,
  SmoothAreaChart,
} from '../ui/SvgCharts';
import { PageHeader } from '../ui/PageHeader';
import { StatCard, StatTone } from '../ui/StatCard';

type DatePreset = '7d' | '30d' | '3m' | '6m' | '1y' | 'custom';

export function AnalyticsView() {
  const { agencies, subscriptions, plans, payments, settings, lang, t, notifyToast } = useIbonda();

  const [preset, setPreset] = useState<DatePreset>('6m');
  const [customFrom, setCustomFrom] = useState('2026-06-01');
  const [customTo, setCustomTo] = useState(REFERENCE_TODAY);

  const dateBounds = useMemo(() => {
    const to = preset === 'custom' ? customTo : REFERENCE_TODAY;
    let from = customFrom;
    if (preset === '7d') from = addDaysToIso(REFERENCE_TODAY, -7);
    else if (preset === '30d') from = addDaysToIso(REFERENCE_TODAY, -30);
    else if (preset === '3m') from = addDaysToIso(REFERENCE_TODAY, -90);
    else if (preset === '6m') from = addDaysToIso(REFERENCE_TODAY, -180);
    else if (preset === '1y') from = addDaysToIso(REFERENCE_TODAY, -365);
    return { from, to };
  }, [preset, customFrom, customTo]);

  const metrics = useMemo(() => {
    const totalAgencies = agencies.length;
    const newAgencies = agencies.filter(
      (a) => a.createdAt >= dateBounds.from && a.createdAt <= dateBounds.to
    ).length;
    const activeSubs = subscriptions.filter((s) => s.status === 'active').length;

    const trialsEver = subscriptions.filter((s) => s.isTrial || s.trialConverted).length;
    const convertedTrials = subscriptions.filter((s) => s.trialConverted).length;
    const trialConversionRate =
      trialsEver > 0 ? Math.round((convertedTrials / trialsEver) * 100) : 0;

    const cancelledCount = subscriptions.filter((s) => s.status === 'cancelled').length;
    const churnRate =
      subscriptions.length > 0 ? Math.round((cancelledCount / subscriptions.length) * 100) : 0;

    const renewedOrActive = subscriptions.filter(
      (s) => !s.isTrial && (s.status === 'active' || (s.history && s.history.length > 0))
    ).length;
    const renewalRate =
      subscriptions.length > 0 ? Math.round((renewedOrActive / subscriptions.length) * 100) : 0;

    const paidInRange = payments.filter(
      (p) =>
        p.status === 'paid' &&
        (p.paymentDate || p.createdAt) >= dateBounds.from &&
        (p.paymentDate || p.createdAt) <= dateBounds.to
    );
    const totalRevenue = paidInRange.reduce((sum, p) => sum + p.amount, 0);
    const arpa = totalAgencies > 0 ? Math.round(totalRevenue / totalAgencies) : 0;

    return {
      totalAgencies,
      newAgencies,
      activeSubs,
      trialConversionRate,
      churnRate,
      renewalRate,
      totalRevenue,
      arpa,
    };
  }, [agencies, subscriptions, payments, dateBounds]);

  const months = useMemo(() => ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'], []);

  const growthSeries = useMemo(
    () =>
      months.map((ym) => ({
        label: ym.slice(5),
        value: agencies.filter((a) => a.createdAt.slice(0, 7) <= ym).length,
      })),
    [agencies, months]
  );

  const revenueSeries = useMemo(
    () =>
      months.map((ym) => ({
        label: ym.slice(5),
        value: payments
          .filter((p) => p.status === 'paid' && (p.paymentDate || p.createdAt).slice(0, 7) === ym)
          .reduce((sum, p) => sum + p.amount, 0),
      })),
    [payments, months]
  );

  const subsByPlan = useMemo(() => {
    const palette = ['#053332', '#DF4416', '#15803D', '#0A4E4C', '#D97706'];
    return plans.map((plan, idx) => ({
      label: getLocalized(plan.name, lang),
      value: subscriptions.filter((s) => s.planId === plan.id).length,
      color: palette[idx % palette.length],
    }));
  }, [plans, subscriptions, lang]);

  const trialsVsPaidSeries = useMemo(
    () =>
      months.map((ym) => ({
        label: ym.slice(5),
        value: subscriptions.filter((s) => s.createdAt.slice(0, 7) <= ym && s.isTrial).length,
        secondaryValue: subscriptions.filter(
          (s) => s.createdAt.slice(0, 7) <= ym && !s.isTrial && s.status === 'active'
        ).length,
      })),
    [subscriptions, months]
  );

  const expiredVsRenewedSeries = useMemo(
    () =>
      months.map((ym) => ({
        label: ym.slice(5),
        value: subscriptions.filter((s) => s.endDate.slice(0, 7) === ym && s.status === 'expired').length,
        secondaryValue: subscriptions.filter(
          (s) => s.status === 'active' && s.startDate.slice(0, 7) <= ym && (s.history?.length || 0) > 0
        ).length,
      })),
    [subscriptions, months]
  );

  const handleExportCsv = () => {
    const headers = [
      t.agencies.colAgency,
      t.agencies.city,
      t.agencies.colPlan,
      t.agencies.colStatus,
      t.agencies.startDate,
      t.agencies.endDate,
      t.payments.colAmount,
    ];
    const rows = agencies.map((ag) => {
      const plan = plans.find((p) => p.id === ag.currentPlanId);
      const totalPaid = payments
        .filter((p) => p.agencyId === ag.id && p.status === 'paid')
        .reduce((s, p) => s + p.amount, 0);
      return [
        getLocalized(ag.name, lang),
        getLocalized(ag.city, lang),
        plan ? getLocalized(plan.name, lang) : '',
        t.agencyStatus[ag.status],
        ag.subscriptionStart,
        ag.subscriptionEnd,
        totalPaid,
      ];
    });
    downloadCsvFile(`ibonda-analytics-${REFERENCE_TODAY}.csv`, headers, rows);
    notifyToast('success', t.toasts.csvExported);
  };

  const kpiCards: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    tone: StatTone;
  }[] = [
    { label: t.analytics.totalAgencies, value: formatNumber(metrics.totalAgencies, lang), icon: Building2, tone: 'navy' },
    { label: t.analytics.newAgencies, value: formatNumber(metrics.newAgencies, lang), icon: Sparkles, tone: 'orange' },
    { label: t.analytics.activeSubs, value: formatNumber(metrics.activeSubs, lang), icon: CheckCircle2, tone: 'success' },
    { label: t.analytics.trialConversionRate, value: `${metrics.trialConversionRate}%`, icon: Repeat, tone: 'success' },
    { label: t.analytics.churnRate, value: `${metrics.churnRate}%`, icon: TrendingDown, tone: 'danger' },
    { label: t.analytics.renewalRate, value: `${metrics.renewalRate}%`, icon: RefreshCw, tone: 'success' },
    {
      label: t.analytics.totalRevenue,
      value: formatCurrency(metrics.totalRevenue, settings.currency, lang),
      icon: Wallet,
      tone: 'success',
    },
    { label: t.analytics.arpa, value: formatCurrency(metrics.arpa, settings.currency, lang), icon: TrendingUp, tone: 'warning' },
  ];

  const presets: { key: DatePreset; label: string }[] = [
    { key: '7d', label: t.analytics.range7d },
    { key: '30d', label: t.analytics.range30d },
    { key: '3m', label: t.analytics.range3m },
    { key: '6m', label: t.analytics.range6m },
    { key: '1y', label: t.analytics.range1y },
    { key: 'custom', label: t.analytics.rangeCustom },
  ];

  return (
    <div className="space-y-6 print-only-container">
      <PageHeader
        title={t.analytics.title}
        subtitle={t.analytics.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={agencies.length === 0}
              className="ibonda-btn-secondary disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5 text-[#053332]" />
              {t.common.exportCsv}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="ibonda-btn-primary"
            >
              <Printer className="h-3.5 w-3.5" />
              {t.common.printPdf}
            </button>
          </div>
        }
      />

      {/* Date Range Filters */}
      <div className="ibonda-filter-bar justify-between p-2.5 no-print">
        <div className="flex flex-wrap items-center gap-1">
          {presets.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                preset === p.key
                  ? 'bg-[#053332] text-white shadow-xs'
                  : 'text-[#000000] hover:bg-white/80 hover:text-[#DF4416]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preset === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#000000]">{t.analytics.from}</span>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="ibonda-input w-auto py-1.5 font-mono bg-white"
            />
            <span className="font-bold text-[#000000]">{t.analytics.to}</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="ibonda-input w-auto py-1.5 font-mono bg-white"
            />
          </div>
        )}
      </div>

      {/* 8 Full-Color StatCards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        ))}
      </div>

      {/* 5 Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-[#053332] bg-[#EDF7F2] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#053332]/25 bg-gradient-to-r from-[#B7DEC9] to-[#6AB894] px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.analytics.chartMonthlyGrowth}</h2>
          </div>
          <div className="p-5 bg-white">
            <SimpleBarChart data={growthSeries} primaryColor="#053332" />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#15803D] bg-[#EAFDF1] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#15803D]/25 bg-gradient-to-r from-[#86EFAC] to-[#22C55E] px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.analytics.chartRevenueTrend}</h2>
          </div>
          <div className="p-5 bg-white">
            <SmoothAreaChart
              data={revenueSeries}
              valueFormatter={(v) => formatCurrency(v, settings.currency, lang)}
              primaryColor="#15803D"
            />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#B8320D] bg-[#FFF4EB] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#B8320D]/25 bg-gradient-to-r from-[#FDBA74] to-[#F97316] px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.analytics.chartSubsByPlan}</h2>
          </div>
          <div className="p-5 bg-white">
            <HorizontalDistributionList items={subsByPlan} />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#B45309] bg-[#FFFBEB] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#B45309]/25 bg-gradient-to-r from-[#FDE047] to-[#F59E0B] px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.analytics.chartTrialsVsSubs}</h2>
          </div>
          <div className="p-5 bg-white">
            <GroupedComparisonChart
              data={trialsVsPaidSeries}
              primaryColor="#DF4416"
              secondaryColor="#15803D"
              primaryLabel={t.overview.trialsLabel}
              secondaryLabel={t.overview.paidLabel}
            />
          </div>
        </div>

        <div className="rounded-xl border-2 border-[#B91C1C] bg-[#FEF2F2] overflow-hidden shadow-[0_3px_12px_rgba(0,0,0,0.08)] lg:col-span-2">
          <div className="border-b border-[#B91C1C]/25 bg-gradient-to-r from-[#FCA5A5] via-[#FBBF24] to-[#4ADE80] px-5 py-3">
            <h2 className="text-sm font-black text-[#000000]">{t.analytics.chartExpiredVsRenewed}</h2>
          </div>
          <div className="p-5 bg-white">
            <GroupedComparisonChart
              data={expiredVsRenewedSeries}
              primaryColor="#B91C1C"
              secondaryColor="#15803D"
              primaryLabel={t.subscriptions.tabExpired}
              secondaryLabel={t.subscriptions.renewAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
