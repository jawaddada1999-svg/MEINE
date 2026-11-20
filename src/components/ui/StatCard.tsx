import React from 'react';

export type StatTone = 'navy' | 'blue' | 'teal' | 'orange' | 'success' | 'warning' | 'danger' | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: StatTone;
  helper?: string;
}

const TONE_MAP: Record<StatTone, { iconWrap: string; accent: string }> = {
  navy: { iconWrap: 'bg-[#EEF2FF] text-[#3730A3]', accent: 'bg-[#6366F1]' },
  blue: { iconWrap: 'bg-[#EFF6FF] text-[#2563EB]', accent: 'bg-[#3B82F6]' },
  teal: { iconWrap: 'bg-[#ECFDF5] text-[#059669]', accent: 'bg-[#10B981]' },
  orange: { iconWrap: 'bg-[#FFF7ED] text-[#EA580C]', accent: 'bg-[#F97316]' },
  success: { iconWrap: 'bg-[#ECFDF5] text-[#059669]', accent: 'bg-[#10B981]' },
  warning: { iconWrap: 'bg-[#FFFBEB] text-[#D97706]', accent: 'bg-[#F59E0B]' },
  danger: { iconWrap: 'bg-[#FEF2F2] text-[#DC2626]', accent: 'bg-[#EF4444]' },
  info: { iconWrap: 'bg-[#F0F9FF] text-[#0284C7]', accent: 'bg-[#0EA5E9]' },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E6EAF1] bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5DEEC] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <span className={`absolute inset-x-0 top-0 h-[3px] ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold leading-relaxed text-[#64748B]">{label}</p>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconWrap}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-[29px] font-bold leading-none tracking-[-0.045em] text-[#172033] tabular-nums">{value}</p>
        {helper && <span className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-bold text-[#64748B] tabular-nums">{helper}</span>}
      </div>
    </div>
  );
}
