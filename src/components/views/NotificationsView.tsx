import React, { useMemo, useState } from 'react';
import { Bell, Edit3, Info, Plus, Send } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { Language, LocalizedField, NotificationItem, NotificationType } from '../../types/ibonda';
import { getLocalized } from '../../utils/formatters';
import { REFERENCE_TODAY } from '../../data/seedData';
import { Modal } from '../ui/Modal';
import { StatusLabel } from '../ui/StatusLabel';
import { PageHeader } from '../ui/PageHeader';
import { TablePagination } from '../ui/TablePagination';

interface NotificationsViewProps {
  openCreateOnMount?: boolean;
  onConsumeOpenCreate?: () => void;
}

const PAGE_SIZE = 6;

function mergeLocalized(existing: LocalizedField | undefined, nextValue: string, lang: Language): LocalizedField {
  if (existing && typeof existing === 'object') {
    return { ...existing, [lang]: nextValue };
  }
  const base = typeof existing === 'string' ? existing : nextValue;
  return {
    ar: lang === 'ar' ? nextValue : base || nextValue,
    fr: lang === 'fr' ? nextValue : base || nextValue,
    en: lang === 'en' ? nextValue : base || nextValue,
  };
}

export function NotificationsView({ openCreateOnMount, onConsumeOpenCreate }: NotificationsViewProps) {
  const {
    notifications,
    agencies,
    lang,
    t,
    saveNotification,
    dispatchExistingNotification,
  } = useIbonda();

  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(Boolean(openCreateOnMount));
  const [editingNotif, setEditingNotif] = useState<NotificationItem | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'general' as NotificationType,
    recipientScope: 'all' as 'all' | 'specific',
    agencyId: agencies[0]?.id || '',
    scheduledDate: REFERENCE_TODAY,
  });

  React.useEffect(() => {
    if (openCreateOnMount) {
      openCreateModal();
      onConsumeOpenCreate?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCreateOnMount]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, page]);

  const openCreateModal = () => {
    setEditingNotif(null);
    setForm({
      title: '',
      content: '',
      type: 'general',
      recipientScope: 'all',
      agencyId: agencies[0]?.id || '',
      scheduledDate: REFERENCE_TODAY,
    });
    setShowModal(true);
  };

  const openEditModal = (item: NotificationItem) => {
    setEditingNotif(item);
    setForm({
      title: getLocalized(item.title, lang),
      content: getLocalized(item.content, lang),
      type: item.type,
      recipientScope: item.recipientScope,
      agencyId: item.agencyId || agencies[0]?.id || '',
      scheduledDate: item.scheduledDate,
    });
    setShowModal(true);
  };

  const handleSave = (dispatchNow: boolean) => {
    if (!form.title.trim() || !form.content.trim()) return;
    saveNotification(
      {
        id: editingNotif?.id,
        title: mergeLocalized(editingNotif?.title, form.title.trim(), lang),
        content: mergeLocalized(editingNotif?.content, form.content.trim(), lang),
        type: form.type,
        recipientScope: form.recipientScope,
        agencyId: form.recipientScope === 'specific' ? form.agencyId : undefined,
        scheduledDate: form.scheduledDate,
      },
      dispatchNow
    );
    setShowModal(false);
  };

  const inputClass = 'ibonda-input';

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.notifications.title}
        subtitle={t.notifications.subtitle}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="ibonda-btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t.notifications.createNotification}
          </button>
        }
      />

      {/* Honest Delivery Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-gradient-to-r from-[#FEF2D6] to-[#FDE7B6] px-4 py-3 text-xs font-semibold text-[#000000] shadow-xs">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
        <span>{t.notifications.honestDeliveryNotice}</span>
      </div>

      {/* Notifications History Table */}
      <div className="ibonda-table-wrap">
        <div className="ibonda-card-header px-5 py-3.5">
          <h2 className="text-sm font-extrabold text-[#000000]">{t.notifications.historyTitle}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-xs">
            <thead className="ibonda-table-head">
              <tr>
                <th className="px-4 py-3 text-start">{t.notifications.colTitle}</th>
                <th className="px-4 py-3 text-start">{t.notifications.colType}</th>
                <th className="px-4 py-3 text-start">{t.notifications.colRecipients}</th>
                <th className="px-4 py-3 text-start">{t.notifications.colDate}</th>
                <th className="px-4 py-3 text-start">{t.notifications.colStatus}</th>
                <th className="px-4 py-3 text-end">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE8E7]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#374151]">
                    <Bell className="mx-auto h-7 w-7 text-[#84B5B2]" />
                    <p className="mt-2 font-semibold">{t.common.noResults}</p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const targetAg = item.agencyId
                    ? agencies.find((a) => a.id === item.agencyId)
                    : null;
                  return (
                    <tr key={item.id} className="ibonda-table-row transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-extrabold text-[#000000]">{getLocalized(item.title, lang)}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-[#374151] line-clamp-1">{getLocalized(item.content, lang)}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-[#C6D1CF] bg-[#EFF3F2] px-2.5 py-0.5 text-[11px] font-bold text-[#053332]">
                          {t.notificationType[item.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-[#C2410C] bg-[#FED7AA] px-2.5 py-0.5 text-[11px] font-bold text-[#000000]">
                          {item.recipientScope === 'all'
                            ? t.notifications.allAgencies
                            : targetAg
                            ? getLocalized(targetAg.name, lang)
                            : t.notifications.specificAgency}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                        {item.dispatchedAt || item.scheduledDate}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusLabel
                          tone={item.status === 'draft' ? 'slate' : 'amber'}
                          icon={item.status === 'draft' ? 'clock' : 'alert'}
                          label={t.notificationStatus[item.status]}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'draft' && (
                            <>
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="rounded-md border border-[#C6D9D7] bg-white p-1.5 text-[#000000] transition-colors hover:bg-[#EDF5F4]"
                                title={t.common.edit}
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => dispatchExistingNotification(item.id)}
                                className="inline-flex items-center gap-1 rounded-md bg-[#DF4416] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition-colors hover:bg-[#BD320A] whitespace-nowrap"
                              >
                                <Send className="h-3 w-3" />
                                {t.notifications.dispatchAction}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalItems={notifications.length}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      {/* Create/Edit Notification Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingNotif ? t.notifications.editNotification : t.notifications.createNotification}
        maxWidthClass="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="ibonda-btn-secondary font-bold"
            >
              {t.notifications.saveDraft}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="ibonda-btn-primary"
            >
              <Send className="h-3.5 w-3.5" />
              {t.notifications.dispatchAction}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.notifications.notifTitle} *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.notifications.notifType}</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as NotificationType })}
                className={inputClass}
              >
                {(
                  [
                    'general',
                    'agency_specific',
                    'subscription',
                    'payment',
                    'maintenance',
                    'update',
                    'admin',
                  ] as NotificationType[]
                ).map((tp) => (
                  <option key={tp} value={tp}>
                    {t.notificationType[tp]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.notifications.scheduledDate}</label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.notifications.recipientScope}</label>
              <select
                value={form.recipientScope}
                onChange={(e) =>
                  setForm({ ...form, recipientScope: e.target.value as 'all' | 'specific' })
                }
                className={inputClass}
              >
                <option value="all">{t.notifications.allAgencies}</option>
                <option value="specific">{t.notifications.specificAgency}</option>
              </select>
            </div>
            {form.recipientScope === 'specific' && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.agencies.colAgency}</label>
                <select
                  value={form.agencyId}
                  onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
                  className={inputClass}
                >
                  {agencies.map((a) => (
                    <option key={a.id} value={a.id}>
                      {getLocalized(a.name, lang)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.notifications.notifContent} *</label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
