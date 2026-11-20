import React from 'react';

export type StatTone =
  | 'navy'
  | 'blue'
  | 'teal'
  | 'orange'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: StatTone;
  helper?: string;
}

const TONE_MAP: Record<
  StatTone,
  {
    cardStyle: string;
    iconWrap: string;
    labelColor: string;
    valueColor: string;
    helperBadge: string;
  }
> = {
  navy: {
    cardStyle: 'border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white hover:border-slate-300',
    iconWrap: 'bg-slate-100 text-slate-700',
    labelColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-slate-100 text-slate-700',
  },
  blue: {
    cardStyle: 'border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:border-blue-200',
    iconWrap: 'bg-blue-100 text-blue-700',
    labelColor: 'text-blue-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-blue-100 text-blue-700',
  },
  teal: {
    cardStyle: 'border border-teal-100 bg-gradient-to-br from-teal-50 to-white hover:border-teal-200',
    iconWrap: 'bg-teal-100 text-teal-700',
    labelColor: 'text-teal-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-teal-100 text-teal-700',
  },
  orange: {
    cardStyle: 'border border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:border-orange-200',
    iconWrap: 'bg-orange-100 text-orange-700',
    labelColor: 'text-orange-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-orange-100 text-orange-700',
  },
  success: {
    cardStyle: 'border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-200',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    labelColor: 'text-emerald-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-emerald-100 text-emerald-700',
  },
  warning: {
    cardStyle: 'border border-amber-100 bg-gradient-to-br from-amber-50 to-white hover:border-amber-200',
    iconWrap: 'bg-amber-100 text-amber-700',
    labelColor: 'text-amber-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-amber-100 text-amber-700',
  },
  danger: {
    cardStyle: 'border border-rose-100 bg-gradient-to-br from-rose-50 to-white hover:border-rose-200',
    iconWrap: 'bg-rose-100 text-rose-700',
    labelColor: 'text-rose-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-rose-100 text-rose-700',
  },
  info: {
    cardStyle: 'border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white hover:border-cyan-200',
    iconWrap: 'bg-cyan-100 text-cyan-700',
    labelColor: 'text-cyan-800',
    valueColor: 'text-slate-900',
    helperBadge: 'bg-cyan-100 text-cyan-700',
  },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,23,42,0.045)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] ${style.cardStyle}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-xs font-bold leading-snug ${style.labelColor}`}>{label}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconWrap}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <p className={`text-2xl font-extrabold tracking-tight tabular-nums ${style.valueColor}`}>
          {value}
        </p>
        {helper && (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold tabular-nums ${style.helperBadge}`}
          >
            {helper}
          </span>
        )}
      </div>
    </div>
  );
}
