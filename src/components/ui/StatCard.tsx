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
    accent: string;
  }
> = {
  navy: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#EAF0EF] text-[#174B49]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#EAF0EF] text-[#174B49]', accent: 'bg-[#174B49]' },
  blue: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#EAF0F6] text-[#315B78]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#EAF0F6] text-[#315B78]', accent: 'bg-[#315B78]' },
  teal: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#E8F3F0] text-[#176B60]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#E8F3F0] text-[#176B60]', accent: 'bg-[#176B60]' },
  orange: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#F6F0E8] text-[#8B6232]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#F6F0E8] text-[#8B6232]', accent: 'bg-[#A47A45]' },
  success: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#E8F3EE] text-[#24734F]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#E8F3EE] text-[#24734F]', accent: 'bg-[#24734F]' },
  warning: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#F7F1E5] text-[#8A672A]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#F7F1E5] text-[#8A672A]', accent: 'bg-[#A47A45]' },
  danger: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#F6ECEA] text-[#9A5148]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#F6ECEA] text-[#9A5148]', accent: 'bg-[#A65B51]' },
  info: { cardStyle: 'border-[#E1E9E7] bg-white', iconWrap: 'bg-[#EAF0F6] text-[#315B78]', labelColor: 'text-[#334A48]', valueColor: 'text-[#102F2E]', helperBadge: 'bg-[#EAF0F6] text-[#315B78]', accent: 'bg-[#315B78]' },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div
      className={`group relative min-h-[142px] overflow-hidden rounded-[22px] border p-4 sm:p-5 shadow-[0_5px_18px_rgba(16,47,46,0.055)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,47,46,0.10)] ${style.cardStyle}`}
    >
      <div className={`absolute inset-x-5 top-0 h-[3px] rounded-b-full opacity-80 ${style.accent}`} />
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[13px] font-semibold leading-6 ${style.labelColor}`}>{label}</p>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.iconWrap}`}
        >
          <Icon className="h-[19px] w-[19px]" />
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-2">
        <p className={`text-[30px] font-bold tracking-[-0.04em] tabular-nums ${style.valueColor}`}>
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
