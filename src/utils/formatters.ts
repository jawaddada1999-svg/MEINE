import { Language, LocalizedField } from '../types/ibonda';
import { REFERENCE_TODAY } from '../data/seedData';

export function getLocalized(text: LocalizedField | undefined | null, lang: Language): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.en || text.ar || text.fr || '';
}

export function addDaysToIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

export function diffDaysFromToday(endDateIso: string, todayIso: string = REFERENCE_TODAY): number {
  const [ey, em, ed] = endDateIso.split('-').map(Number);
  const [ty, tm, td] = todayIso.split('-').map(Number);
  if (!ey || !em || !ed || !ty || !tm || !td) return 0;
  const endUtc = Date.UTC(ey, em - 1, ed);
  const todayUtc = Date.UTC(ty, tm - 1, td);
  return Math.round((endUtc - todayUtc) / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number, currency: 'MAD' | 'EUR' | 'USD', lang: Language): string {
  if (lang === 'ar') {
    const num = new Intl.NumberFormat('ar-MA', { maximumFractionDigits: 0 }).format(amount);
    const unit = currency === 'MAD' ? 'د.م.' : currency === 'EUR' ? 'يورو' : 'دولار';
    return `${num} ${unit}`;
  }
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export function formatNumber(value: number, lang: Language): string {
  const locale = lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

export function nowTimestamp(): string {
  return `${REFERENCE_TODAY} ${new Date().toTimeString().slice(0, 5)}`;
}

export function downloadCsvFile(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent =
    '\uFEFF' +
    [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
