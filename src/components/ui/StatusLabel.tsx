import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PauseCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';

export type SemanticTone = 'green' | 'blue' | 'teal' | 'amber' | 'red' | 'slate' | 'navy';

interface StatusLabelProps {
  tone: SemanticTone;
  label: string;
  icon?: 'check' | 'clock' | 'pause' | 'alert' | 'x' | 'refund';
}

const BADGE_CLASSES: Record<SemanticTone, string> = {
  green: 'bg-[#BBF7D0] text-[#000000] border-[#15803D]',
  blue: 'bg-[#FED7AA] text-[#000000] border-[#C2410C]',
  teal: 'bg-[#D1E7DF] text-[#000000] border-[#053332]',
  amber: 'bg-[#FDE68A] text-[#000000] border-[#B45309]',
  red: 'bg-[#FECACA] text-[#000000] border-[#B91C1C]',
  slate: 'bg-[#E2E8F0] text-[#000000] border-[#64748B]',
  navy: 'bg-[#DFE8E6] text-[#000000] border-[#053332]',
};

export function StatusLabel({ tone, label, icon }: StatusLabelProps) {
  const renderIcon = () => {
    const cls = 'h-3 w-3 shrink-0';
    switch (icon) {
      case 'check':
        return <CheckCircle2 className={cls} />;
      case 'clock':
        return <Clock className={cls} />;
      case 'pause':
        return <PauseCircle className={cls} />;
      case 'alert':
        return <AlertCircle className={cls} />;
      case 'x':
        return <XCircle className={cls} />;
      case 'refund':
        return <RotateCcw className={cls} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-bold shadow-[0_1px_1px_rgba(5,51,50,0.04)] whitespace-nowrap ${BADGE_CLASSES[tone]}`}
    >
      {renderIcon()}
      <span>{label}</span>
    </span>
  );
}

export function agencyStatusTone(status: string): { tone: SemanticTone; icon: StatusLabelProps['icon'] } {
  switch (status) {
    case 'active':
      return { tone: 'green', icon: 'check' };
    case 'free_trial':
      return { tone: 'teal', icon: 'clock' };
    case 'pending_payment':
      return { tone: 'amber', icon: 'clock' };
    case 'expired':
      return { tone: 'red', icon: 'alert' };
    case 'suspended':
      return { tone: 'slate', icon: 'pause' };
    case 'cancelled':
      return { tone: 'red', icon: 'x' };
    default:
      return { tone: 'slate', icon: 'clock' };
  }
}

export function paymentStatusTone(status: string): { tone: SemanticTone; icon: StatusLabelProps['icon'] } {
  switch (status) {
    case 'paid':
      return { tone: 'green', icon: 'check' };
    case 'pending':
      return { tone: 'amber', icon: 'clock' };
    case 'overdue':
      return { tone: 'red', icon: 'alert' };
    case 'refunded':
      return { tone: 'slate', icon: 'refund' };
    default:
      return { tone: 'slate', icon: 'clock' };
  }
}
