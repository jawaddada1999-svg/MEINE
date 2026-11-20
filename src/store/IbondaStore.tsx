import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  initialActivityLogs,
  initialAgencies,
  initialFeatures,
  initialNotifications,
  initialPayments,
  initialPlans,
  initialSettings,
  initialSubscriptions,
  initialTickets,
  initialUsers,
  REFERENCE_TODAY,
} from '../data/seedData';
import { translations, TranslationDictionary } from '../i18n/translations';
import {
  ActivityLogItem,
  Agency,
  AgencyBranding,
  AgencyStatus,
  AgencyUser,
  Language,
  LocalizedField,
  NavSection,
  NotificationItem,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Plan,
  PlanFeature,
  PlatformSettings,
  Subscription,
  SupportTicket,
  TicketPriority,
  TicketStatus,
  TicketType,
  ToastMessage,
  UserRole,
} from '../types/ibonda';
import {
  addDaysToIso,
  diffDaysFromToday,
  downloadJsonFile,
  formatCurrency,
  getLocalized,
  nowTimestamp,
} from '../utils/formatters';

const STORAGE_KEY = 'ibonda_admin_state_v4';
const LANG_KEY = 'ibonda_lang_v1';

interface PersistedState {
  agencies: Agency[];
  subscriptions: Subscription[];
  plans: Plan[];
  features: PlanFeature[];
  payments: Payment[];
  users: AgencyUser[];
  tickets: SupportTicket[];
  notifications: NotificationItem[];
  activities: ActivityLogItem[];
  settings: PlatformSettings;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.agencies) && Array.isArray(parsed.plans)) {
        return parsed;
      }
    }
  } catch {
    // Fall back to seed data
  }
  return {
    agencies: initialAgencies,
    subscriptions: initialSubscriptions,
    plans: initialPlans,
    features: initialFeatures,
    payments: initialPayments,
    users: initialUsers,
    tickets: initialTickets,
    notifications: initialNotifications,
    activities: initialActivityLogs,
    settings: initialSettings,
  };
}

function loadInitialLang(): Language {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'ar' || stored === 'fr' || stored === 'en') {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'ar';
}

export interface AddAgencyInput {
  name: string;
  nameAr?: string;
  nameFr?: string;
  nameEn?: string;
  logoColor: string;
  city: string;
  cityAr?: string;
  cityFr?: string;
  cityEn?: string;
  address: string;
  addressAr?: string;
  addressFr?: string;
  addressEn?: string;
  phone: string;
  email: string;
  managerName: string;
  managerNameAr?: string;
  managerNameFr?: string;
  managerNameEn?: string;
  managerEmail: string;
  managerPhone: string;
  planId: string;
  startDate: string;
  durationDays: number;
  initialStatus: AgencyStatus;
  adminNotes: string;
}

interface IbondaContextValue extends PersistedState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
  activeNav: NavSection;
  setActiveNav: (nav: NavSection) => void;
  selectedAgencyId: string | null;
  setSelectedAgencyId: (id: string | null) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  notifyToast: (type: ToastMessage['type'], text: string) => void;

  // Agency operations
  addAgency: (input: AddAgencyInput) => { ok: boolean; error?: string };
  updateAgency: (id: string, patch: Partial<Agency>) => void;
  updateAgencyStatus: (agencyId: string, nextStatus: AgencyStatus) => void;
  updateAgencyBranding: (agencyId: string, branding: AgencyBranding) => void;
  resetAgencyBranding: (agencyId: string) => void;
  suspendAgency: (agencyId: string) => void;
  activateAgency: (agencyId: string) => void;
  cancelAgencySubscription: (agencyId: string) => void;

  // Subscription operations
  createSubscription: (input: {
    agencyId: string;
    planId: string;
    startDate: string;
    isTrial: boolean;
    status: AgencyStatus;
  }) => void;
  changeSubscriptionPlan: (subId: string, newPlanId: string) => void;
  extendSubscription: (subId: string, extraDays: number) => void;
  renewSubscription: (subId: string) => void;
  convertTrialToPaid: (subId: string, planId: string, method: PaymentMethod, confirmPaymentNow: boolean) => void;
  suspendSubscription: (subId: string) => void;
  cancelSubscription: (subId: string) => void;
  activateSubscriptionAfterPayment: (subId: string, method: PaymentMethod) => void;
  runExpiryCheck: () => number;

  // Plans & Features operations
  savePlan: (plan: Omit<Plan, 'id' | 'createdAt'> & { id?: string }) => void;
  togglePlanActive: (planId: string) => void;
  saveFeature: (feature: Omit<PlanFeature, 'id'> & { id?: string }) => void;
  deleteFeature: (featureId: string) => void;

  // Payments operations
  recordPayment: (input: {
    agencyId: string;
    subscriptionId: string;
    amount: number;
    method: PaymentMethod;
    transactionRef: string;
    paymentDate: string;
    dueDate: string;
    notes: string;
  }) => void;
  confirmPayment: (paymentId: string) => void;
  markPaymentOverdue: (paymentId: string) => void;
  refundPayment: (paymentId: string) => void;
  updatePaymentStatus: (paymentId: string, nextStatus: PaymentStatus) => void;

  // Users operations
  inviteUser: (input: {
    fullName: string;
    email: string;
    phone: string;
    agencyId: string;
    role: UserRole;
  }) => { ok: boolean; error?: string };
  toggleUserStatus: (userId: string) => void;
  resendUserInvite: (userId: string) => void;
  triggerUserPasswordReset: (userId: string) => void;

  // Support operations
  createTicket: (input: {
    agencyId: string;
    subject: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
  }) => void;
  addTicketMessage: (ticketId: string, body: string, isInternalNote: boolean) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicketPriority: (ticketId: string, priority: TicketPriority) => void;

  // Notifications operations
  saveNotification: (
    input: Omit<NotificationItem, 'id' | 'createdAt' | 'status'> & { id?: string },
    dispatchNow: boolean
  ) => void;
  dispatchExistingNotification: (id: string) => void;

  // Settings & System operations
  updateSettings: (patch: Partial<PlatformSettings>) => void;
  exportBackup: () => void;
  resetDemoData: () => void;
}

const IbondaContext = createContext<IbondaContextValue | null>(null);

const ADMIN_CONSOLE_LABEL: LocalizedField = {
  ar: 'لوحة الإدارة',
  fr: 'Console d’Administration',
  en: 'Admin Console',
};

const ADMIN_ACTION_LABEL: LocalizedField = {
  ar: 'إجراء إداري',
  fr: 'Action administrative',
  en: 'Admin Action',
};

const REQUIRES_EMAIL_BACKEND_LABEL: LocalizedField = {
  ar: 'يتطلب خادم البريد الإلكتروني',
  fr: 'Serveur courriel requis',
  en: 'Requires Email Backend',
};

const REQUIRES_AUTH_BACKEND_LABEL: LocalizedField = {
  ar: 'يتطلب خادم المصادقة',
  fr: 'Serveur d’authentification requis',
  en: 'Requires Auth Backend',
};

export function IbondaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [lang, setLangState] = useState<Language>(loadInitialLang);
  const [activeNav, setActiveNav] = useState<NavSection>('overview');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `${t.common.appTitle} — ${t.common.adminConsole}`;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, t]);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const notifyToast = (type: ToastMessage['type'], text: string) => {
    const id = `tst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  };

  const makeActivity = (
    type: ActivityLogItem['type'],
    message: ActivityLogItem['message'],
    agencyId?: string,
    entityId?: string
  ): ActivityLogItem => ({
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    agencyId,
    entityId,
    message,
    actor: state.settings.adminName,
    timestamp: nowTimestamp(),
  });

  const addAgency = (input: AddAgencyInput): { ok: boolean; error?: string } => {
    const emailExists = state.users.some(
      (u) => u.email.toLowerCase() === input.managerEmail.trim().toLowerCase()
    );
    if (emailExists) {
      return { ok: false, error: t.users.duplicateEmailError };
    }

    const plan = state.plans.find((p) => p.id === input.planId) || state.plans[0];
    const isTrial = input.initialStatus === 'free_trial';
    const effectiveDays = isTrial ? state.settings.trialDurationDays : Math.max(1, input.durationDays);
    const endDate = addDaysToIso(input.startDate, effectiveDays);

    const makeInitials = (text: string, fallback: string) =>
      text
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || '')
        .join('') || fallback;

    const agencyId = `ag_${Date.now()}`;
    const subId = `sub_${Date.now()}`;
    const userId = `usr_${Date.now()}`;

    const baseName = input.name.trim() || input.nameAr?.trim() || input.nameFr?.trim() || input.nameEn?.trim() || '';
    const nameField: LocalizedField = {
      ar: input.nameAr?.trim() || (lang === 'ar' ? baseName : '') || baseName,
      fr: input.nameFr?.trim() || (lang === 'fr' ? baseName : '') || baseName,
      en: input.nameEn?.trim() || (lang === 'en' ? baseName : '') || baseName,
    };

    const baseCity = input.city.trim() || input.cityAr?.trim() || input.cityFr?.trim() || input.cityEn?.trim() || '';
    const cityField: LocalizedField = {
      ar: input.cityAr?.trim() || (lang === 'ar' ? baseCity : '') || baseCity,
      fr: input.cityFr?.trim() || (lang === 'fr' ? baseCity : '') || baseCity,
      en: input.cityEn?.trim() || (lang === 'en' ? baseCity : '') || baseCity,
    };

    const baseAddress = input.address.trim() || input.addressAr?.trim() || input.addressFr?.trim() || input.addressEn?.trim() || '';
    const addressField: LocalizedField = {
      ar: input.addressAr?.trim() || baseAddress,
      fr: input.addressFr?.trim() || baseAddress,
      en: input.addressEn?.trim() || baseAddress,
    };

    const baseMgr = input.managerName.trim() || input.managerNameAr?.trim() || input.managerNameFr?.trim() || input.managerNameEn?.trim() || '';
    const managerField: LocalizedField = {
      ar: input.managerNameAr?.trim() || (lang === 'ar' ? baseMgr : '') || baseMgr,
      fr: input.managerNameFr?.trim() || (lang === 'fr' ? baseMgr : '') || baseMgr,
      en: input.managerNameEn?.trim() || (lang === 'en' ? baseMgr : '') || baseMgr,
    };

    const notesStr = input.adminNotes.trim();
    const notesField: LocalizedField = {
      ar: notesStr,
      fr: notesStr,
      en: notesStr,
    };

    const initialsField: LocalizedField = {
      ar: makeInitials(nameField.ar, translations.ar.common.brandInitials),
      fr: makeInitials(nameField.fr, translations.fr.common.brandInitials),
      en: makeInitials(nameField.en, translations.en.common.brandInitials),
    };

    const newAgency: Agency = {
      id: agencyId,
      name: nameField,
      logoColor: input.logoColor || '#053332',
      logoInitials: initialsField,
      city: cityField,
      address: addressField,
      phone: input.phone.trim(),
      email: input.email.trim(),
      managerName: managerField,
      managerEmail: input.managerEmail.trim(),
      managerPhone: input.managerPhone.trim(),
      currentPlanId: plan.id,
      status: input.initialStatus,
      subscriptionStart: input.startDate,
      subscriptionEnd: endDate,
      propertiesCount: 0,
      adminNotes: notesField,
      integrations: [
        { provider: 'meta_ads', status: 'not_connected' },
        { provider: 'instagram', status: 'not_connected' },
        { provider: 'whatsapp_business', status: 'not_connected' },
        { provider: 'google_sheets', status: 'not_connected' },
        { provider: 'automation_webhooks', status: 'not_connected' },
      ],
      createdAt: REFERENCE_TODAY,
    };

    const newSub: Subscription = {
      id: subId,
      agencyId,
      planId: plan.id,
      startDate: input.startDate,
      endDate,
      price: isTrial ? 0 : plan.price,
      isTrial,
      trialConverted: false,
      paymentStatus: input.initialStatus === 'active' ? 'paid' : 'pending',
      status: input.initialStatus,
      autoRenew: false,
      history: [],
      createdAt: REFERENCE_TODAY,
    };

    const newUser: AgencyUser = {
      id: userId,
      fullName: managerField,
      email: input.managerEmail.trim(),
      phone: input.managerPhone.trim(),
      agencyId,
      role: 'agency_owner',
      status: 'invited',
      lastLogin: null,
      invitedAt: REFERENCE_TODAY,
      activityLog: [
        {
          id: `ua_${Date.now()}`,
          action: {
            ar: 'إنشاء حساب مدير الوكالة وإصدار دعوة الدخول',
            fr: 'Création du compte directeur et envoi de l’invitation',
            en: 'Created agency owner account and issued invitation',
          },
          timestamp: nowTimestamp(),
          ipNote: ADMIN_CONSOLE_LABEL,
        },
      ],
    };

    const newPayments: Payment[] =
      !isTrial && (input.initialStatus === 'pending_payment' || input.initialStatus === 'active')
        ? [
            {
              id: `pay_${Date.now()}`,
              transactionRef: `IBN-${new Date().getFullYear()}-${String(state.payments.length + 1104)}`,
              agencyId,
              subscriptionId: subId,
              planId: plan.id,
              amount: plan.price,
              paymentDate: input.initialStatus === 'active' ? REFERENCE_TODAY : '',
              dueDate: addDaysToIso(input.startDate, 7),
              method: 'bank_transfer',
              status: input.initialStatus === 'active' ? 'paid' : 'pending',
              notes: {
                ar: 'فاتورة التسجيل الأولي',
                fr: 'Facture d’inscription initiale',
                en: 'Initial subscription invoice',
              },
              confirmedBy: input.initialStatus === 'active' ? state.settings.adminName : undefined,
              confirmedAt: input.initialStatus === 'active' ? REFERENCE_TODAY : undefined,
              createdAt: REFERENCE_TODAY,
            },
          ]
        : [];

    const act = makeActivity(
      'agency_added',
      {
        ar: `تمت إضافة وكالة ${nameField.ar} (${translations.ar.agencyStatus[newAgency.status]})`,
        fr: `Agence ${nameField.fr} ajoutée (${translations.fr.agencyStatus[newAgency.status]})`,
        en: `Added agency ${nameField.en} (${translations.en.agencyStatus[newAgency.status]})`,
      },
      agencyId,
      subId
    );

    setState((prev) => ({
      ...prev,
      agencies: [newAgency, ...prev.agencies],
      subscriptions: [newSub, ...prev.subscriptions],
      users: [newUser, ...prev.users],
      payments: [...newPayments, ...prev.payments],
      activities: [act, ...prev.activities],
    }));

    notifyToast('success', t.toasts.agencyAdded);
    return { ok: true };
  };

  const updateAgency = (id: string, patch: Partial<Agency>) => {
    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
    notifyToast('success', t.toasts.agencyUpdated);
  };

  const updateAgencyStatus = (agencyId: string, nextStatus: AgencyStatus) => {
    const agency = state.agencies.find((a) => a.id === agencyId);
    if (!agency || agency.status === nextStatus) return;

    const act = makeActivity(
      nextStatus === 'suspended'
        ? 'agency_suspended'
        : nextStatus === 'cancelled'
        ? 'agency_cancelled'
        : 'subscription_activated',
      {
        ar: `تم تغيير حالة وكالة ${getLocalized(agency.name, 'ar')} إلى ${translations.ar.agencyStatus[nextStatus]}`,
        fr: `Statut de ${getLocalized(agency.name, 'fr')} modifié vers ${translations.fr.agencyStatus[nextStatus]}`,
        en: `Updated ${getLocalized(agency.name, 'en')} status to ${translations.en.agencyStatus[nextStatus]}`,
      },
      agencyId
    );

    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) => (a.id === agencyId ? { ...a, status: nextStatus } : a)),
      subscriptions: prev.subscriptions.map((s) =>
        s.agencyId === agencyId
          ? {
              ...s,
              status: nextStatus,
              isTrial: nextStatus === 'free_trial' ? true : nextStatus === 'active' ? false : s.isTrial,
            }
          : s
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.agencyStatusUpdated);
  };

  const updateAgencyBranding = (agencyId: string, branding: AgencyBranding) => {
    const agency = state.agencies.find((a) => a.id === agencyId);
    if (!agency) return;
    const act = makeActivity(
      'settings_updated',
      {
        ar: `تم تخصيص الهوية البصرية لوكالة ${getLocalized(agency.name, 'ar')}`,
        fr: `Identité visuelle mise à jour pour ${getLocalized(agency.name, 'fr')}`,
        en: `Updated white-label branding for ${getLocalized(agency.name, 'en')}`,
      },
      agencyId
    );
    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) =>
        a.id === agencyId
          ? { ...a, branding, logoColor: branding.primaryColor || a.logoColor }
          : a
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.brandingSaved);
  };

  const resetAgencyBranding = (agencyId: string) => {
    const agency = state.agencies.find((a) => a.id === agencyId);
    if (!agency) return;
    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) =>
        a.id === agencyId
          ? {
              ...a,
              logoColor: '#053332',
              branding: {
                displayName: a.name,
                primaryColor: '#053332',
                secondaryColor: '#DF4416',
                accentColor: '#0D7A72',
              },
            }
          : a
      ),
    }));
    notifyToast('info', t.toasts.brandingReset);
  };

  const syncAgencyStatusFromSub = (
    agencies: Agency[],
    agencyId: string,
    status: AgencyStatus,
    planId?: string,
    startDate?: string,
    endDate?: string
  ) =>
    agencies.map((a) =>
      a.id === agencyId
        ? {
            ...a,
            status,
            currentPlanId: planId ?? a.currentPlanId,
            subscriptionStart: startDate ?? a.subscriptionStart,
            subscriptionEnd: endDate ?? a.subscriptionEnd,
          }
        : a
    );

  const suspendAgency = (agencyId: string) => {
    const agency = state.agencies.find((a) => a.id === agencyId);
    if (!agency) return;
    const act = makeActivity(
      'agency_suspended',
      {
        ar: `تم إيقاف وكالة ${getLocalized(agency.name, 'ar')} مؤقتاً`,
        fr: `Agence ${getLocalized(agency.name, 'fr')} suspendue`,
        en: `Suspended agency ${getLocalized(agency.name, 'en')}`,
      },
      agencyId
    );
    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) => (a.id === agencyId ? { ...a, status: 'suspended' } : a)),
      subscriptions: prev.subscriptions.map((s) =>
        s.agencyId === agencyId && s.status !== 'cancelled' ? { ...s, status: 'suspended' } : s
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('info', t.toasts.agencySuspended);
  };

  const activateAgency = (agencyId: string) => {
    const agency = state.agencies.find((a) => a.id === agencyId);
    if (!agency) return;
    const sub = state.subscriptions.find((s) => s.agencyId === agencyId);
    const nextStatus: AgencyStatus = sub?.isTrial ? 'free_trial' : 'active';
    const act = makeActivity(
      'subscription_activated',
      {
        ar: `تم تفعيل وكالة ${getLocalized(agency.name, 'ar')}`,
        fr: `Agence ${getLocalized(agency.name, 'fr')} activée`,
        en: `Activated agency ${getLocalized(agency.name, 'en')}`,
      },
      agencyId
    );
    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) => (a.id === agencyId ? { ...a, status: nextStatus } : a)),
      subscriptions: prev.subscriptions.map((s) =>
        s.agencyId === agencyId ? { ...s, status: nextStatus } : s
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.agencyActivated);
  };

  const cancelAgencySubscription = (agencyId: string) => {
    const agency = state.agencies.find((a) => a.id === agencyId);
    if (!agency) return;
    const act = makeActivity(
      'agency_cancelled',
      {
        ar: `تم إلغاء اشتراك وكالة ${getLocalized(agency.name, 'ar')}`,
        fr: `Abonnement annulé pour ${getLocalized(agency.name, 'fr')}`,
        en: `Cancelled subscription for ${getLocalized(agency.name, 'en')}`,
      },
      agencyId
    );
    setState((prev) => ({
      ...prev,
      agencies: prev.agencies.map((a) => (a.id === agencyId ? { ...a, status: 'cancelled' } : a)),
      subscriptions: prev.subscriptions.map((s) =>
        s.agencyId === agencyId ? { ...s, status: 'cancelled', autoRenew: false } : s
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('info', t.toasts.subCancelled);
  };

  const createSubscription = (input: {
    agencyId: string;
    planId: string;
    startDate: string;
    isTrial: boolean;
    status: AgencyStatus;
  }) => {
    const plan = state.plans.find((p) => p.id === input.planId);
    const agency = state.agencies.find((a) => a.id === input.agencyId);
    if (!plan || !agency) return;
    const days = input.isTrial ? state.settings.trialDurationDays : plan.durationDays;
    const endDate = addDaysToIso(input.startDate, days);
    const effectiveStatus: AgencyStatus = input.isTrial ? 'free_trial' : input.status;

    const existingSub = state.subscriptions.find((s) => s.agencyId === input.agencyId);
    const historyEntry = existingSub
      ? {
          id: `sh_${Date.now()}`,
          planId: existingSub.planId,
          planName: state.plans.find((p) => p.id === existingSub.planId)?.name || plan.name,
          startDate: existingSub.startDate,
          endDate: existingSub.endDate,
          status: existingSub.status,
          price: existingSub.price,
          note: {
            ar: 'تم الاستبدال باشتراك جديد',
            fr: 'Remplacé par un nouvel abonnement',
            en: 'Replaced by new subscription',
          },
          recordedAt: REFERENCE_TODAY,
        }
      : null;

    const newSubId = `sub_${Date.now()}`;
    const newSub: Subscription = {
      id: newSubId,
      agencyId: input.agencyId,
      planId: plan.id,
      startDate: input.startDate,
      endDate,
      price: input.isTrial ? 0 : plan.price,
      isTrial: input.isTrial,
      trialConverted: false,
      paymentStatus: effectiveStatus === 'active' ? 'paid' : 'pending',
      status: effectiveStatus,
      autoRenew: false,
      history: existingSub
        ? [...(existingSub.history || []), ...(historyEntry ? [historyEntry] : [])]
        : [],
      createdAt: REFERENCE_TODAY,
    };

    const act = makeActivity(
      'subscription_activated',
      {
        ar: `تم إنشاء اشتراك جديد (${plan.name.ar}) لوكالة ${getLocalized(agency.name, 'ar')}`,
        fr: `Nouvel abonnement (${plan.name.fr}) créé pour ${getLocalized(agency.name, 'fr')}`,
        en: `Created new subscription (${plan.name.en}) for ${getLocalized(agency.name, 'en')}`,
      },
      agency.id,
      newSubId
    );

    setState((prev) => ({
      ...prev,
      subscriptions: [
        newSub,
        ...prev.subscriptions.filter((s) => s.agencyId !== input.agencyId),
      ],
      agencies: syncAgencyStatusFromSub(
        prev.agencies,
        input.agencyId,
        effectiveStatus,
        plan.id,
        input.startDate,
        endDate
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.subCreated);
  };

  const changeSubscriptionPlan = (subId: string, newPlanId: string) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    const plan = state.plans.find((p) => p.id === newPlanId);
    if (!sub || !plan) return;
    const agency = state.agencies.find((a) => a.id === sub.agencyId);
    const prevPlan = state.plans.find((p) => p.id === sub.planId);

    const historyEntry = {
      id: `sh_${Date.now()}`,
      planId: sub.planId,
      planName: prevPlan?.name || plan.name,
      startDate: sub.startDate,
      endDate: REFERENCE_TODAY,
      status: sub.status,
      price: sub.price,
      note: {
        ar: `تغيير الباقة إلى ${plan.name.ar}`,
        fr: `Changement d’offre vers ${plan.name.fr}`,
        en: `Changed plan to ${plan.name.en}`,
      },
      recordedAt: REFERENCE_TODAY,
    };

    const act = makeActivity(
      'plan_updated',
      {
        ar: `تم تغيير باقة ${getLocalized(agency?.name, 'ar')} إلى ${plan.name.ar}`,
        fr: `Offre modifiée pour ${getLocalized(agency?.name, 'fr')} vers ${plan.name.fr}`,
        en: `Changed plan for ${getLocalized(agency?.name, 'en')} to ${plan.name.en}`,
      },
      sub.agencyId,
      subId
    );

    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subId
          ? {
              ...s,
              planId: plan.id,
              price: s.isTrial ? 0 : plan.price,
              history: [historyEntry, ...(s.history || [])],
            }
          : s
      ),
      agencies: prev.agencies.map((a) =>
        a.id === sub.agencyId ? { ...a, currentPlanId: plan.id } : a
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.subPlanChanged);
  };

  const extendSubscription = (subId: string, extraDays: number) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    if (!sub || extraDays <= 0) return;
    const agency = state.agencies.find((a) => a.id === sub.agencyId);
    const newEnd = addDaysToIso(sub.endDate, extraDays);
    const nextStatus: AgencyStatus =
      sub.status === 'expired' ? (sub.isTrial ? 'free_trial' : 'active') : sub.status;

    const act = makeActivity(
      'subscription_extended',
      {
        ar: `تم تمديد اشتراك ${getLocalized(agency?.name, 'ar')} بـ ${extraDays} يوماً`,
        fr: `Abonnement de ${getLocalized(agency?.name, 'fr')} prolongé de ${extraDays} jours`,
        en: `Extended subscription for ${getLocalized(agency?.name, 'en')} by ${extraDays} days`,
      },
      sub.agencyId,
      subId
    );

    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subId ? { ...s, endDate: newEnd, status: nextStatus } : s
      ),
      agencies: syncAgencyStatusFromSub(prev.agencies, sub.agencyId, nextStatus, undefined, undefined, newEnd),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.subExtended);
  };

  const renewSubscription = (subId: string) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    if (!sub) return;
    const plan = state.plans.find((p) => p.id === sub.planId);
    const agency = state.agencies.find((a) => a.id === sub.agencyId);
    if (!plan) return;

    const baseDate = diffDaysFromToday(sub.endDate) > 0 ? sub.endDate : REFERENCE_TODAY;
    const newStart = baseDate;
    const newEnd = addDaysToIso(baseDate, plan.durationDays);

    const historyEntry = {
      id: `sh_${Date.now()}`,
      planId: sub.planId,
      planName: plan.name,
      startDate: sub.startDate,
      endDate: sub.endDate,
      status: sub.status,
      price: sub.price,
      note: {
        ar: 'تجديد الاشتراك — بانتظار تأكيد الأداء',
        fr: 'Renouvellement en attente de confirmation de paiement',
        en: 'Renewed pending payment confirmation',
      },
      recordedAt: REFERENCE_TODAY,
    };

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      transactionRef: `IBN-${new Date().getFullYear()}-${String(state.payments.length + 1104)}`,
      agencyId: sub.agencyId,
      subscriptionId: sub.id,
      planId: plan.id,
      amount: plan.price,
      paymentDate: '',
      dueDate: addDaysToIso(REFERENCE_TODAY, 7),
      method: 'bank_transfer',
      status: 'pending',
      notes: {
        ar: `تجديد باقة ${plan.name.ar}`,
        fr: `Renouvellement ${plan.name.fr}`,
        en: `Renewal of ${plan.name.en} plan`,
      },
      createdAt: REFERENCE_TODAY,
    };

    const act = makeActivity(
      'payment_recorded',
      {
        ar: `تم تجديد اشتراك ${getLocalized(agency?.name, 'ar')} وإصدار فاتورة قيد الانتظار`,
        fr: `Renouvellement créé pour ${getLocalized(agency?.name, 'fr')} (paiement en attente)`,
        en: `Renewed subscription for ${getLocalized(agency?.name, 'en')} (payment pending confirmation)`,
      },
      sub.agencyId,
      sub.id
    );

    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subId
          ? {
              ...s,
              startDate: newStart,
              endDate: newEnd,
              price: plan.price,
              isTrial: false,
              paymentStatus: 'pending',
              status: 'pending_payment',
              history: [historyEntry, ...(s.history || [])],
            }
          : s
      ),
      agencies: syncAgencyStatusFromSub(
        prev.agencies,
        sub.agencyId,
        'pending_payment',
        plan.id,
        newStart,
        newEnd
      ),
      payments: [newPayment, ...prev.payments],
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.subRenewed);
  };

  const convertTrialToPaid = (
    subId: string,
    planId: string,
    method: PaymentMethod,
    confirmPaymentNow: boolean
  ) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    const plan = state.plans.find((p) => p.id === planId);
    if (!sub || !plan) return;
    const agency = state.agencies.find((a) => a.id === sub.agencyId);

    const newStart = REFERENCE_TODAY;
    const newEnd = addDaysToIso(REFERENCE_TODAY, plan.durationDays);
    const nextStatus: AgencyStatus = confirmPaymentNow ? 'active' : 'pending_payment';

    const historyEntry = {
      id: `sh_${Date.now()}`,
      planId: sub.planId,
      planName: state.plans.find((p) => p.id === sub.planId)?.name || plan.name,
      startDate: sub.startDate,
      endDate: sub.endDate,
      status: 'free_trial' as AgencyStatus,
      price: 0,
      note: confirmPaymentNow
        ? {
            ar: 'تم تحويل التجربة بعد تأكيد الأداء',
            fr: 'Essai converti après confirmation du paiement',
            en: 'Trial converted after payment confirmation',
          }
        : {
            ar: 'تم تحويل التجربة — بانتظار تأكيد الأداء',
            fr: 'Essai converti — en attente de confirmation de paiement',
            en: 'Trial converted — awaiting payment confirmation',
          },
      recordedAt: REFERENCE_TODAY,
    };

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      transactionRef: `IBN-${new Date().getFullYear()}-${String(state.payments.length + 1104)}`,
      agencyId: sub.agencyId,
      subscriptionId: sub.id,
      planId: plan.id,
      amount: plan.price,
      paymentDate: confirmPaymentNow ? REFERENCE_TODAY : '',
      dueDate: addDaysToIso(REFERENCE_TODAY, 5),
      method,
      status: confirmPaymentNow ? 'paid' : 'pending',
      notes: {
        ar: 'تحويل من الفترة التجريبية المجانية',
        fr: 'Conversion depuis l’essai gratuit',
        en: 'Conversion from free trial',
      },
      confirmedBy: confirmPaymentNow ? state.settings.adminName : undefined,
      confirmedAt: confirmPaymentNow ? REFERENCE_TODAY : undefined,
      createdAt: REFERENCE_TODAY,
    };

    const act = makeActivity(
      confirmPaymentNow ? 'payment_confirmed' : 'payment_recorded',
      {
        ar: confirmPaymentNow
          ? `تم تحويل تجربة ${getLocalized(agency?.name, 'ar')} وتأكيد الأداء وتفعيل الباقة`
          : `تم تحويل تجربة ${getLocalized(agency?.name, 'ar')} إلى فاتورة بانتظار الأداء`,
        fr: confirmPaymentNow
          ? `Essai de ${getLocalized(agency?.name, 'fr')} converti et activé après paiement`
          : `Essai de ${getLocalized(agency?.name, 'fr')} converti en attente de paiement`,
        en: confirmPaymentNow
          ? `Converted trial for ${getLocalized(agency?.name, 'en')} and activated after payment confirmation`
          : `Converted trial for ${getLocalized(agency?.name, 'en')} to pending payment invoice`,
      },
      sub.agencyId,
      sub.id
    );

    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subId
          ? {
              ...s,
              planId: plan.id,
              startDate: newStart,
              endDate: newEnd,
              price: plan.price,
              isTrial: false,
              trialConverted: true,
              paymentStatus: confirmPaymentNow ? 'paid' : 'pending',
              status: nextStatus,
              history: [historyEntry, ...(s.history || [])],
            }
          : s
      ),
      agencies: syncAgencyStatusFromSub(prev.agencies, sub.agencyId, nextStatus, plan.id, newStart, newEnd),
      payments: [newPayment, ...prev.payments],
      activities: [act, ...prev.activities],
    }));

    notifyToast('success', confirmPaymentNow ? t.toasts.paymentConfirmed : t.toasts.paymentRecorded);
  };

  const suspendSubscription = (subId: string) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    if (!sub) return;
    suspendAgency(sub.agencyId);
  };

  const cancelSubscription = (subId: string) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    if (!sub) return;
    cancelAgencySubscription(sub.agencyId);
  };

  const activateSubscriptionAfterPayment = (subId: string, method: PaymentMethod) => {
    const sub = state.subscriptions.find((s) => s.id === subId);
    if (!sub) return;
    const pendingPay = state.payments.find(
      (p) => p.subscriptionId === subId && (p.status === 'pending' || p.status === 'overdue')
    );

    if (pendingPay) {
      confirmPayment(pendingPay.id);
      return;
    }

    const plan = state.plans.find((p) => p.id === sub.planId);
    const agency = state.agencies.find((a) => a.id === sub.agencyId);
    const newPay: Payment = {
      id: `pay_${Date.now()}`,
      transactionRef: `IBN-${new Date().getFullYear()}-${String(state.payments.length + 1104)}`,
      agencyId: sub.agencyId,
      subscriptionId: sub.id,
      planId: sub.planId,
      amount: plan?.price ?? sub.price,
      paymentDate: REFERENCE_TODAY,
      dueDate: REFERENCE_TODAY,
      method,
      status: 'paid',
      notes: {
        ar: 'تفعيل الاشتراك بعد تأكيد الأداء',
        fr: 'Activation de l’abonnement après confirmation du paiement',
        en: 'Subscription activated after payment confirmation',
      },
      confirmedBy: state.settings.adminName,
      confirmedAt: REFERENCE_TODAY,
      createdAt: REFERENCE_TODAY,
    };

    const act = makeActivity(
      'payment_confirmed',
      {
        ar: `تم تأكيد الأداء وتفعيل اشتراك ${getLocalized(agency?.name, 'ar')}`,
        fr: `Paiement confirmé et abonnement activé pour ${getLocalized(agency?.name, 'fr')}`,
        en: `Payment confirmed and subscription activated for ${getLocalized(agency?.name, 'en')}`,
      },
      sub.agencyId,
      sub.id
    );

    setState((prev) => ({
      ...prev,
      payments: [newPay, ...prev.payments],
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subId ? { ...s, status: 'active', paymentStatus: 'paid', isTrial: false } : s
      ),
      agencies: syncAgencyStatusFromSub(prev.agencies, sub.agencyId, 'active'),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.subActivated);
  };

  const runExpiryCheck = (): number => {
    let changedCount = 0;
    const newActs: ActivityLogItem[] = [];

    const nextSubs = state.subscriptions.map((sub) => {
      if ((sub.status === 'free_trial' || sub.status === 'active') && diffDaysFromToday(sub.endDate) < 0) {
        changedCount += 1;
        const ag = state.agencies.find((a) => a.id === sub.agencyId);
        newActs.push(
          makeActivity(
            'subscription_expired',
            {
              ar: `انتهت صلاحية اشتراك ${getLocalized(ag?.name, 'ar')} تلقائياً وفق قواعد النظام`,
              fr: `Abonnement expiré automatiquement pour ${getLocalized(ag?.name, 'fr')}`,
              en: `Subscription automatically marked expired for ${getLocalized(ag?.name, 'en')}`,
            },
            sub.agencyId,
            sub.id
          )
        );
        return { ...sub, status: 'expired' as AgencyStatus };
      }
      return sub;
    });

    const expiredAgencyIds = new Set(
      nextSubs.filter((s) => s.status === 'expired').map((s) => s.agencyId)
    );

    setState((prev) => ({
      ...prev,
      subscriptions: nextSubs,
      agencies: prev.agencies.map((a) =>
        expiredAgencyIds.has(a.id) && (a.status === 'free_trial' || a.status === 'active')
          ? { ...a, status: 'expired' }
          : a
      ),
      activities: [...newActs, ...prev.activities],
    }));
    notifyToast('info', `${t.toasts.expiryCheckDone} (${changedCount})`);
    return changedCount;
  };

  const savePlan = (input: Omit<Plan, 'id' | 'createdAt'> & { id?: string }) => {
    if (input.id) {
      setState((prev) => ({
        ...prev,
        plans: prev.plans.map((p) => (p.id === input.id ? { ...p, ...input } : p)),
      }));
    } else {
      const newPlan: Plan = {
        ...input,
        id: `plan_${Date.now()}`,
        createdAt: REFERENCE_TODAY,
      };
      setState((prev) => ({ ...prev, plans: [...prev.plans, newPlan] }));
    }
    notifyToast('success', t.toasts.planSaved);
  };

  const togglePlanActive = (planId: string) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, active: !p.active } : p)),
    }));
    notifyToast('success', t.toasts.planSaved);
  };

  const saveFeature = (input: Omit<PlanFeature, 'id'> & { id?: string }) => {
    if (input.id) {
      setState((prev) => ({
        ...prev,
        features: prev.features.map((f) => (f.id === input.id ? { ...f, ...input } : f)),
      }));
    } else {
      const newFeat: PlanFeature = {
        ...input,
        id: `feat_${Date.now()}`,
      };
      setState((prev) => ({ ...prev, features: [...prev.features, newFeat] }));
    }
    notifyToast('success', t.toasts.featureSaved);
  };

  const deleteFeature = (featureId: string) => {
    setState((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== featureId),
      plans: prev.plans.map((p) => ({
        ...p,
        featureIds: p.featureIds.filter((fid) => fid !== featureId),
      })),
    }));
    notifyToast('info', t.toasts.featureDeleted);
  };

  const recordPayment = (input: {
    agencyId: string;
    subscriptionId: string;
    amount: number;
    method: PaymentMethod;
    transactionRef: string;
    paymentDate: string;
    dueDate: string;
    notes: string;
  }) => {
    const sub = state.subscriptions.find((s) => s.id === input.subscriptionId);
    const agency = state.agencies.find((a) => a.id === input.agencyId);
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      transactionRef: input.transactionRef.trim(),
      agencyId: input.agencyId,
      subscriptionId: input.subscriptionId,
      planId: sub?.planId || agency?.currentPlanId || state.plans[0].id,
      amount: input.amount,
      paymentDate: input.paymentDate,
      dueDate: input.dueDate,
      method: input.method,
      status: 'pending',
      notes: input.notes.trim(),
      createdAt: REFERENCE_TODAY,
    };

    const act = makeActivity(
      'payment_recorded',
      {
        ar: `تم تسجيل عملية أداء قيد الانتظار (${newPayment.transactionRef}) لوكالة ${getLocalized(agency?.name, 'ar')}`,
        fr: `Paiement enregistré en attente (${newPayment.transactionRef}) pour ${getLocalized(agency?.name, 'fr')}`,
        en: `Recorded pending payment (${newPayment.transactionRef}) for ${getLocalized(agency?.name, 'en')}`,
      },
      input.agencyId,
      newPayment.id
    );

    setState((prev) => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
      activities: [act, ...prev.activities],
    }));
    notifyToast('info', t.toasts.paymentRecorded);
  };

  const confirmPayment = (paymentId: string) => {
    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment) return;
    const agency = state.agencies.find((a) => a.id === payment.agencyId);

    const act = makeActivity(
      'payment_confirmed',
      {
        ar: `تم تأكيد الأداء ${payment.transactionRef} (${formatCurrency(payment.amount, state.settings.currency, 'ar')}) لوكالة ${getLocalized(agency?.name, 'ar')}`,
        fr: `Paiement ${payment.transactionRef} confirmé (${formatCurrency(payment.amount, state.settings.currency, 'fr')}) pour ${getLocalized(agency?.name, 'fr')}`,
        en: `Confirmed payment ${payment.transactionRef} (${formatCurrency(payment.amount, state.settings.currency, 'en')}) for ${getLocalized(agency?.name, 'en')}`,
      },
      payment.agencyId,
      payment.id
    );

    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'paid',
              paymentDate: p.paymentDate || REFERENCE_TODAY,
              confirmedBy: prev.settings.adminName,
              confirmedAt: REFERENCE_TODAY,
            }
          : p
      ),
      subscriptions: prev.subscriptions.map((s) =>
        s.id === payment.subscriptionId
          ? {
              ...s,
              paymentStatus: 'paid',
              status:
                s.status === 'pending_payment' || s.status === 'free_trial' || s.status === 'expired'
                  ? 'active'
                  : s.status,
              isTrial: false,
            }
          : s
      ),
      agencies: prev.agencies.map((a) =>
        a.id === payment.agencyId &&
        (a.status === 'pending_payment' || a.status === 'free_trial' || a.status === 'expired')
          ? { ...a, status: 'active' }
          : a
      ),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.paymentConfirmed);
  };

  const markPaymentOverdue = (paymentId: string) => {
    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment) return;
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === paymentId ? { ...p, status: 'overdue' } : p)),
      subscriptions: prev.subscriptions.map((s) =>
        s.id === payment.subscriptionId ? { ...s, paymentStatus: 'overdue' } : s
      ),
    }));
    notifyToast('info', t.toasts.paymentOverdue);
  };

  const refundPayment = (paymentId: string) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === paymentId ? { ...p, status: 'refunded' } : p)),
    }));
    notifyToast('info', t.toasts.paymentRefunded);
  };

  const updatePaymentStatus = (paymentId: string, nextStatus: PaymentStatus) => {
    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment || payment.status === nextStatus) return;
    const agency = state.agencies.find((a) => a.id === payment.agencyId);

    const act = makeActivity(
      nextStatus === 'paid' ? 'payment_confirmed' : 'payment_recorded',
      {
        ar: `تحديث حالة الدفع ${payment.transactionRef} إلى ${translations.ar.paymentStatus[nextStatus]} (${getLocalized(agency?.name, 'ar')})`,
        fr: `Statut du paiement ${payment.transactionRef} changé en ${translations.fr.paymentStatus[nextStatus]} (${getLocalized(agency?.name, 'fr')})`,
        en: `Payment ${payment.transactionRef} status updated to ${translations.en.paymentStatus[nextStatus]} (${getLocalized(agency?.name, 'en')})`,
      },
      payment.agencyId,
      payment.id
    );

    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => {
        if (p.id !== paymentId) return p;
        if (nextStatus === 'paid') {
          return {
            ...p,
            status: 'paid',
            paymentDate: p.paymentDate || REFERENCE_TODAY,
            confirmedBy: prev.settings.adminName,
            confirmedAt: REFERENCE_TODAY,
          };
        }
        return {
          ...p,
          status: nextStatus,
          paymentDate: nextStatus === 'pending' || nextStatus === 'overdue' ? '' : p.paymentDate,
          confirmedBy: undefined,
          confirmedAt: undefined,
        };
      }),
      subscriptions: prev.subscriptions.map((s) => {
        if (s.id !== payment.subscriptionId) return s;
        if (nextStatus === 'paid') {
          return {
            ...s,
            paymentStatus: 'paid',
            status:
              s.status === 'pending_payment' || s.status === 'free_trial' || s.status === 'expired'
                ? 'active'
                : s.status,
            isTrial: false,
          };
        }
        if (nextStatus === 'pending' || nextStatus === 'overdue') {
          return {
            ...s,
            paymentStatus: nextStatus,
            status: s.status === 'active' ? 'pending_payment' : s.status,
          };
        }
        return { ...s, paymentStatus: nextStatus };
      }),
      agencies: prev.agencies.map((a) => {
        if (a.id !== payment.agencyId) return a;
        if (nextStatus === 'paid') {
          return a.status === 'pending_payment' || a.status === 'free_trial' || a.status === 'expired'
            ? { ...a, status: 'active' }
            : a;
        }
        if (nextStatus === 'pending' || nextStatus === 'overdue') {
          return a.status === 'active' ? { ...a, status: 'pending_payment' } : a;
        }
        return a;
      }),
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.paymentStatusUpdated);
  };

  const inviteUser = (input: {
    fullName: string;
    email: string;
    phone: string;
    agencyId: string;
    role: UserRole;
  }): { ok: boolean; error?: string } => {
    const duplicate = state.users.some(
      (u) => u.email.toLowerCase() === input.email.trim().toLowerCase()
    );
    if (duplicate) {
      return { ok: false, error: t.users.duplicateEmailError };
    }
    const nameStr = input.fullName.trim();
    const newUser: AgencyUser = {
      id: `usr_${Date.now()}`,
      fullName: nameStr,
      email: input.email.trim(),
      phone: input.phone.trim(),
      agencyId: input.agencyId,
      role: input.role,
      status: 'invited',
      lastLogin: null,
      invitedAt: REFERENCE_TODAY,
      activityLog: [
        {
          id: `ua_${Date.now()}`,
          action: {
            ar: 'إنشاء دعوة حساب مستقلة للوكالة',
            fr: 'Invitation individuelle créée pour l’agence',
            en: 'Created isolated agency user invitation',
          },
          timestamp: nowTimestamp(),
          ipNote: ADMIN_CONSOLE_LABEL,
        },
      ],
    };
    const act = makeActivity(
      'user_updated',
      {
        ar: `تمت دعوة المستخدم ${nameStr}`,
        fr: `Utilisateur ${nameStr} invité`,
        en: `Invited user ${nameStr}`,
      },
      input.agencyId,
      newUser.id
    );
    setState((prev) => ({
      ...prev,
      users: [newUser, ...prev.users],
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.userInvited);
    return { ok: true };
  };

  const toggleUserStatus = (userId: string) => {
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;
    const nextStatus = user.status === 'disabled' ? 'active' : 'disabled';
    const actEntry = {
      id: `ua_${Date.now()}`,
      action:
        nextStatus === 'disabled'
          ? {
              ar: 'تم تعطيل الحساب من الإدارة (البيانات والسجل محفوظان)',
              fr: 'Compte désactivé par l’administration (données conservées)',
              en: 'Account disabled by admin (records preserved)',
            }
          : {
              ar: 'تم إعادة تفعيل الحساب من الإدارة',
              fr: 'Compte réactivé par l’administration',
              en: 'Account re-enabled by admin',
            },
      timestamp: nowTimestamp(),
      ipNote: ADMIN_ACTION_LABEL,
    };
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId
          ? { ...u, status: nextStatus, activityLog: [actEntry, ...u.activityLog] }
          : u
      ),
    }));
    notifyToast('success', t.toasts.userUpdated);
  };

  const resendUserInvite = (userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              invitedAt: REFERENCE_TODAY,
              activityLog: [
                {
                  id: `ua_${Date.now()}`,
                  action: {
                    ar: 'طلب إعادة إرسال دعوة الحساب',
                    fr: 'Renvoi de l’invitation demandé',
                    en: 'Account invitation resend logged',
                  },
                  timestamp: nowTimestamp(),
                  ipNote: REQUIRES_EMAIL_BACKEND_LABEL,
                },
                ...u.activityLog,
              ],
            }
          : u
      ),
    }));
    notifyToast('info', t.toasts.inviteResent);
  };

  const triggerUserPasswordReset = (userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              passwordResetRequestedAt: nowTimestamp(),
              activityLog: [
                {
                  id: `ua_${Date.now()}`,
                  action: {
                    ar: 'طلب رابط آمن لإعادة تعيين كلمة المرور',
                    fr: 'Demande de lien de réinitialisation sécurisé',
                    en: 'Triggered secure password reset request',
                  },
                  timestamp: nowTimestamp(),
                  ipNote: REQUIRES_AUTH_BACKEND_LABEL,
                },
                ...u.activityLog,
              ],
            }
          : u
      ),
    }));
    notifyToast('info', t.toasts.passwordResetQueued);
  };

  const createTicket = (input: {
    agencyId: string;
    subject: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
  }) => {
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketCode: `SUP-${1045 + state.tickets.length}`,
      agencyId: input.agencyId,
      subject: input.subject.trim(),
      description: input.description.trim(),
      type: input.type,
      priority: input.priority,
      status: 'new',
      attachments: [],
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderType: 'admin',
          senderName: state.settings.adminName,
          body: input.description.trim(),
          isInternalNote: false,
          createdAt: nowTimestamp(),
        },
      ],
      createdAt: REFERENCE_TODAY,
      updatedAt: REFERENCE_TODAY,
    };
    setState((prev) => ({ ...prev, tickets: [newTicket, ...prev.tickets] }));
    notifyToast('success', t.toasts.ticketCreated);
  };

  const addTicketMessage = (ticketId: string, body: string, isInternalNote: boolean) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((tkt) =>
        tkt.id === ticketId
          ? {
              ...tkt,
              updatedAt: REFERENCE_TODAY,
              status: !isInternalNote && tkt.status === 'new' ? 'in_progress' : tkt.status,
              messages: [
                ...tkt.messages,
                {
                  id: `msg_${Date.now()}`,
                  senderType: 'admin',
                  senderName: prev.settings.adminName,
                  body: body.trim(),
                  isInternalNote,
                  createdAt: nowTimestamp(),
                },
              ],
            }
          : tkt
      ),
    }));
    notifyToast('success', t.toasts.replyAdded);
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((tkt) =>
        tkt.id === ticketId ? { ...tkt, status, updatedAt: REFERENCE_TODAY } : tkt
      ),
    }));
    notifyToast('success', t.toasts.ticketUpdated);
  };

  const updateTicketPriority = (ticketId: string, priority: TicketPriority) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((tkt) =>
        tkt.id === ticketId ? { ...tkt, priority, updatedAt: REFERENCE_TODAY } : tkt
      ),
    }));
    notifyToast('success', t.toasts.ticketUpdated);
  };

  const saveNotification = (
    input: Omit<NotificationItem, 'id' | 'createdAt' | 'status'> & { id?: string },
    dispatchNow: boolean
  ) => {
    const nextStatus = dispatchNow ? 'queued_demo' : 'draft';
    if (input.id) {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === input.id
            ? {
                ...n,
                ...input,
                status: nextStatus,
                dispatchedAt: dispatchNow ? nowTimestamp() : n.dispatchedAt,
              }
            : n
        ),
      }));
    } else {
      const item: NotificationItem = {
        ...input,
        id: `ntf_${Date.now()}`,
        status: nextStatus,
        createdAt: REFERENCE_TODAY,
        dispatchedAt: dispatchNow ? nowTimestamp() : undefined,
      };
      setState((prev) => ({ ...prev, notifications: [item, ...prev.notifications] }));
    }
    notifyToast(dispatchNow ? 'info' : 'success', dispatchNow ? t.toasts.notifQueued : t.toasts.notifSaved);
  };

  const dispatchExistingNotification = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, status: 'queued_demo', dispatchedAt: nowTimestamp() } : n
      ),
    }));
    notifyToast('info', t.toasts.notifQueued);
  };

  const updateSettings = (patch: Partial<PlatformSettings>) => {
    const act = makeActivity('settings_updated', {
      ar: 'تم تحديث إعدادات منصة IBONDA',
      fr: 'Paramètres de la plateforme mis à jour',
      en: 'Updated IBONDA platform settings',
    });
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
      activities: [act, ...prev.activities],
    }));
    notifyToast('success', t.toasts.settingsSaved);
  };

  const exportBackup = () => {
    downloadJsonFile(`ibonda-backup-${REFERENCE_TODAY}.json`, state);
    notifyToast('success', t.toasts.backupExported);
  };

  const resetDemoData = () => {
    const fresh: PersistedState = {
      agencies: initialAgencies,
      subscriptions: initialSubscriptions,
      plans: initialPlans,
      features: initialFeatures,
      payments: initialPayments,
      users: initialUsers,
      tickets: initialTickets,
      notifications: initialNotifications,
      activities: initialActivityLogs,
      settings: initialSettings,
    };
    setState(fresh);
    notifyToast('info', t.toasts.demoReset);
  };

  return (
    <IbondaContext.Provider
      value={{
        ...state,
        lang,
        setLang,
        t,
        activeNav,
        setActiveNav,
        selectedAgencyId,
        setSelectedAgencyId,
        toasts,
        dismissToast,
        notifyToast,
        addAgency,
        updateAgency,
        updateAgencyStatus,
        updateAgencyBranding,
        resetAgencyBranding,
        suspendAgency,
        activateAgency,
        cancelAgencySubscription,
        createSubscription,
        changeSubscriptionPlan,
        extendSubscription,
        renewSubscription,
        convertTrialToPaid,
        suspendSubscription,
        cancelSubscription,
        activateSubscriptionAfterPayment,
        runExpiryCheck,
        savePlan,
        togglePlanActive,
        saveFeature,
        deleteFeature,
        recordPayment,
        confirmPayment,
        markPaymentOverdue,
        refundPayment,
        updatePaymentStatus,
        inviteUser,
        toggleUserStatus,
        resendUserInvite,
        triggerUserPasswordReset,
        createTicket,
        addTicketMessage,
        updateTicketStatus,
        updateTicketPriority,
        saveNotification,
        dispatchExistingNotification,
        updateSettings,
        exportBackup,
        resetDemoData,
      }}
    >
      {children}
    </IbondaContext.Provider>
  );
}

export function useIbonda(): IbondaContextValue {
  const ctx = useContext(IbondaContext);
  if (!ctx) {
    throw new Error('useIbonda must be used inside IbondaProvider');
  }
  return ctx;
}
