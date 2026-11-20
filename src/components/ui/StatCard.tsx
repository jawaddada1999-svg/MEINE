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
  navy: {
    cardStyle: 'border-[#BFCDE8] bg-[#E0E8F8]',
    iconWrap: 'bg-[#C8D6F0] text-[#294A83]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#C8D6F0] text-[#294A83]',
    accent: 'bg-[#4569A8]',
  },
  blue: {
    cardStyle: 'border-[#B9D5EE] bg-[#DDECFB]',
    iconWrap: 'bg-[#C4DDF5] text-[#245B8C]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#C4DDF5] text-[#245B8C]',
    accent: 'bg-[#347BB5]',
  },
  teal: {
    cardStyle: 'border-[#B4DED6] bg-[#D9F1EC]',
    iconWrap: 'bg-[#BFE5DC] text-[#17675D]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#BFE5DC] text-[#17675D]',
    accent: 'bg-[#238779]',
  },
  orange: {
    cardStyle: 'border-[#F0D0A9] bg-[#FBE9D5]',
    iconWrap: 'bg-[#F5D6B2] text-[#92551F]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#F5D6B2] text-[#92551F]',
    accent: 'bg-[#C27A35]',
  },
  success: {
    cardStyle: 'border-[#B9DEC7] bg-[#DDF1E3]',
    iconWrap: 'bg-[#C3E6CE] text-[#236A43]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#C3E6CE] text-[#236A43]',
    accent: 'bg-[#328653]',
  },
  warning: {
    cardStyle: 'border-[#EAD49A] bg-[#F9EDC9]',
    iconWrap: 'bg-[#F1DFA9] text-[#80601B]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#F1DFA9] text-[#80601B]',
    accent: 'bg-[#B58A2E]',
  },
  danger: {
    cardStyle: 'border-[#E9BFC1] bg-[#F7E0E2]',
    iconWrap: 'bg-[#EFC8CB] text-[#963E48]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#EFC8CB] text-[#963E48]',
    accent: 'bg-[#B94F5A]',
  },
  info: {
    cardStyle: 'border-[#C3D1F0] bg-[#E4EAF9]',
    iconWrap: 'bg-[#CFDAF3] text-[#435D9B]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#CFDAF3] text-[#435D9B]',
    accent: 'bg-[#607DBB]',
  },
};

export function StatCard({ label, value, icon: Icon, tone = 'navy', helper }: StatCardProps) {
  const style = TONE_MAP[tone];

  return (
    <div
      className={`group relative min-h-[148px] overflow-hidden rounded-[22px] border p-4 sm:p-5 shadow-[0_6px_18px_rgba(25,45,80,0.075)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_13px_28px_rgba(25,45,80,0.13)] ${style.cardStyle}`}
    >
      <div className={`absolute inset-x-5 top-0 h-[3px] rounded-b-full opacity-80 ${style.accent}`} />
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[14px] font-bold leading-6 ${style.labelColor}`}>{label}</p>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.iconWrap}`}
        >
          <Icon className="h-[19px] w-[19px]" />
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-2">
        <p className={`text-[32px] font-extrabold tracking-[-0.045em] tabular-nums ${style.valueColor}`}>
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
