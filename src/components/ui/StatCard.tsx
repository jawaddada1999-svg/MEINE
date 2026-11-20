import React from 'react';

export type StatTone = 'navy' | 'blue' | 'teal' | 'orange' | 'success' | 'warning' | 'danger' | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: StatTone;
  helper?: string;
}

const TONE_MAP: Record<StatTone, { iconWrap: string; accent: string; surface: string; value: string }> = {
  navy: { iconWrap: 'bg-indigo-100 text-indigo-700', accent: '#6366F1', surface: '#F2F3FF', value: '#312E81' },
  blue: { iconWrap: 'bg-blue-100 text-blue-700', accent: '#3B82F6', surface: '#EFF6FF', value: '#1E40AF' },
  teal: { iconWrap: 'bg-teal-100 text-teal-700', accent: '#14B8A6', surface: '#F0FDFA', value: '#115E59' },
  orange: { iconWrap: 'bg-orange-100 text-orange-700', accent: '#F97316', surface: '#FFF7ED', value: '#9A3412' },
  success: { iconWrap: 'bg-emerald-100 text-emerald-700', accent: '#10B981', surface: '#ECFDF5', value: '#065F46' },
  warning: { iconWrap: 'bg-amber-100 text-amber-700', accent: '#F59E0B', surface: '#FFFBEB', value: '#92400E' },
  danger: { iconWrap: 'bg-rose-100 text-rose-700', accent: '#F43F5E', surface: '#FFF1F2', value: '#9F1239' },
  info: { iconWrap: 'bg-sky-100 text-sky-700', accent: '#0EA5E9', surface: '#F0F9FF', value: '#075985' },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      style={{ backgroundColor: style.surface, borderColor: style.accent + '35' }}
    >
      <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: style.accent }} />
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-xs font-bold leading-relaxed text-slate-600">{label}</p>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconWrap}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="min-w-0 break-words text-2xl font-extrabold leading-tight tracking-tight tabular-nums sm:text-[29px]" style={{ color: style.value }}>{value}</p>
        {helper && <span className="shrink-0 rounded-lg bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-600 tabular-nums">{helper}</span>}
      </div>
    </div>
  );
}
