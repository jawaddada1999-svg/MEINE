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
    cardStyle: 'border-[#9FB7EE] bg-[#C6D7FF]',
    iconWrap: 'bg-[#A9C2F5] text-[#263E78]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#A9C2F5] text-[#263E78]',
    accent: 'bg-[#365FC2]',
  },
  blue: {
    cardStyle: 'border-[#83C7F4] bg-[#A9DEFF]',
    iconWrap: 'bg-[#82C8F5] text-[#124E7C]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#82C8F5] text-[#124E7C]',
    accent: 'bg-[#1676B8]',
  },
  teal: {
    cardStyle: 'border-[#65CDB8] bg-[#91E4D1]',
    iconWrap: 'bg-[#65D2BC] text-[#075B50]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#65D2BC] text-[#075B50]',
    accent: 'bg-[#0D8B79]',
  },
  orange: {
    cardStyle: 'border-[#F2B36B] bg-[#FFC987]',
    iconWrap: 'bg-[#F5B66F] text-[#75400C]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#F5B66F] text-[#75400C]',
    accent: 'bg-[#C66A18]',
  },
  success: {
    cardStyle: 'border-[#78CE91] bg-[#A9E8B8]',
    iconWrap: 'bg-[#82D79B] text-[#155A2D]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#82D79B] text-[#155A2D]',
    accent: 'bg-[#258344]',
  },
  warning: {
    cardStyle: 'border-[#E7C34E] bg-[#FFE27A]',
    iconWrap: 'bg-[#F4D45C] text-[#654B00]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#F4D45C] text-[#654B00]',
    accent: 'bg-[#B88A08]',
  },
  danger: {
    cardStyle: 'border-[#EA9298] bg-[#FFB4B8]',
    iconWrap: 'bg-[#F29CA2] text-[#7A202B]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#F29CA2] text-[#7A202B]',
    accent: 'bg-[#C53F4B]',
  },
  info: {
    cardStyle: 'border-[#B49AEF] bg-[#D0BEFF]',
    iconWrap: 'bg-[#B9A2F2] text-[#4A2C91]',
    labelColor: 'text-black',
    valueColor: 'text-black',
    helperBadge: 'bg-[#B9A2F2] text-[#4A2C91]',
    accent: 'bg-[#7652C7]',
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
