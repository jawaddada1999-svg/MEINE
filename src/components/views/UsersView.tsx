import React, { useMemo, useState } from 'react';
import {
  KeyRound,
  MailCheck,
  Plus,
  Search,
  Shield,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useIbonda } from '../../store/IbondaStore';
import { AgencyUser, UserRole, UserStatus } from '../../types/ibonda';
import { getLocalized } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { StatusLabel } from '../ui/StatusLabel';
import { PageHeader } from '../ui/PageHeader';
import { TablePagination } from '../ui/TablePagination';

const PAGE_SIZE = 6;

export function UsersView() {
  const {
    users,
    agencies,
    lang,
    t,
    inviteUser,
    toggleUserStatus,
    resendUserInvite,
    triggerUserPasswordReset,
  } = useIbonda();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    agencyId: agencies[0]?.id || '',
    role: 'employee' as UserRole,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [confirmDisableUser, setConfirmDisableUser] = useState<AgencyUser | null>(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const ag = agencies.find((a) => a.id === u.agencyId);
      const matchesQ =
        !q ||
        getLocalized(u.fullName, lang).toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (ag ? getLocalized(ag.name, lang) : '').toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchesAgency = agencyFilter === 'all' || u.agencyId === agencyFilter;
      return matchesQ && matchesRole && matchesStatus && matchesAgency;
    });
  }, [users, agencies, lang, search, roleFilter, statusFilter, agencyFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    if (!inviteForm.fullName.trim() || !inviteForm.email.trim() || !inviteForm.agencyId) {
      setInviteError(t.common.requiredField);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteForm.email.trim())) {
      setInviteError(t.common.invalidEmail);
      return;
    }
    const res = inviteUser(inviteForm);
    if (!res.ok) {
      setInviteError(res.error || t.users.duplicateEmailError);
      return;
    }
    setShowInviteModal(false);
  };

  const userTone = (st: UserStatus) =>
    st === 'active' ? 'green' : st === 'invited' ? 'blue' : 'red';

  const inputClass = 'ibonda-input';

  const roleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'agency_owner':
        return 'border-[#053332] bg-[#D1E7DF] text-[#000000]';
      case 'manager':
        return 'border-[#C2410C] bg-[#FED7AA] text-[#000000]';
      default:
        return 'border-[#15803D] bg-[#BBF7D0] text-[#000000]';
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.users.title}
        subtitle={t.users.subtitle}
        actions={
          <button
            type="button"
            onClick={() => {
              setInviteError('');
              setInviteForm({
                fullName: '',
                email: '',
                phone: '',
                agencyId: agencies[0]?.id || '',
                role: 'employee',
              });
              setShowInviteModal(true);
            }}
            className="ibonda-btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t.users.inviteUser}
          </button>
        }
      />

      {/* Security Rule Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#C6D1CF] bg-[#EFF3F2] px-4 py-3 text-xs font-bold text-[#000000]">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#053332]" />
        <span>{t.users.securityRuleNote}</span>
      </div>

      {/* Filters */}
      <div className="ibonda-filter-bar">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#053332]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t.users.searchPlaceholder}
            className="ibonda-input ps-9 pe-3 bg-white"
          />
        </div>
        <select
          value={agencyFilter}
          onChange={(e) => {
            setAgencyFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.users.colAgency}: {t.common.all}</option>
          {agencies.map((a) => (
            <option key={a.id} value={a.id}>
              {getLocalized(a.name, lang)}
            </option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.users.colRole}: {t.common.all}</option>
          {(['agency_owner', 'manager', 'employee'] as UserRole[]).map((r) => (
            <option key={r} value={r}>
              {t.userRole[r]}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="ibonda-select bg-white"
        >
          <option value="all">{t.users.colStatus}: {t.common.all}</option>
          {(['active', 'invited', 'disabled'] as UserStatus[]).map((s) => (
            <option key={s} value={s}>
              {t.userStatus[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="ibonda-table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-xs">
            <thead>
              <tr className="ibonda-table-head">
                <th className="px-4 py-3 text-start font-semibold">{t.users.colUser}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.users.colContact}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.users.colAgency}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.users.colRole}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.users.colStatus}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.users.colLastLogin}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE8E7]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#374151]">
                    {t.common.noResults}
                  </td>
                </tr>
              ) : (
                paginated.map((usr) => {
                  const ag = agencies.find((a) => a.id === usr.agencyId);
                  return (
                    <tr key={usr.id} className="ibonda-table-row">
                      <td className="px-4 py-3.5 font-extrabold text-[#000000]">{getLocalized(usr.fullName, lang)}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-mono text-[11px] font-semibold text-[#053332]">{usr.email}</p>
                        <p className="font-mono text-[11px] font-medium text-[#374151] tabular-nums" dir="ltr">
                          {usr.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-[#000000]">{ag ? getLocalized(ag.name, lang) : '—'}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${roleBadgeClass(
                            usr.role
                          )}`}
                        >
                          {t.userRole[usr.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusLabel
                          tone={userTone(usr.status)}
                          icon={usr.status === 'active' ? 'check' : usr.status === 'invited' ? 'clock' : 'x'}
                          label={t.userStatus[usr.status]}
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-[#374151] tabular-nums whitespace-nowrap">
                        {usr.lastLogin || t.users.neverLoggedIn}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedUserId(usr.id)}
                            className="rounded-md bg-[#053332] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0A4E4C] whitespace-nowrap"
                          >
                            {t.common.viewDetails}
                          </button>
                          {usr.status === 'disabled' ? (
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(usr.id)}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-[#DDF6EC] px-2.5 py-1 text-[11px] font-bold text-[#065F46] hover:bg-emerald-200 whitespace-nowrap"
                            >
                              <UserCheck className="h-3 w-3" />
                              {t.users.enableAccount}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDisableUser(usr)}
                              className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-[#FDE4E4] px-2.5 py-1 text-[11px] font-bold text-[#991B1B] hover:bg-red-200 whitespace-nowrap"
                            >
                              <UserX className="h-3 w-3" />
                              {t.users.disableAccount}
                            </button>
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
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      {/* Invite User Modal */}
      <Modal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={t.users.inviteUser}
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          {inviteError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-[#DC4545]">
              {inviteError}
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.users.fullName} *</label>
            <input
              type="text"
              required
              value={inviteForm.fullName}
              onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.users.email} *</label>
              <input
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.users.phone}</label>
              <input
                type="text"
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.users.agency}</label>
              <select
                value={inviteForm.agencyId}
                onChange={(e) => setInviteForm({ ...inviteForm, agencyId: e.target.value })}
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
              <label className="mb-1 block text-xs font-semibold text-[#000000]">{t.users.role}</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                className={inputClass}
              >
                <option value="agency_owner">{t.userRole.agency_owner}</option>
                <option value="manager">{t.userRole.manager}</option>
                <option value="employee">{t.userRole.employee}</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#D6E4E3] pt-4">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="ibonda-btn-secondary"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="ibonda-btn-primary"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>

      {/* User Details Modal */}
      <Modal
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUserId(null)}
        title={t.users.userDetailsTitle}
        subtitle={selectedUser?.email}
        maxWidthClass="max-w-xl"
        footer={
          <button
            type="button"
            onClick={() => setSelectedUserId(null)}
            className="ibonda-btn-primary"
          >
            {t.common.close}
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#C6D1CF] bg-[#EFF3F2] p-4">
              <div>
                <p className="text-[#374151] font-medium">{t.users.fullName}</p>
                <p className="mt-0.5 font-extrabold text-[#000000]">{getLocalized(selectedUser.fullName, lang)}</p>
              </div>
              <div>
                <p className="text-[#374151] font-medium">{t.users.agency}</p>
                <p className="mt-0.5 font-bold text-[#053332]">
                  {(() => {
                    const ag = agencies.find((a) => a.id === selectedUser.agencyId);
                    return ag ? getLocalized(ag.name, lang) : '—';
                  })()}
                </p>
              </div>
              <div>
                <p className="text-[#111827] font-semibold">{t.users.role}</p>
                <p className="mt-0.5 font-black text-[#DF4416]">{t.userRole[selectedUser.role]}</p>
              </div>
              <div>
                <p className="text-[#111827] font-semibold">{t.users.colLastLogin}</p>
                <p className="mt-0.5 font-mono font-bold text-[#000000]">
                  {selectedUser.lastLogin || t.users.neverLoggedIn}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => resendUserInvite(selectedUser.id)}
                className="ibonda-btn-secondary"
              >
                <MailCheck className="h-3.5 w-3.5 text-[#DF4416]" />
                {t.users.resendInvite}
              </button>
              <button
                type="button"
                onClick={() => triggerUserPasswordReset(selectedUser.id)}
                className="ibonda-btn-secondary"
              >
                <KeyRound className="h-3.5 w-3.5 text-[#053332]" />
                {t.users.resetPassword}
              </button>
            </div>

            <div>
              <h4 className="mb-2 font-extrabold text-[#000000]">{t.users.activityLog}</h4>
              {selectedUser.activityLog.length === 0 ? (
                <p className="text-[#374151]">{t.common.noResults}</p>
              ) : (
                <div className="divide-y divide-[#DDE8E7] rounded-xl border border-[#C6D9D7] overflow-hidden">
                  {selectedUser.activityLog.map((entry) => (
                    <div key={entry.id} className="ibonda-table-row flex items-center justify-between px-3.5 py-2.5">
                      <div>
                        <p className="font-bold text-[#000000]">{getLocalized(entry.action, lang)}</p>
                        <p className="text-[11px] font-medium text-[#374151]">{getLocalized(entry.ipNote, lang)}</p>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-[#000000] tabular-nums">
                        {entry.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(confirmDisableUser)}
        onClose={() => setConfirmDisableUser(null)}
        onConfirm={() => {
          if (confirmDisableUser) toggleUserStatus(confirmDisableUser.id);
        }}
        title={t.users.confirmDisableTitle}
        message={t.users.confirmDisableMsg}
        variant="danger"
      />
    </div>
  );
}
