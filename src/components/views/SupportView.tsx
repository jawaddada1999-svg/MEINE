import React, { useMemo, useState } from 'react';
import { Lock, MessageSquare, Paperclip, Plus, Search, Send } from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { TicketPriority, TicketStatus, TicketType } from '../../types/ibonda';
import { getLocalized } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { StatusLabel } from '../ui/StatusLabel';
import { PageHeader } from '../ui/PageHeader';
import { TablePagination } from '../ui/TablePagination';

const PAGE_SIZE = 6;

export function SupportView() {
  const {
    tickets,
    agencies,
    lang,
    t,
    createTicket,
    addTicketMessage,
    updateTicketStatus,
    updateTicketPriority,
  } = useIbonda();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);

  const [replyMode, setReplyMode] = useState<'public' | 'internal'>('public');
  const [replyText, setReplyText] = useState('');

  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({
    agencyId: agencies[0]?.id || '',
    subject: '',
    description: '',
    type: 'technical' as TicketType,
    priority: 'medium' as TicketPriority,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((tkt) => {
      const ag = agencies.find((a) => a.id === tkt.agencyId);
      const matchesQ =
        !q ||
        tkt.ticketCode.toLowerCase().includes(q) ||
        getLocalized(tkt.subject, lang).toLowerCase().includes(q) ||
        (ag ? getLocalized(ag.name, lang) : '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || tkt.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || tkt.priority === priorityFilter;
      return matchesQ && matchesStatus && matchesPriority;
    });
  }, [tickets, agencies, lang, search, statusFilter, priorityFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const selectedTicket = useMemo(
    () => tickets.find((tkt) => tkt.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const selectedAgency = selectedTicket
    ? agencies.find((a) => a.id === selectedTicket.agencyId)
    : null;

  const statusTone = (st: TicketStatus) => {
    switch (st) {
      case 'new':
        return 'blue';
      case 'in_progress':
        return 'amber';
      case 'waiting_agency':
        return 'navy';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'slate';
    }
  };

  const priorityTone = (pr: TicketPriority) => {
    switch (pr) {
      case 'urgent':
      case 'high':
        return 'red';
      case 'medium':
        return 'amber';
      default:
        return 'slate';
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    addTicketMessage(selectedTicket.id, replyText, replyMode === 'internal');
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.subject.trim() || !newForm.description.trim()) return;
    createTicket(newForm);
    setShowNewModal(false);
  };

  const inputClass = 'ibonda-input';

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.support.title}
        subtitle={t.support.subtitle}
        actions={
          <button
            type="button"
            onClick={() => {
              setNewForm({
                agencyId: agencies[0]?.id || '',
                subject: '',
                description: '',
                type: 'technical',
                priority: 'medium',
              });
              setShowNewModal(true);
            }}
            className="ibonda-btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t.support.newTicket}
          </button>
        }
      />

      {/* Filters */}
      <div className="ibonda-filter-bar flex flex-wrap items-center gap-3 p-3.5">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#053332]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`${t.common.search}...`}
            className="ibonda-input bg-white ps-9 pe-3"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.support.colStatus}: {t.common.all}</option>
          {(['new', 'in_progress', 'waiting_agency', 'resolved', 'closed'] as TicketStatus[]).map((st) => (
            <option key={st} value={st}>
              {t.ticketStatus[st]}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.support.colPriority}: {t.common.all}</option>
          {(['urgent', 'high', 'medium', 'low'] as TicketPriority[]).map((pr) => (
            <option key={pr} value={pr}>
              {t.ticketPriority[pr]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Tickets List Table */}
        <div className="xl:col-span-7 ibonda-table-wrap flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-start text-xs">
              <thead className="ibonda-table-head">
                <tr>
                  <th className="px-4 py-3 text-start">{t.support.colCode}</th>
                  <th className="px-4 py-3 text-start">{t.support.colAgency}</th>
                  <th className="px-4 py-3 text-start">{t.support.colSubject}</th>
                  <th className="px-4 py-3 text-start">{t.support.colPriority}</th>
                  <th className="px-4 py-3 text-start">{t.support.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE8E7]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-[#374151]">
                      {t.common.noResults}
                    </td>
                  </tr>
                ) : (
                  paginated.map((tkt) => {
                    const ag = agencies.find((a) => a.id === tkt.agencyId);
                    const active = selectedTicket?.id === tkt.id;
                    return (
                      <tr
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#FED7AA] ring-2 ring-inset ring-[#DF4416]'
                            : 'ibonda-table-row'
                        }`}
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex rounded-md border border-[#C6D1CF] bg-[#EFF3F2] px-2 py-0.5 font-mono text-[11px] font-bold text-[#053332]">
                            {tkt.ticketCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-extrabold text-[#000000] whitespace-nowrap">
                          {ag ? getLocalized(ag.name, lang) : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-[#000000] line-clamp-1">{getLocalized(tkt.subject, lang)}</p>
                          <p className="text-[11px] font-medium text-[#374151]">
                            {t.ticketType[tkt.type]} · {tkt.createdAt}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusLabel tone={priorityTone(tkt.priority)} label={t.ticketPriority[tkt.priority]} />
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusLabel tone={statusTone(tkt.status)} label={t.ticketStatus[tkt.status]} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>

        {/* Ticket Detail & Conversation Panel */}
        <div className="xl:col-span-5 rounded-xl border border-[#2D6A4F] bg-[#F2F7F4] overflow-hidden shadow-[0_3px_12px_rgba(5,51,50,0.08)]">
          {!selectedTicket ? (
            <div className="flex flex-col items-center justify-center p-8 py-16 text-center text-xs text-[#374151]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#053332] bg-white text-[#DF4416]">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="mt-3 font-semibold">{t.support.selectTicketPrompt}</p>
            </div>
          ) : (
            <div>
              <div className="border-b border-[#2D6A4F]/30 bg-gradient-to-r from-[#D8EFE4] to-[#BBE2CF] flex items-start justify-between gap-3 px-5 py-4">
                <div>
                  <span className="inline-flex rounded-md border border-[#053332]/30 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-[#053332]">
                    {selectedTicket.ticketCode}
                  </span>
                  <h2 className="mt-1.5 text-sm font-extrabold text-[#000000]">{getLocalized(selectedTicket.subject, lang)}</h2>
                  <p className="mt-0.5 text-[11px] font-bold text-[#053332]">
                    {selectedAgency ? getLocalized(selectedAgency.name, lang) : '—'} · {t.ticketType[selectedTicket.type]} · {selectedTicket.createdAt}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#000000]">
                      {t.support.changeStatus}
                    </label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as TicketStatus)}
                      className={`${inputClass} bg-white`}
                    >
                      {(['new', 'in_progress', 'waiting_agency', 'resolved', 'closed'] as TicketStatus[]).map(
                        (st) => (
                          <option key={st} value={st}>
                            {t.ticketStatus[st]}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#000000]">
                      {t.support.changePriority}
                    </label>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) =>
                        updateTicketPriority(selectedTicket.id, e.target.value as TicketPriority)
                      }
                      className={`${inputClass} bg-white`}
                    >
                      {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((pr) => (
                        <option key={pr} value={pr}>
                          {t.ticketPriority[pr]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-[#C6D9D7] bg-white p-3.5 text-xs font-medium text-[#000000] leading-relaxed">
                  <p className="mb-1 text-[11px] font-extrabold text-[#053332]">{t.support.description}</p>
                  {getLocalized(selectedTicket.description, lang)}
                  {selectedTicket.attachments.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2 border-t border-[#DDE8E7] pt-2">
                      {selectedTicket.attachments.map((att, idx) => {
                        const attLabel = getLocalized(att, lang);
                        return (
                          <span
                            key={`${idx}_${attLabel}`}
                            className="inline-flex items-center gap-1 rounded-md border border-[#C6D9D7] bg-[#F2F7F7] px-2 py-0.5 text-[11px] font-semibold text-[#000000]"
                          >
                            <Paperclip className="h-3 w-3 text-[#DF4416]" />
                            {attLabel}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-extrabold text-[#000000]">{t.support.conversation}</h3>
                  <div className="max-h-60 space-y-2.5 overflow-y-auto pe-1">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`rounded-lg border-2 p-3 text-xs ${
                          msg.isInternalNote
                            ? 'border-[#B45309] bg-[#FDE68A]'
                            : msg.senderType === 'admin'
                            ? 'border-[#DF4416] bg-[#FED7AA]'
                            : 'border-[#BAC7C5] bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-extrabold text-[#000000] inline-flex items-center gap-1.5">
                            {msg.isInternalNote && <Lock className="h-3 w-3 text-[#B45309]" />}
                            {getLocalized(msg.senderName, lang)}
                            {msg.isInternalNote && (
                              <span className="text-[#92400E] font-semibold">
                                ({t.support.internalNoteBadge})
                              </span>
                            )}
                          </span>
                          <span className="font-mono font-semibold text-[#374151] tabular-nums">{msg.createdAt}</span>
                        </div>
                        <p className="mt-1.5 font-medium text-[#000000] leading-relaxed">{getLocalized(msg.body, lang)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="space-y-2.5 border-t border-[#BCE1DD] pt-3.5">
                  <div className="ibonda-tabs-bar flex items-center gap-1 p-1 bg-white">
                    <button
                      type="button"
                      onClick={() => setReplyMode('public')}
                      className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-colors ${
                        replyMode === 'public'
                          ? 'bg-[#053332] text-white shadow-xs'
                          : 'text-[#000000] hover:bg-[#F2F7F7]'
                      }`}
                    >
                      {t.support.publicReply}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyMode('internal')}
                      className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-colors ${
                        replyMode === 'internal'
                          ? 'bg-[#D97706] text-white shadow-xs'
                          : 'text-[#000000] hover:bg-[#F2F7F7]'
                      }`}
                    >
                      {t.support.internalNote}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      replyMode === 'internal'
                        ? t.support.internalPlaceholder
                        : t.support.replyPlaceholder
                    }
                    className={`${inputClass} bg-white`}
                  />

                  <button
                    type="submit"
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors ${
                      replyMode === 'internal'
                        ? 'bg-[#B45309] hover:bg-amber-800'
                        : 'bg-[#DF4416] hover:bg-[#BD320A]'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5" />
                    {replyMode === 'internal' ? t.support.saveInternalNote : t.support.sendReply}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title={t.support.newTicket}
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.support.colAgency}</label>
            <select
              value={newForm.agencyId}
              onChange={(e) => setNewForm({ ...newForm, agencyId: e.target.value })}
              className={inputClass}
            >
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {getLocalized(a.name, lang)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.support.colSubject} *</label>
            <input
              type="text"
              required
              value={newForm.subject}
              onChange={(e) => setNewForm({ ...newForm, subject: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.support.colType}</label>
              <select
                value={newForm.type}
                onChange={(e) => setNewForm({ ...newForm, type: e.target.value as TicketType })}
                className={inputClass}
              >
                {(['technical', 'account', 'subscription', 'integration', 'help', 'suggestion'] as TicketType[]).map(
                  (tp) => (
                    <option key={tp} value={tp}>
                      {t.ticketType[tp]}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.support.colPriority}</label>
              <select
                value={newForm.priority}
                onChange={(e) => setNewForm({ ...newForm, priority: e.target.value as TicketPriority })}
                className={inputClass}
              >
                {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((pr) => (
                  <option key={pr} value={pr}>
                    {t.ticketPriority[pr]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.support.description} *</label>
            <textarea
              rows={3}
              required
              value={newForm.description}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#D6E4E3] pt-4">
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="ibonda-btn-primary"
            >
              {t.common.create}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
