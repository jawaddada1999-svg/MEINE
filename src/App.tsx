import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Repeat,
  Search,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import { IbondaProvider, useIbonda } from './store/IbondaStore';
import { Language, NavSection, PaymentStatus } from './types/ibonda';
import { ToastContainer } from './components/ui/ToastContainer';
import { OverviewView } from './components/views/OverviewView';
import { AgenciesView } from './components/views/AgenciesView';
import { SubscriptionsView } from './components/views/SubscriptionsView';
import { PlansView } from './components/views/PlansView';
import { PaymentsView } from './components/views/PaymentsView';
import { UsersView } from './components/views/UsersView';
import { SupportView } from './components/views/SupportView';
import { NotificationsView } from './components/views/NotificationsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { diffDaysFromToday, formatCurrency, getLocalized } from './utils/formatters';

const ADMIN_AVATAR_SRC = '/src/assets/images/avatar_platform_admin_1795170332661.jpg';
const BRAND_LOGO_SRC = '/assets/aistudio/IMG_8325_5ae20b19.jpeg';

const NAV_ITEMS: { key: NavSection; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'overview', icon: LayoutDashboard },
  { key: 'agencies', icon: Building2 },
  { key: 'subscriptions', icon: Repeat },
  { key: 'plans', icon: Layers },
  { key: 'payments', icon: CreditCard },
  { key: 'users', icon: Users },
  { key: 'support', icon: LifeBuoy },
  { key: 'notifications', icon: Bell },
  { key: 'analytics', icon: BarChart3 },
  { key: 'settings', icon: Settings },
];

interface SearchHit {
  id: string;
  category: 'agency' | 'user' | 'payment' | 'ticket';
  title: string;
  subtitle: string;
  onSelect: () => void;
}

function DashboardShell() {
  const {
    activeNav,
    setActiveNav,
    selectedAgencyId,
    setSelectedAgencyId,
    lang,
    setLang,
    t,
    settings,
    agencies,
    users,
    tickets,
    payments,
    subscriptions,
    notifications,
  } = useIbonda();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const [globalQuery, setGlobalQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [openAddAgency, setOpenAddAgency] = useState(false);
  const [openAddPlan, setOpenAddPlan] = useState(false);
  const [openCreateNotif, setOpenCreateNotif] = useState(false);
  const [paymentsInitialFilter, setPaymentsInitialFilter] = useState<PaymentStatus | 'all'>('all');

  const platformName = getLocalized(settings.platformName, lang) || t.common.appTitle;
  const adminName = getLocalized(settings.adminName, lang);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifPopoverOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setNotifPopoverOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const openTicketsCount = tickets.filter(
    (tkt) => tkt.status === 'new' || tkt.status === 'in_progress'
  ).length;
  const pendingPaymentsCount = payments.filter(
    (p) => p.status === 'pending' || p.status === 'overdue'
  ).length;

  const expiringTrials = useMemo(
    () =>
      subscriptions.filter(
        (s) =>
          s.status === 'free_trial' &&
          diffDaysFromToday(s.endDate) >= 0 &&
          diffDaysFromToday(s.endDate) <= settings.trialWarningDays
      ),
    [subscriptions, settings.trialWarningDays]
  );

  const alertTotalCount = expiringTrials.length + pendingPaymentsCount;

  const selectedAgency = useMemo(
    () => (selectedAgencyId ? agencies.find((a) => a.id === selectedAgencyId) || null : null),
    [agencies, selectedAgencyId]
  );

  const navigateTo = (key: NavSection) => {
    setActiveNav(key);
    if (key !== 'agencies') {
      setSelectedAgencyId(null);
    }
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setNotifPopoverOpen(false);
  };

  const searchResults = useMemo<SearchHit[]>(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = [];

    for (const ag of agencies) {
      const agName = getLocalized(ag.name, lang);
      const agCity = getLocalized(ag.city, lang);
      const agMgr = getLocalized(ag.managerName, lang);
      if (
        agName.toLowerCase().includes(q) ||
        agCity.toLowerCase().includes(q) ||
        ag.email.toLowerCase().includes(q) ||
        agMgr.toLowerCase().includes(q)
      ) {
        hits.push({
          id: `ag_${ag.id}`,
          category: 'agency',
          title: agName,
          subtitle: `${agCity} · ${t.agencyStatus[ag.status]}`,
          onSelect: () => {
            setSelectedAgencyId(ag.id);
            setActiveNav('agencies');
            setGlobalQuery('');
            setSearchFocused(false);
          },
        });
      }
      if (hits.length >= 8) break;
    }

    if (hits.length < 8) {
      for (const usr of users) {
        const usrName = getLocalized(usr.fullName, lang);
        if (usrName.toLowerCase().includes(q) || usr.email.toLowerCase().includes(q)) {
          const ag = agencies.find((a) => a.id === usr.agencyId);
          hits.push({
            id: `usr_${usr.id}`,
            category: 'user',
            title: usrName,
            subtitle: `${usr.email}${ag ? ` · ${getLocalized(ag.name, lang)}` : ''}`,
            onSelect: () => {
              setSelectedAgencyId(null);
              setActiveNav('users');
              setGlobalQuery('');
              setSearchFocused(false);
            },
          });
        }
        if (hits.length >= 8) break;
      }
    }

    if (hits.length < 8) {
      for (const pay of payments) {
        if (pay.transactionRef.toLowerCase().includes(q)) {
          const ag = agencies.find((a) => a.id === pay.agencyId);
          hits.push({
            id: `pay_${pay.id}`,
            category: 'payment',
            title: pay.transactionRef,
            subtitle: `${ag ? getLocalized(ag.name, lang) : ''} · ${formatCurrency(pay.amount, settings.currency, lang)}`,
            onSelect: () => {
              setSelectedAgencyId(null);
              setActiveNav('payments');
              setGlobalQuery('');
              setSearchFocused(false);
            },
          });
        }
        if (hits.length >= 8) break;
      }
    }

    if (hits.length < 8) {
      for (const tkt of tickets) {
        const tktSubject = getLocalized(tkt.subject, lang);
        if (
          tkt.ticketCode.toLowerCase().includes(q) ||
          tktSubject.toLowerCase().includes(q)
        ) {
          hits.push({
            id: `tkt_${tkt.id}`,
            category: 'ticket',
            title: `${tkt.ticketCode} — ${tktSubject}`,
            subtitle: t.ticketStatus[tkt.status],
            onSelect: () => {
              setSelectedAgencyId(null);
              setActiveNav('support');
              setGlobalQuery('');
              setSearchFocused(false);
            },
          });
        }
        if (hits.length >= 8) break;
      }
    }

    return hits;
  }, [globalQuery, agencies, users, payments, tickets, t, settings.currency, lang, setSelectedAgencyId, setActiveNav]);

  const renderView = () => {
    switch (activeNav) {
      case 'overview':
        return (
          <OverviewView
            onQuickAddAgency={() => {
              setSelectedAgencyId(null);
              setOpenAddAgency(true);
              setActiveNav('agencies');
            }}
            onQuickAddPlan={() => {
              setOpenAddPlan(true);
              setActiveNav('plans');
            }}
            onQuickSendNotification={() => {
              setOpenCreateNotif(true);
              setActiveNav('notifications');
            }}
            onQuickViewDuePayments={() => {
              setPaymentsInitialFilter('pending');
              setActiveNav('payments');
            }}
          />
        );
      case 'agencies':
        return (
          <AgenciesView
            openAddOnMount={openAddAgency}
            onConsumeOpenAdd={() => setOpenAddAgency(false)}
          />
        );
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'plans':
        return (
          <PlansView
            openAddOnMount={openAddPlan}
            onConsumeOpenAdd={() => setOpenAddPlan(false)}
          />
        );
      case 'payments':
        return (
          <PaymentsView
            initialStatusFilter={paymentsInitialFilter}
            onConsumeInitialFilter={() => setPaymentsInitialFilter('all')}
          />
        );
      case 'users':
        return <UsersView />;
      case 'support':
        return <SupportView />;
      case 'notifications':
        return (
          <NotificationsView
            openCreateOnMount={openCreateNotif}
            onConsumeOpenCreate={() => setOpenCreateNotif(false)}
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
    }
  };

  const renderSidebar = (isMobileDrawer: boolean) => {
    const collapsed = !isMobileDrawer && sidebarCollapsed;

    return (
      <div className="flex h-full flex-col bg-[#053332] text-white select-none">
        {/* Brand Header */}
        <div
          className={`flex h-16 items-center border-b border-white/15 ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <button
            type="button"
            onClick={() => navigateTo('overview')}
            className="flex items-center gap-2.5 text-start focus-visible:outline-none min-w-0"
            title={platformName}
          >
            <img
              src={BRAND_LOGO_SRC}
              alt={platformName}
              className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-white/25 shadow-sm"
            />
            {!collapsed && (
              <div className="min-w-0">
                <span className="block text-base font-black tracking-tight text-white whitespace-nowrap leading-none">
                  {platformName}
                </span>
                <span className="mt-1 block text-[10px] font-bold text-[#A7F3D0] truncate">
                  {t.common.adminConsole}
                </span>
              </div>
            )}
          </button>

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label={t.common.closeMenu}
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            !collapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="rounded-lg p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                title={t.common.collapseSidebar}
                aria-label={t.common.collapseSidebar}
              >
                <PanelLeftClose className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            )
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center border-b border-white/15 py-2">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              title={t.common.expandSidebar}
              aria-label={t.common.expandSidebar}
            >
              <PanelLeftOpen className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/* 10 Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
          {NAV_ITEMS.map(({ key, icon: Icon }) => {
            const active = activeNav === key;
            const badgeCount =
              key === 'support' && openTicketsCount > 0
                ? openTicketsCount
                : key === 'payments' && pendingPaymentsCount > 0
                ? pendingPaymentsCount
                : null;

            return (
              <button
                key={key}
                type="button"
                onClick={() => navigateTo(key)}
                title={collapsed ? t.nav[key] : undefined}
                className={`relative flex w-full items-center rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  collapsed ? 'justify-center px-2 py-2.5' : 'justify-between gap-2 px-3 py-2.5'
                } ${
                  active
                    ? 'bg-[#DF4416] text-white shadow-sm'
                    : 'text-white/95 hover:bg-[#0A4E4C] hover:text-white'
                }`}
              >
                <span className={`flex items-center min-w-0 ${collapsed ? '' : 'gap-2.5'}`}>
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-[#6EE7B7]'}`} />
                  {!collapsed && <span className="truncate">{t.nav[key]}</span>}
                </span>

                {!collapsed && badgeCount !== null && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                      active ? 'bg-white/25 text-white' : 'bg-[#DF4416] text-white'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}

                {collapsed && badgeCount !== null && (
                  <span className="absolute top-1.5 end-1.5 h-2 w-2 rounded-full bg-[#DF4416] ring-2 ring-[#053332]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile Summary (language switcher removed from sidebar per user request) */}
        <div className="border-t border-white/15 p-3">
          <button
            type="button"
            onClick={() => navigateTo('settings')}
            title={adminName}
            className={`flex w-full items-center rounded-lg p-1.5 transition-colors hover:bg-[#0A4E4C] ${
              collapsed ? 'justify-center' : 'gap-2.5 text-start'
            }`}
          >
            {!avatarFailed ? (
              <img
                src={ADMIN_AVATAR_SRC}
                alt={adminName}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="h-8 w-8 rounded-full object-cover shrink-0 ring-2 ring-[#DF4416]"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DF4416] text-xs font-bold text-white">
                {t.common.brandInitials}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{adminName}</p>
                <p className="text-[10px] text-[#A7F3D0] truncate font-mono">{settings.adminEmail}</p>
              </div>
            )}
          </button>
        </div>
      </div>
    );
  };

  const categoryLabel = (cat: SearchHit['category']) => {
    switch (cat) {
      case 'agency':
        return t.nav.agencies;
      case 'user':
        return t.nav.users;
      case 'payment':
        return t.nav.payments;
      case 'ticket':
        return t.nav.support;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#000000] flex">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:block lg:shrink-0 border-e border-[#0A4E4C] transition-[width] duration-200 no-print ${
          sidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[260px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderSidebar(false)}</div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden no-print">
          <div
            className="fixed inset-0 bg-[#053332]/60 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[268px] max-w-[84vw] h-full shadow-2xl">
            {renderSidebar(true)}
          </div>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#BAC7C5] bg-white px-4 sm:px-6 no-print">
          {/* Start: Menu Button + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-[#BAC7C5] bg-[#EFF3F2] p-2 text-[#000000] hover:bg-[#E1E9E7] lg:hidden"
              aria-label={t.common.openMenu}
            >
              <Menu className="h-4 w-4" />
            </button>

            <nav aria-label={t.common.breadcrumb} className="flex items-center gap-1.5 text-xs text-[#000000] min-w-0">
              <button
                type="button"
                onClick={() => navigateTo('overview')}
                className="font-black text-[#000000] hover:text-[#DF4416] whitespace-nowrap"
              >
                {platformName}
              </button>
              <span className="text-[#DF4416]" aria-hidden="true">
                {lang === 'ar' ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (activeNav === 'agencies' && selectedAgency) {
                    setSelectedAgencyId(null);
                  }
                }}
                className={`truncate ${
                  selectedAgency && activeNav === 'agencies'
                    ? 'font-bold text-[#111827] hover:text-[#000000]'
                    : 'rounded-md border border-[#BAC7C5] bg-[#EFF3F2] px-2.5 py-0.5 font-extrabold text-[#000000]'
                }`}
              >
                {t.nav[activeNav]}
              </button>
              {activeNav === 'agencies' && selectedAgency && (
                <>
                  <span className="text-[#DF4416]" aria-hidden="true">
                    {lang === 'ar' ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </span>
                  <span className="rounded-md border border-[#C2410C] bg-[#FED7AA] px-2.5 py-0.5 font-extrabold text-[#000000] truncate max-w-[180px]">
                    {getLocalized(selectedAgency.name, lang)}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Center: Working Global Search */}
          <div ref={searchRef} className="relative hidden md:block w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 start-3 h-3.5 w-3.5 -translate-y-1/2 text-[#000000]" />
            <input
              type="text"
              value={globalQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setGlobalQuery(e.target.value);
                setSearchFocused(true);
              }}
              placeholder={t.common.globalSearchPlaceholder}
              className="ibonda-input py-2 ps-9 pe-8"
            />
            {globalQuery && (
              <button
                type="button"
                onClick={() => setGlobalQuery('')}
                className="absolute top-1/2 end-2.5 -translate-y-1/2 rounded p-0.5 text-[#000000] hover:bg-[#EFF3F2]"
                aria-label={t.common.clearSearch}
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {searchFocused && globalQuery.trim().length > 0 && (
              <div className="absolute top-full mt-1.5 inset-x-0 z-50 overflow-hidden rounded-xl border border-[#BAC7C5] bg-white shadow-xl">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs font-semibold text-[#111827]">
                    {t.common.noSearchResults}
                  </div>
                ) : (
                  <div className="max-h-80 divide-y divide-[#E5EEED] overflow-y-auto">
                    {searchResults.map((hit) => (
                      <button
                        key={hit.id}
                        type="button"
                        onClick={hit.onSelect}
                        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start transition-colors hover:bg-[#EFF3F2]"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-[#000000] truncate">{hit.title}</p>
                          <p className="text-[11px] font-medium text-[#111827] truncate">{hit.subtitle}</p>
                        </div>
                        <span className="shrink-0 rounded-md border border-[#BAC7C5] bg-[#EFF3F2] px-2 py-0.5 text-[10px] font-extrabold text-[#000000]">
                          {categoryLabel(hit.category)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* End: Notifications Popover + Language Switcher + Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Notifications Bell Popover */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifPopoverOpen((v) => !v);
                  setProfileMenuOpen(false);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#BAC7C5] bg-[#EFF3F2] text-[#000000] transition-colors hover:border-[#DF4416] hover:bg-[#FFEDD5]"
                aria-label={t.nav.notifications}
                title={t.nav.notifications}
              >
                <Bell className="h-4 w-4 text-[#000000]" />
                {alertTotalCount > 0 && (
                  <span className="absolute -top-1 -end-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DF4416] px-1 font-mono text-[10px] font-bold text-white shadow-xs">
                    {alertTotalCount}
                  </span>
                )}
              </button>

              {notifPopoverOpen && (
                <div className="absolute end-0 top-full mt-2 z-50 w-80 overflow-hidden rounded-xl border border-[#BAC7C5] bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#BAC7C5] bg-[#EFF3F2] px-4 py-3">
                    <span className="text-xs font-extrabold text-[#000000]">{t.nav.notifications}</span>
                    {alertTotalCount > 0 && (
                      <span className="rounded-md bg-[#DF4416] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                        {alertTotalCount}
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 divide-y divide-[#E5EEED] overflow-y-auto">
                    {expiringTrials.map((sub) => {
                      const ag = agencies.find((a) => a.id === sub.agencyId);
                      const d = diffDaysFromToday(sub.endDate);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => navigateTo('subscriptions')}
                          className="flex w-full items-start gap-2.5 px-4 py-3 text-start transition-colors hover:bg-[#EFF3F2]"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#DF4416]" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#000000] truncate">
                              {t.subscriptions.trialAlertExpiring}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium text-[#111827] truncate">
                              {ag ? getLocalized(ag.name, lang) : ''} · {d} {t.common.days} {t.common.daysLeft}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                    {notifications.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo('notifications')}
                        className="flex w-full items-start gap-2.5 px-4 py-3 text-start transition-colors hover:bg-[#EFF3F2]"
                      >
                        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[#053332]" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#000000] truncate">
                            {getLocalized(item.title, lang)}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium text-[#111827] line-clamp-1">
                            {getLocalized(item.content, lang)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#BAC7C5] bg-[#EFF3F2] px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => navigateTo('notifications')}
                      className="w-full text-center text-xs font-extrabold text-[#DF4416] hover:underline"
                    >
                      {t.nav.notifications}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Top Header Language Switcher */}
            <div className="flex items-center gap-0.5 rounded-lg border border-[#BAC7C5] bg-[#EFF3F2] p-1">
              <Globe className="mx-1 h-3.5 w-3.5 text-[#000000] hidden sm:block" />
              {(['ar', 'fr', 'en'] as Language[])
                .filter((l) => settings.enabledLanguages.includes(l))
                .map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`rounded-md px-2 py-1 text-[11px] font-extrabold transition-colors whitespace-nowrap ${
                      lang === l
                        ? 'bg-[#DF4416] text-white shadow-xs'
                        : 'text-[#000000] hover:bg-white'
                    }`}
                  >
                    {t.common.langShort[l]}
                  </button>
                ))}
            </div>

            {/* Admin Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((v) => !v);
                  setNotifPopoverOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-[#BAC7C5] bg-[#EFF3F2] px-2 py-1.5 text-start transition-colors hover:border-[#DF4416] hover:bg-[#FFEDD5]"
              >
                {!avatarFailed ? (
                  <img
                    src={ADMIN_AVATAR_SRC}
                    alt={adminName}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                    className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-[#053332]/60"
                  />
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#053332] text-[10px] font-bold text-white">
                    {t.common.brandInitials}
                  </div>
                )}
                <span className="hidden xl:block text-xs font-extrabold text-[#000000] truncate max-w-[130px]">
                  {adminName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#000000] hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute end-0 top-full mt-2 z-50 w-56 overflow-hidden rounded-xl border border-[#BAC7C5] bg-white shadow-xl">
                  <div className="border-b border-[#BAC7C5] bg-[#EFF3F2] px-4 py-3">
                    <p className="text-xs font-extrabold text-[#000000] truncate">{adminName}</p>
                    <p className="mt-0.5 text-[11px] font-mono font-semibold text-[#111827] truncate">{settings.adminEmail}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => navigateTo('settings')}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#000000] hover:bg-[#EFF3F2]"
                    >
                      <User className="h-3.5 w-3.5 text-[#DF4416]" />
                      {t.settings.tabAccount}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('settings')}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#000000] hover:bg-[#EFF3F2]"
                    >
                      <Settings className="h-3.5 w-3.5 text-[#053332]" />
                      {t.nav.settings}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('analytics')}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#000000] hover:bg-[#EFF3F2]"
                    >
                      <BarChart3 className="h-3.5 w-3.5 text-[#053332]" />
                      {t.nav.analytics}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Honest Demo Mode Strip */}
        <div className="border-b border-[#BAC7C5] bg-[#F7F9F8] px-4 py-2 text-[11px] font-bold text-[#111827] sm:px-6 no-print">
          {t.common.demoBannerText}
        </div>

        {/* Active View Viewport */}
        <main className="flex-1 bg-white p-4 sm:p-6">
          <div key={activeNav} className="mx-auto max-w-[1400px]">
            {renderView()}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <IbondaProvider>
      <DashboardShell />
    </IbondaProvider>
  );
}
