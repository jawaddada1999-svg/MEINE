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
  navy: { iconWrap: 'bg-[#E8ECF8] text-[#263B78]', accent: '#263B78', surface: '#F4F6FC', value: '#172554' },
  blue: { iconWrap: 'bg-[#E8EDFF] text-[#4358B8]', accent: '#5269D8', surface: '#F3F5FF', value: '#263B78' },
  teal: { iconWrap: 'bg-[#DDF3EF] text-[#0F766E]', accent: '#159A91', surface: '#F0FAF8', value: '#115E59' },
  orange: { iconWrap: 'bg-[#F8E8C9] text-[#A66A16]', accent: '#D69A32', surface: '#FFFAF0', value: '#8A5A16' },
  success: { iconWrap: 'bg-[#DDF3EF] text-[#0F766E]', accent: '#159A91', surface: '#F0FAF8', value: '#115E59' },
  warning: { iconWrap: 'bg-[#F8E8C9] text-[#A66A16]', accent: '#D69A32', surface: '#FFFAF0', value: '#8A5A16' },
  danger: { iconWrap: 'bg-[#FCE8EC] text-[#B83250]', accent: '#D45B73', surface: '#FFF5F6', value: '#9F2944' },
  info: { iconWrap: 'bg-[#E8EDFF] text-[#4358B8]', accent: '#5269D8', surface: '#F3F5FF', value: '#263B78' },
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
