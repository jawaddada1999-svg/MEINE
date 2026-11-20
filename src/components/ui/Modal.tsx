import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-2xl',
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#053332]/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidthClass} max-h-[90vh] flex flex-col overflow-hidden rounded-xl border-2 border-[#A7BCBA] bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#C6D1CF] bg-[#EFF3F2] px-6 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-[#000000]">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs font-bold text-[#111827]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-transparent p-1.5 text-[#000000] transition-colors hover:border-[#053332] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF4416]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 text-[#000000]">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#C6D1CF] bg-[#F6F8F7] px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
