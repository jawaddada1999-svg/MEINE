import React from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';

export function ToastContainer() {
  const { toasts, dismissToast, t } = useIbonda();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 end-4 z-[60] flex max-w-sm flex-col gap-2 no-print">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D]" />
          ) : toast.type === 'error' ? (
            <XCircle className="h-4 w-4 shrink-0 text-[#B91C1C]" />
          ) : (
            <Info className="h-4 w-4 shrink-0 text-[#DF4416]" />
          );

        return (
          <div
            key={toast.id}
            className="flex items-start gap-2.5 rounded-xl border-2 border-[#053332] bg-white px-4 py-3 text-xs font-bold text-[#000000] shadow-xl"
          >
            {icon}
            <span className="flex-1 leading-relaxed">{toast.text}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded p-0.5 text-[#111827] hover:bg-[#EFF3F2] hover:text-[#000000]"
              aria-label={t.common.close}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
