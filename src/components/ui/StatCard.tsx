import React from 'react';

export type StatTone = 'navy' | 'blue' | 'teal' | 'orange' | 'success' | 'warning' | 'danger' | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: StatTone;
  helper?: string;
}

const TONE_MAP: Record<StatTone, { iconWrap: string; accent: string; surface: string }> = {
  navy: { iconWrap: 'bg-[#E8EDFF] text-[#3730A3]', accent: 'bg-[#6366F1]', surface: 'from-[#F3F5FF] to-white' },
  blue: { iconWrap: 'bg-[#E5F0FF] text-[#2563EB]', accent: 'bg-[#3B82F6]', surface: 'from-[#EFF6FF] to-white' },
  teal: { iconWrap: 'bg-[#DDF8EF] text-[#059669]', accent: 'bg-[#10B981]', surface: 'from-[#ECFDF5] to-white' },
  orange: { iconWrap: 'bg-[#FFEDD8] text-[#EA580C]', accent: 'bg-[#F97316]', surface: 'from-[#FFF7ED] to-white' },
  success: { iconWrap: 'bg-[#DDF8EF] text-[#059669]', accent: 'bg-[#10B981]', surface: 'from-[#ECFDF5] to-white' },
  warning: { iconWrap: 'bg-[#FFF3CF] text-[#D97706]', accent: 'bg-[#F59E0B]', surface: 'from-[#FFFBEB] to-white' },
  danger: { iconWrap: 'bg-[#FFE7E7] text-[#DC2626]', accent: 'bg-[#EF4444]', surface: 'from-[#FEF2F2] to-white' },
  info: { iconWrap: 'bg-[#DFF4FF] text-[#0284C7]', accent: 'bg-[#0EA5E9]', surface: 'from-[#F0F9FF] to-white' },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div className={`group relative overflow-hidden rounded-[20px] border border-white bg-gradient-to-br ${style.surface} p-5 shadow-[0_4px_18px_rgba(15,23,42,0.055)] ring-1 ring-[#E7ECF4] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.09)]`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${style.accent} opacity-90 transition-opacity duration-300`} />
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
