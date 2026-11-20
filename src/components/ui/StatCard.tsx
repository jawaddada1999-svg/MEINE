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
    cardStyle:
      'border-2 border-[#053332] bg-gradient-to-br from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C] hover:border-[#021E1D]',
    iconWrap: 'bg-[#053332] text-[#FF6B42] ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#053332] text-white',
  },
  teal: {
    cardStyle:
      'border-2 border-[#15803D] bg-gradient-to-br from-[#86EFAC] via-[#4ADE80] to-[#22C55E] hover:border-[#0F5132]',
    iconWrap: 'bg-[#0F5132] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#0F5132] text-white',
  },
  orange: {
    cardStyle:
      'border-2 border-[#B8320D] bg-gradient-to-br from-[#FDBA74] via-[#FB923C] to-[#F97316] hover:border-[#7C2D12]',
    iconWrap: 'bg-[#9A2D0C] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#7C2D12] text-white',
  },
  blue: {
    cardStyle:
      'border-2 border-[#053332] bg-gradient-to-br from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C] hover:border-[#021E1D]',
    iconWrap: 'bg-[#053332] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#053332] text-white',
  },
  success: {
    cardStyle:
      'border-2 border-[#15803D] bg-gradient-to-br from-[#86EFAC] via-[#4ADE80] to-[#22C55E] hover:border-[#0F5132]',
    iconWrap: 'bg-[#0F5132] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#0F5132] text-white',
  },
  warning: {
    cardStyle:
      'border-2 border-[#B45309] bg-gradient-to-br from-[#FDE047] via-[#FBBF24] to-[#F59E0B] hover:border-[#78350F]',
    iconWrap: 'bg-[#78350F] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#78350F] text-white',
  },
  danger: {
    cardStyle:
      'border-2 border-[#B91C1C] bg-gradient-to-br from-[#FDB4B4] via-[#FA8080] to-[#F05252] hover:border-[#7F1D1D]',
    iconWrap: 'bg-[#7F1D1D] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#7F1D1D] text-white',
  },
  info: {
    cardStyle:
      'border-2 border-[#053332] bg-gradient-to-br from-[#B7DEC9] via-[#8AC9AA] to-[#5FB38C] hover:border-[#021E1D]',
    iconWrap: 'bg-[#053332] text-white ring-4 ring-white/90',
    labelColor: 'text-[#000000]',
    valueColor: 'text-[#000000]',
    helperBadge: 'bg-[#053332] text-white',
  },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div
      className={`rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.14)] ${style.cardStyle}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-xs font-extrabold leading-snug ${style.labelColor}`}>{label}</p>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm ${style.iconWrap}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className={`text-2xl font-black tracking-tight tabular-nums ${style.valueColor}`}>
          {value}
        </p>
        {helper && (
          <span
            className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums shadow-xs ${style.helperBadge}`}
          >
            {helper}
          </span>
        )}
      </div>
    </div>
  );
}
