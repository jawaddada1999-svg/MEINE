import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { useIbonda } from '../../store/IbondaStore';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  variant = 'danger',
}: ConfirmModalProps) {
  const { t } = useIbonda();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidthClass="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="ibonda-btn-secondary whitespace-nowrap"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors whitespace-nowrap ${
              variant === 'danger'
                ? 'bg-[#DC4545] hover:bg-red-700'
                : 'bg-[#DF4416] hover:bg-[#BD320A]'
            }`}
          >
            {confirmLabel || t.common.confirm}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
            variant === 'danger'
              ? 'border-red-300 bg-red-100 text-[#B91C1C]'
              : 'border-[#FDBA74] bg-[#FFEDD5] text-[#DF4416]'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold leading-relaxed text-[#000000]">{message}</p>
      </div>
    </Modal>
  );
}
