import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';

interface TablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const { t, lang } = useIbonda();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(totalItems, safePage * pageSize);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 border-t border-[#C6D1CF] bg-[#EFF3F2] px-4 py-3 text-xs text-[#000000] sm:flex-row sm:items-center sm:justify-between">
      <div className="tabular-nums font-bold">
        {t.common.showing}{' '}
        <span className="font-black text-[#000000]">
          {startIdx}–{endIdx}
        </span>{' '}
        {t.common.of}{' '}
        <span className="font-black text-[#DF4416]">{totalItems}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="inline-flex items-center gap-1 rounded-lg border-2 border-[#BAC7C5] bg-white px-2.5 py-1.5 text-xs font-bold text-[#000000] shadow-xs transition-colors hover:border-[#053332] hover:bg-[#EAF1EF] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap"
        >
          {lang === 'ar' ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          {t.common.previous}
        </button>

        <span className="rounded-md bg-[#053332] px-2.5 py-1 font-mono text-xs font-bold text-white tabular-nums shadow-xs">
          {safePage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="inline-flex items-center gap-1 rounded-lg border-2 border-[#BAC7C5] bg-white px-2.5 py-1.5 text-xs font-bold text-[#000000] shadow-xs transition-colors hover:border-[#053332] hover:bg-[#EAF1EF] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap"
        >
          {t.common.next}
          {lang === 'ar' ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
