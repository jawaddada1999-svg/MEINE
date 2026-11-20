export type Language = 'ar' | 'fr' | 'en';

export type NavSection =
  | 'overview'
  | 'agencies'
  | 'subscriptions'
  | 'plans'
  | 'payments'
  | 'users'
  | 'support'
  | 'notifications'
  | 'analytics'
  | 'settings';

export type AgencyStatus =
  | 'free_trial'
  | 'active'
  | 'pending_payment'
  | 'expired'
  | 'suspended'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'refunded';

export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'check';

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export type UserRole = 'agency_owner' | 'manager' | 'employee';

export type UserStatus = 'active' | 'disabled' | 'invited';

export type TicketType =
  | 'technical'
  | 'account'
  | 'subscription'
  | 'integration'
  | 'help'
  | 'suggestion';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus =
  | 'new'
  | 'in_progress'
  | 'waiting_agency'
  | 'resolved'
  | 'closed';

export type NotificationType =
  | 'general'
  | 'agency_specific'
  | 'subscription'
  | 'payment'
  | 'maintenance'
  | 'update'
  | 'admin';

export type NotificationStatus = 'draft' | 'queued_demo';

export type IntegrationProvider =
  | 'meta_ads'
  | 'instagram'
  | 'whatsapp_business'
  | 'google_sheets'
  | 'automation_webhooks';

export type IntegrationStatus =
  | 'connected'
  | 'not_connected'
  | 'connection_required'
  | 'connection_error';

export interface LocalizedText {
  ar: string;
  fr: string;
  en: string;
}

export type LocalizedField = string | LocalizedText;

export interface PlanFeature {
  id: string;
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  category: 'core' | 'automation' | 'analytics' | 'integrations';
}

export interface Plan {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number; // monthly base price in platform currency
  billingCycle: BillingCycle;
  durationDays: number;
  maxUsers: number;
  maxProperties: number;
  featureIds: string[];
  active: boolean;
  createdAt: string;
}

export interface AgencyIntegration {
  provider: IntegrationProvider;
  status: IntegrationStatus;
  lastCheckedAt?: string;
  accountLabel?: LocalizedField;
}

export interface AgencyBranding {
  displayName: LocalizedField;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface Agency {
  id: string;
  name: LocalizedField;
  logoColor: string;
  logoInitials: LocalizedField;
  logoUrl?: string;
  city: LocalizedField;
  address: LocalizedField;
  phone: string;
  email: string;
  managerName: LocalizedField;
  managerEmail: string;
  managerPhone: string;
  currentPlanId: string;
  status: AgencyStatus;
  subscriptionStart: string;
  subscriptionEnd: string;
  propertiesCount: number;
  adminNotes: LocalizedField;
  integrations: AgencyIntegration[];
  branding?: AgencyBranding;
  createdAt: string;
}

export interface SubscriptionHistoryEntry {
  id: string;
  planId: string;
  planName: LocalizedText;
  startDate: string;
  endDate: string;
  status: AgencyStatus;
  price: number;
  note: LocalizedField;
  recordedAt: string;
}

export interface Subscription {
  id: string;
  agencyId: string;
  planId: string;
  startDate: string;
  endDate: string;
  price: number;
  isTrial: boolean;
  trialConverted: boolean;
  paymentStatus: PaymentStatus;
  status: AgencyStatus;
  autoRenew: boolean;
  history: SubscriptionHistoryEntry[];
  createdAt: string;
}

export interface Payment {
  id: string;
  transactionRef: string;
  agencyId: string;
  subscriptionId: string;
  planId: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  method: PaymentMethod;
  status: PaymentStatus;
  notes: LocalizedField;
  confirmedBy?: LocalizedField;
  confirmedAt?: string;
  createdAt: string;
}

export interface UserActivityEntry {
  id: string;
  action: LocalizedText;
  timestamp: string;
  ipNote: LocalizedField;
}

export interface AgencyUser {
  id: string;
  fullName: LocalizedField;
  email: string;
  phone: string;
  agencyId: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  invitedAt: string;
  passwordResetRequestedAt?: string;
  activityLog: UserActivityEntry[];
}

export interface TicketMessage {
  id: string;
  senderType: 'agency' | 'admin';
  senderName: LocalizedField;
  body: LocalizedField;
  isInternalNote: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketCode: string;
  agencyId: string;
  subject: LocalizedField;
  description: LocalizedField;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  attachments: LocalizedField[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: LocalizedField;
  content: LocalizedField;
  type: NotificationType;
  recipientScope: 'all' | 'specific';
  agencyId?: string;
  scheduledDate: string;
  status: NotificationStatus;
  createdAt: string;
  dispatchedAt?: string;
}

export interface ActivityLogItem {
  id: string;
  type:
    | 'agency_added'
    | 'subscription_activated'
    | 'subscription_expired'
    | 'subscription_extended'
    | 'payment_recorded'
    | 'payment_confirmed'
    | 'agency_suspended'
    | 'agency_cancelled'
    | 'plan_updated'
    | 'user_updated'
    | 'support_updated'
    | 'notification_queued'
    | 'settings_updated';
  agencyId?: string;
  entityId?: string;
  message: LocalizedText;
  actor: LocalizedField;
  timestamp: string;
}

export interface PlatformSettings {
  platformName: LocalizedField;
  officialEmail: string;
  officialPhone: string;
  description: LocalizedText;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  adminName: LocalizedField;
  adminEmail: string;
  twoFactorRequired: boolean;
  sessionTimeoutMinutes: number;
  trialDurationDays: number;
  trialWarningDays: number;
  currency: 'MAD' | 'EUR' | 'USD';
  timezone: LocalizedField;
  notifyOnTrialExpiry: boolean;
  notifyOnOverduePayment: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
