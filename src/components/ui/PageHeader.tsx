import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#E6EAF1] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8]" aria-hidden="true" />
          <h1 className="text-[25px] font-bold tracking-[-0.035em] text-[#172033] leading-tight sm:text-[28px]">
            {title}
          </h1>
        </div>
        <p className="mt-2 ms-4 text-[13px] font-medium leading-relaxed text-[#718096]">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
