import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, MessageCircle, Phone, PhoneCall } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';

interface ContactActionMenuProps {
  phone: string;
  secondaryPhone?: string;
  contactName?: string;
  compact?: boolean;
}

function formatWaDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) return digits.slice(2);
  return digits;
}

function formatTelUri(raw: string): string {
  return raw.replace(/[^\d+]/g, '');
}

export function ContactActionMenu({
  phone,
  secondaryPhone,
  contactName,
  compact = false,
}: ContactActionMenuProps) {
  const { t, lang } = useIbonda();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; alignRight: boolean }>({
    top: 0,
    left: 0,
    alignRight: false,
  });

  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const primaryPhone = phone?.trim() || secondaryPhone?.trim() || '';
  const altPhone =
    secondaryPhone?.trim() && secondaryPhone.trim() !== primaryPhone
      ? secondaryPhone.trim()
      : '';

  const updatePosition = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const popWidth = 256;
    const estHeight = altPhone ? 230 : 155;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estHeight && rect.top > estHeight;
    const top = openUp ? Math.max(8, rect.top - estHeight - 6) : rect.bottom + 6;

    const isRtl = lang === 'ar';
    let left = isRtl ? rect.left : rect.right - popWidth;
    if (left + popWidth > window.innerWidth - 10) {
      left = window.innerWidth - popWidth - 10;
    }
    if (left < 10) left = 10;

    setCoords({ top, left, alignRight: !isRtl });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current &&
        !btnRef.current.contains(target) &&
        popRef.current &&
        !popRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleScroll = () => setOpen(false);

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!primaryPhone) {
    return <span className="text-[11px] font-medium text-[#4B5563]">—</span>;
  }

  const renderPhoneLinks = (rawPhone: string, roleLabel: string) => {
    const waDigits = formatWaDigits(rawPhone);
    const telUri = formatTelUri(rawPhone);
    return (
      <div className="space-y-2 rounded-lg border border-[#C6D1CF] bg-[#F4F7F6] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-[#053332]">{roleLabel}</span>
          <span className="font-mono text-[11px] font-bold text-[#000000] tabular-nums" dir="ltr">
            {rawPhone}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <a
            href={`https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#15803D]/50 bg-[#DCFCE7] px-2.5 py-1.5 text-[11px] font-bold text-[#000000] transition-colors hover:bg-[#BBF7D0] whitespace-nowrap"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#15803D]" />
            <span>{t.agencies.contactWhatsapp}</span>
          </a>
          <a
            href={`tel:${telUri}`}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#A7BCBA] bg-[#EFF3F2] px-2.5 py-1.5 text-[11px] font-bold text-[#000000] transition-colors hover:bg-[#DDE6E4] whitespace-nowrap"
          >
            <PhoneCall className="h-3.5 w-3.5 shrink-0 text-[#DF4416]" />
            <span>{t.agencies.contactCall}</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-[#BAC7C5] bg-white font-bold text-[#000000] shadow-xs transition-colors hover:border-[#DF4416] hover:bg-[#FFEDD5] whitespace-nowrap shrink-0 ${
          compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        }`}
        aria-expanded={open}
      >
        <Phone className="h-3.5 w-3.5 text-[#DF4416] shrink-0" />
        <span>{t.agencies.contactAction}</span>
        <ChevronDown className={`h-3 w-3 text-[#000000] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={popRef}
          onClick={(e) => e.stopPropagation()}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className="fixed z-50 w-64 rounded-xl border-2 border-[#A7BCBA] bg-white p-3 shadow-2xl space-y-2.5"
        >
          {contactName && (
            <div className="border-b border-[#D5E2E1] pb-2">
              <p className="text-[11px] font-black text-[#000000] truncate">{contactName}</p>
            </div>
          )}
          {renderPhoneLinks(primaryPhone, t.agencies.agencyPhoneLabel)}
          {altPhone && renderPhoneLinks(altPhone, t.agencies.managerPhoneLabel)}
        </div>
      )}
    </div>
  );
}
