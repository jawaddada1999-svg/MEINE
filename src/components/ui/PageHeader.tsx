import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#BAC7C5] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span
            className="h-7 w-1.5 rounded-full bg-[#DF4416]"
            aria-hidden="true"
          />
          <h1 className="text-[24px] font-black tracking-tight text-[#000000] leading-snug">
            {title}
          </h1>
        </div>
        <p className="mt-1 text-sm font-bold text-[#111827] leading-relaxed">{subtitle}</p>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
