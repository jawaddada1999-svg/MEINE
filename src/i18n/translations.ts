import {
  AgencyStatus,
  BillingCycle,
  IntegrationProvider,
  IntegrationStatus,
  Language,
  NavSection,
  NotificationStatus,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  TicketPriority,
  TicketStatus,
  TicketType,
  UserRole,
  UserStatus,
} from '../types/ibonda';

export interface TranslationDictionary {
  common: {
    appTitle: string;
    brandInitials: string;
    adminConsole: string;
    demoNoticeBadge: string;
    demoBannerText: string;
    search: string;
    filter: string;
    all: string;
    actions: string;
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    edit: string;
    delete: string;
    create: string;
    add: string;
    viewDetails: string;
    backToList: string;
    resetFilters: string;
    noResults: string;
    noResultsDesc: string;
    requiredField: string;
    invalidEmail: string;
    days: string;
    daysLeft: string;
    expiredDaysAgo: string;
    yes: string;
    no: string;
    loading: string;
    printPdf: string;
    exportCsv: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    unlimited: string;
    usersCount: string;
    propertiesCount: string;
    month: string;
    monthShort: string;
    amount: string;
    date: string;
    status: string;
    languageName: Record<Language, string>;
    langShort: Record<Language, string>;
    backendRequiredNote: string;
    globalSearchPlaceholder: string;
    noSearchResults: string;
    collapseSidebar: string;
    expandSidebar: string;
    openMenu: string;
    closeMenu: string;
    clearSearch: string;
    breadcrumb: string;
    showing: string;
    of: string;
    previous: string;
    next: string;
    page: string;
  };
  nav: Record<NavSection, string>;
  agencyStatus: Record<AgencyStatus, string>;
  paymentStatus: Record<PaymentStatus, string>;
  paymentMethod: Record<PaymentMethod, string>;
  billingCycle: Record<BillingCycle, string>;
  userRole: Record<UserRole, string>;
  userStatus: Record<UserStatus, string>;
  ticketType: Record<TicketType, string>;
  ticketPriority: Record<TicketPriority, string>;
  ticketStatus: Record<TicketStatus, string>;
  notificationType: Record<NotificationType, string>;
  notificationStatus: Record<NotificationStatus, string>;
  integrationProvider: Record<IntegrationProvider, string>;
  integrationStatus: Record<IntegrationStatus, string>;
  overview: {
    title: string;
    subtitle: string;
    totalAgencies: string;
    activeAgencies: string;
    trialAgencies: string;
    expiredAgencies: string;
    pendingPaymentAgencies: string;
    totalRevenue: string;
    monthlyRevenue: string;
    duePayments: string;
    chartAgencyGrowth: string;
    chartMonthlyRevenue: string;
    chartStatusDist: string;
    chartTrialsVsPaid: string;
    recentActivities: string;
    quickActions: string;
    addAgency: string;
    addPlan: string;
    sendNotification: string;
    viewDuePayments: string;
    trialsLabel: string;
    paidLabel: string;
  };
  agencies: {
    title: string;
    subtitle: string;
    addAgency: string;
    editAgency: string;
    searchPlaceholder: string;
    filterStatus: string;
    filterPlan: string;
    filterCity: string;
    viewModeTable: string;
    viewModePackGrid: string;
    allPacks: string;
    packDistributionTitle: string;
    packAgencyCount: string;
    emptyPackNote: string;
    poweredByPlatform: string;
    colAgency: string;
    colManager: string;
    colContact: string;
    colPlan: string;
    colPeriod: string;
    colStatus: string;
    contactAction: string;
    contactWhatsapp: string;
    contactCall: string;
    agencyPhoneLabel: string;
    managerPhoneLabel: string;
    agencyInfoSection: string;
    managerInfoSection: string;
    subscriptionInfoSection: string;
    agencyName: string;
    nameAr: string;
    nameFr: string;
    nameEn: string;
    city: string;
    cityAr: string;
    cityFr: string;
    cityEn: string;
    address: string;
    addressAr: string;
    addressFr: string;
    addressEn: string;
    phone: string;
    email: string;
    logoColor: string;
    managerFullName: string;
    managerNameAr: string;
    managerNameFr: string;
    managerNameEn: string;
    managerEmail: string;
    managerPhone: string;
    multilingualHint: string;
    selectPlan: string;
    startDate: string;
    durationDays: string;
    endDate: string;
    initialStatus: string;
    adminNotes: string;
    detailsTitle: string;
    employeesTitle: string;
    paymentsTitle: string;
    integrationsTitle: string;
    integrationsNote: string;
    activityTitle: string;
    changePlan: string;
    extendSub: string;
    suspendAgency: string;
    activateAgency: string;
    cancelSub: string;
    previewPortal: string;
    previewTitle: string;
    previewReadOnlyNotice: string;
    previewEnabledFeatures: string;
    previewLockedFeatures: string;
    confirmSuspendTitle: string;
    confirmSuspendMsg: string;
    confirmCancelTitle: string;
    confirmCancelMsg: string;
    saveNotes: string;
    viewUsers: string;
    overviewTab: string;
    brandingTab: string;
    brandingTitle: string;
    brandingSubtitle: string;
    uploadLogo: string;
    removeLogo: string;
    uploadBanner: string;
    removeBanner: string;
    displayName: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    livePreviewTitle: string;
    previewNote: string;
    resetBranding: string;
    saveBranding: string;
    lowContrastWarning: string;
    isolationNotice: string;
    previewSidebarHome: string;
    previewSidebarProperties: string;
    previewSidebarClients: string;
    previewSidebarVisits: string;
    previewStatProperties: string;
    previewStatLeads: string;
    previewStatVisits: string;
    previewPrimaryBtn: string;
    previewAccentBtn: string;
    previewTableTitle: string;
    previewRowProp1: string;
    previewRowProp2: string;
    previewRowProp3: string;
  };
  subscriptions: {
    title: string;
    subtitle: string;
    createSub: string;
    runExpiryCheck: string;
    tabAll: string;
    tabTrial: string;
    tabActive: string;
    tabPending: string;
    tabExpired: string;
    tabSuspended: string;
    tabCancelled: string;
    colAgency: string;
    colPlan: string;
    colStart: string;
    colEnd: string;
    colRemaining: string;
    colPrice: string;
    colPaymentStatus: string;
    colSubStatus: string;
    trialAlertExpiring: string;
    trialBadge: string;
    extendAction: string;
    renewAction: string;
    changePlanAction: string;
    convertTrialAction: string;
    activateAfterPayment: string;
    suspendAction: string;
    cancelAction: string;
    historyAction: string;
    historyTitle: string;
    convertTrialModalTitle: string;
    convertTrialRuleNote: string;
    confirmPaymentNow: string;
    createPendingPayment: string;
    extendDaysLabel: string;
    confirmSuspendMsg: string;
    confirmCancelMsg: string;
  };
  plans: {
    title: string;
    subtitle: string;
    addPlan: string;
    editPlan: string;
    manageFeatures: string;
    addFeature: string;
    editFeature: string;
    planNameAr: string;
    planNameFr: string;
    planNameEn: string;
    descAr: string;
    descFr: string;
    descEn: string;
    price: string;
    billingCycle: string;
    durationDays: string;
    maxUsers: string;
    maxProperties: string;
    includedFeatures: string;
    planStatus: string;
    activeLabel: string;
    inactiveLabel: string;
    comparisonMatrix: string;
    featureName: string;
    planChangeRuleNote: string;
    confirmDeleteFeature: string;
    featureInUseWarning: string;
  };
  payments: {
    title: string;
    subtitle: string;
    recordPayment: string;
    totalRevenue: string;
    monthRevenue: string;
    duePayments: string;
    overduePayments: string;
    completedCount: string;
    colRef: string;
    colAgency: string;
    colPlan: string;
    colAmount: string;
    colDate: string;
    colPaymentDate: string;
    colDueDate: string;
    colTiming: string;
    colContact: string;
    colMethod: string;
    colStatus: string;
    daysOverdue: string;
    daysRemaining: string;
    dueToday: string;
    paidOnTime: string;
    paidLateDays: string;
    notPaidYet: string;
    selectAgency: string;
    selectSubscription: string;
    transactionRef: string;
    paymentDate: string;
    dueDate: string;
    method: string;
    confirmPaymentAction: string;
    markOverdueAction: string;
    refundAction: string;
    viewInvoice: string;
    invoiceTitle: string;
    invoiceNumber: string;
    billedTo: string;
    issuedBy: string;
    paymentRuleNotice: string;
    confirmPaymentTitle: string;
    confirmPaymentMsg: string;
    confirmRefundTitle: string;
    confirmRefundMsg: string;
  };
  users: {
    title: string;
    subtitle: string;
    inviteUser: string;
    searchPlaceholder: string;
    colUser: string;
    colContact: string;
    colAgency: string;
    colRole: string;
    colStatus: string;
    colLastLogin: string;
    neverLoggedIn: string;
    fullName: string;
    email: string;
    phone: string;
    agency: string;
    role: string;
    securityRuleNote: string;
    userDetailsTitle: string;
    disableAccount: string;
    enableAccount: string;
    resendInvite: string;
    resetPassword: string;
    activityLog: string;
    confirmDisableTitle: string;
    confirmDisableMsg: string;
    duplicateEmailError: string;
  };
  support: {
    title: string;
    subtitle: string;
    newTicket: string;
    colCode: string;
    colAgency: string;
    colSubject: string;
    colType: string;
    colDate: string;
    colPriority: string;
    colStatus: string;
    ticketDetails: string;
    description: string;
    attachments: string;
    conversation: string;
    publicReply: string;
    internalNote: string;
    internalNoteBadge: string;
    replyPlaceholder: string;
    internalPlaceholder: string;
    sendReply: string;
    saveInternalNote: string;
    changeStatus: string;
    changePriority: string;
    selectTicketPrompt: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    createNotification: string;
    editNotification: string;
    honestDeliveryNotice: string;
    notifTitle: string;
    notifContent: string;
    notifType: string;
    recipientScope: string;
    allAgencies: string;
    specificAgency: string;
    scheduledDate: string;
    saveDraft: string;
    dispatchAction: string;
    historyTitle: string;
    colTitle: string;
    colType: string;
    colRecipients: string;
    colDate: string;
    colStatus: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    range7d: string;
    range30d: string;
    range3m: string;
    range6m: string;
    range1y: string;
    rangeCustom: string;
    from: string;
    to: string;
    totalAgencies: string;
    newAgencies: string;
    activeSubs: string;
    trialConversionRate: string;
    churnRate: string;
    renewalRate: string;
    totalRevenue: string;
    arpa: string;
    chartMonthlyGrowth: string;
    chartRevenueTrend: string;
    chartSubsByPlan: string;
    chartTrialsVsSubs: string;
    chartExpiredVsRenewed: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabGeneral: string;
    tabLanguage: string;
    tabAccount: string;
    tabSecurity: string;
    tabSystem: string;
    platformName: string;
    officialEmail: string;
    officialPhone: string;
    platformDesc: string;
    defaultLanguage: string;
    enabledLanguages: string;
    rtlTag: string;
    ltrTag: string;
    adminName: string;
    adminEmail: string;
    passwordAuthNotice: string;
    twoFactorLabel: string;
    sessionTimeoutLabel: string;
    activeSessionTitle: string;
    activeSessionDesc: string;
    auditLogTitle: string;
    trialDurationLabel: string;
    trialWarningLabel: string;
    currencyLabel: string;
    currencyNames: Record<'MAD' | 'EUR' | 'USD', string>;
    timezoneLabel: string;
    alertsSection: string;
    notifyTrialExpiry: string;
    notifyOverduePayment: string;
    backupSection: string;
    backupHonestNote: string;
    exportJsonBackup: string;
    resetDemoData: string;
    confirmResetTitle: string;
    confirmResetMsg: string;
  };
  toasts: {
    agencyAdded: string;
    agencyUpdated: string;
    agencyStatusUpdated: string;
    agencySuspended: string;
    agencyActivated: string;
    subCreated: string;
    subExtended: string;
    subRenewed: string;
    subPlanChanged: string;
    subCancelled: string;
    subActivated: string;
    expiryCheckDone: string;
    planSaved: string;
    featureSaved: string;
    featureDeleted: string;
    paymentRecorded: string;
    paymentConfirmed: string;
    paymentOverdue: string;
    paymentRefunded: string;
    paymentStatusUpdated: string;
    userInvited: string;
    userUpdated: string;
    inviteResent: string;
    passwordResetQueued: string;
    ticketCreated: string;
    replyAdded: string;
    ticketUpdated: string;
    notifSaved: string;
    notifQueued: string;
    settingsSaved: string;
    backupExported: string;
    demoReset: string;
    csvExported: string;
    brandingSaved: string;
    brandingReset: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    common: {
      appTitle: 'IBONDA',
      brandInitials: 'IB',
      adminConsole: 'لوحة الإدارة المركزية',
      demoNoticeBadge: 'بيانات تجريبية محلية',
      demoBannerText:
        'تعمل هذه الواجهة ببيانات تجريبية مترابطة محفوظة محلياً في المتصفح؛ المصادقة، الدفع الإلكتروني، وإرسال البريد تتطلب ربط الخادم.',
      search: 'بحث',
      filter: 'تصفية',
      all: 'الكل',
      actions: 'الإجراءات',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      close: 'إغلاق',
      edit: 'تعديل',
      delete: 'حذف',
      create: 'إنشاء',
      add: 'إضافة',
      viewDetails: 'عرض التفاصيل',
      backToList: 'العودة إلى القائمة',
      resetFilters: 'إعادة ضبط الفلاتر',
      noResults: 'لا توجد نتائج مطابقة',
      noResultsDesc: 'جرّب تعديل معايير البحث أو إزالة الفلاتر الحالية.',
      requiredField: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      days: 'يوم',
      daysLeft: 'متبقي',
      expiredDaysAgo: 'منتهٍ منذ',
      yes: 'نعم',
      no: 'لا',
      loading: 'جاري التحميل...',
      printPdf: 'طباعة / ملف للطباعة',
      exportCsv: 'تصدير جدول بيانات',
      notes: 'ملاحظات',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'آخر تحديث',
      unlimited: 'غير محدود',
      usersCount: 'مستخدمون',
      propertiesCount: 'عقار',
      month: 'الشهر',
      monthShort: 'شهر',
      amount: 'المبلغ',
      date: 'التاريخ',
      status: 'الحالة',
      languageName: { ar: 'العربية', fr: 'الفرنسية', en: 'الإنجليزية' },
      langShort: { ar: 'ع', fr: 'فر', en: 'إن' },
      backendRequiredNote: 'يتطلب خادماً وواجهات ربط برمجي حقيقية عند النشر الإنتاجي.',
      globalSearchPlaceholder: 'بحث سريع عن وكالة، مستخدم، فاتورة، أو تذكرة...',
      noSearchResults: 'لا توجد نتائج مطابقة في المنصة',
      collapseSidebar: 'تصغير القائمة',
      expandSidebar: 'توسيع القائمة',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      clearSearch: 'مسح البحث',
      breadcrumb: 'مسار التنقل',
      showing: 'عرض',
      of: 'من أصل',
      previous: 'السابق',
      next: 'التالي',
      page: 'صفحة',
    },
    nav: {
      overview: 'نظرة عامة',
      agencies: 'الوكالات',
      subscriptions: 'الاشتراكات',
      plans: 'الباقات والمميزات',
      payments: 'الأداءات والفواتير',
      users: 'المستخدمون والصلاحيات',
      support: 'الدعم الفني',
      notifications: 'الإشعارات',
      analytics: 'التقارير والتحليلات',
      settings: 'إعدادات المنصة',
    },
    agencyStatus: {
      free_trial: 'تجربة مجانية',
      active: 'اشتراك نشط',
      pending_payment: 'في انتظار الأداء',
      expired: 'اشتراك منتهٍ',
      suspended: 'موقوفة',
      cancelled: 'ملغاة',
    },
    paymentStatus: {
      paid: 'مدفوع',
      pending: 'قيد الانتظار',
      overdue: 'متأخر',
      refunded: 'مسترد',
    },
    paymentMethod: {
      bank_transfer: 'تحويل بنكي',
      card: 'بطاقة بنكية',
      cash: 'نقداً',
      check: 'شيك بنكي',
    },
    billingCycle: {
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      annual: 'سنوي',
    },
    userRole: {
      agency_owner: 'مدير الوكالة',
      manager: 'مسؤول',
      employee: 'موظف',
    },
    userStatus: {
      active: 'نشط',
      disabled: 'معطل',
      invited: 'مدعو',
    },
    ticketType: {
      technical: 'مشكلة تقنية',
      account: 'مشكلة في الحساب',
      subscription: 'مشكلة في الاشتراك',
      integration: 'مشكلة في ربط الخدمات',
      help: 'طلب مساعدة',
      suggestion: 'اقتراح تطوير',
    },
    ticketPriority: {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة',
    },
    ticketStatus: {
      new: 'جديد',
      in_progress: 'قيد المعالجة',
      waiting_agency: 'في انتظار الوكالة',
      resolved: 'تم الحل',
      closed: 'مغلق',
    },
    notificationType: {
      general: 'إشعار عام لجميع الوكالات',
      agency_specific: 'إشعار لوكالة محددة',
      subscription: 'إشعار متعلق بالاشتراك',
      payment: 'إشعار متعلق بالأداء',
      maintenance: 'إشعار صيانة',
      update: 'إشعار تحديث جديد',
      admin: 'إشعار إداري',
    },
    notificationStatus: {
      draft: 'مسودة',
      queued_demo: 'مسجل محلياً (بانتظار مزود إرسال)',
    },
    integrationProvider: {
      meta_ads: 'إعلانات ميتا وفيسبوك',
      instagram: 'إنستغرام للأعمال',
      whatsapp_business: 'واتساب للأعمال',
      google_sheets: 'جداول بيانات جوجل',
      automation_webhooks: 'خدمات الأتمتة والربط التلقائي',
    },
    integrationStatus: {
      connected: 'متصل',
      not_connected: 'غير متصل',
      connection_required: 'يتطلب الربط',
      connection_error: 'خطأ في الاتصال',
    },
    overview: {
      title: 'نظرة عامة على منصة IBONDA',
      subtitle: 'ملخص فوري لحالة الوكالات العقارية، الاشتراكات، والمداخيل المحسوبة من بيانات المنصة.',
      totalAgencies: 'إجمالي الوكالات',
      activeAgencies: 'الوكالات النشطة',
      trialAgencies: 'في الفترة التجريبية',
      expiredAgencies: 'اشتراكات منتهية',
      pendingPaymentAgencies: 'تنتظر الأداء',
      totalRevenue: 'إجمالي المداخيل',
      monthlyRevenue: 'المداخيل الشهرية',
      duePayments: 'الأداءات المستحقة',
      chartAgencyGrowth: 'تطور عدد الوكالات خلال الأشهر',
      chartMonthlyRevenue: 'تطور المداخيل الشهرية',
      chartStatusDist: 'توزيع الوكالات حسب حالة الاشتراك',
      chartTrialsVsPaid: 'مقارنة التجارب المجانية بالاشتراكات المدفوعة',
      recentActivities: 'الأنشطة الأخيرة',
      quickActions: 'الإجراءات السريعة',
      addAgency: 'إضافة وكالة جديدة',
      addPlan: 'إضافة باقة جديدة',
      sendNotification: 'إرسال إشعار',
      viewDuePayments: 'عرض الأداءات المستحقة',
      trialsLabel: 'تجربة مجانية',
      paidLabel: 'اشتراك مدفوع',
    },
    agencies: {
      title: 'إدارة الوكالات العقارية',
      subtitle: 'الوكالات التي بدأت فعلياً استعمال منصة IBONDA في الفترة التجريبية أو الاشتراك المدفوع.',
      addAgency: 'إضافة وكالة جديدة',
      editAgency: 'تعديل بيانات الوكالة',
      searchPlaceholder: 'ابحث باسم الوكالة، المدير، أو البريد...',
      filterStatus: 'الحالة',
      filterPlan: 'الباقة',
      filterCity: 'المدينة',
      viewModeTable: 'عرض الجدول',
      viewModePackGrid: 'شبكة مقسمة حسب الباقة',
      allPacks: 'جميع الباقات',
      packDistributionTitle: 'تقسيم الوكالات حسب الباقة المختارة',
      packAgencyCount: 'وكالات',
      emptyPackNote: 'لا توجد وكالات مطابقة للتصفية الحالية ضمن هذه الباقة.',
      poweredByPlatform: 'مدعوم من منصة IBONDA',
      colAgency: 'الوكالة',
      colManager: 'المدير',
      colContact: 'التواصل السريع',
      colPlan: 'الباقة الحالية',
      colPeriod: 'فترة الاشتراك',
      colStatus: 'الحالة',
      contactAction: 'تواصل',
      contactWhatsapp: 'واتساب',
      contactCall: 'مكالمة عادية',
      agencyPhoneLabel: 'هاتف الوكالة',
      managerPhoneLabel: 'هاتف المدير',
      agencyInfoSection: 'معلومات الوكالة',
      managerInfoSection: 'معلومات المدير',
      subscriptionInfoSection: 'معلومات الاشتراك',
      agencyName: 'اسم الوكالة',
      nameAr: 'اسم الوكالة (بالعربية)',
      nameFr: 'اسم الوكالة (بالفرنسية)',
      nameEn: 'اسم الوكالة (بالإنجليزية)',
      city: 'المدينة',
      cityAr: 'المدينة (بالعربية)',
      cityFr: 'المدينة (بالفرنسية)',
      cityEn: 'المدينة (بالإنجليزية)',
      address: 'العنوان',
      addressAr: 'العنوان (بالعربية)',
      addressFr: 'العنوان (بالفرنسية)',
      addressEn: 'العنوان (بالإنجليزية)',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني للوكالة',
      logoColor: 'لون الهوية',
      managerFullName: 'الاسم الكامل للمدير',
      managerNameAr: 'اسم المدير (بالعربية)',
      managerNameFr: 'اسم المدير (بالفرنسية)',
      managerNameEn: 'اسم المدير (بالإنجليزية)',
      managerEmail: 'البريد الإلكتروني للمدير',
      managerPhone: 'هاتف المدير',
      multilingualHint: 'أدخل البيانات باللغات الثلاث ليظهر الاسم والمدينة واسم المدير بشكل تلقائي ومناسب عند تبديل لغة الواجهة.',
      selectPlan: 'اختيار الباقة',
      startDate: 'تاريخ بداية الاشتراك',
      durationDays: 'مدة الاشتراك (بالأيام)',
      endDate: 'تاريخ نهاية الاشتراك',
      initialStatus: 'حالة الاشتراك الأولية',
      adminNotes: 'ملاحظات إدارية',
      detailsTitle: 'ملف الوكالة',
      employeesTitle: 'الموظفون المرتبطون بالوكالة',
      paymentsTitle: 'الأداءات والفواتير',
      integrationsTitle: 'حالة ربط الخدمات الخارجية',
      integrationsNote:
        'الربط الفعلي مع ميتا وإنستغرام وواتساب وجداول بيانات جوجل يتطلب إعداد تفويض الربط وصلاحيات الواجهة البرمجية في الخادم. لا يتم طلب كلمات مرور الحسابات الخارجية هنا.',
      activityTitle: 'سجل أنشطة الوكالة',
      changePlan: 'تغيير الباقة',
      extendSub: 'تمديد الاشتراك',
      suspendAgency: 'إيقاف الوكالة',
      activateAgency: 'تفعيل الوكالة',
      cancelSub: 'إلغاء الاشتراك',
      previewPortal: 'معاينة لوحة تحكم الوكالة',
      previewTitle: 'معاينة صلاحيات واجهة الوكالة',
      previewReadOnlyNotice: 'معاينة للعرض فقط وفق باقة الوكالة الحالية ومميزاتها المفعّلة.',
      previewEnabledFeatures: 'الوحدات والمميزات المتاحة في هذه الباقة',
      previewLockedFeatures: 'مميزات غير متضمنة في الباقة الحالية',
      confirmSuspendTitle: 'تأكيد إيقاف الوكالة',
      confirmSuspendMsg: 'سيؤدي إيقاف الوكالة إلى تعليق اشتراكها ومنع الوصول مؤقتاً مع الاحتفاظ بكافة البيانات والسجلات.',
      confirmCancelTitle: 'تأكيد إلغاء الاشتراك',
      confirmCancelMsg: 'هل أنت متأكد من إلغاء اشتراك هذه الوكالة؟ سيتم تحديث حالة الوكالة والاشتراك إلى ملغاة.',
      saveNotes: 'حفظ الملاحظات',
      viewUsers: 'عرض المستخدمين',
      overviewTab: 'نظرة عامة وتفاصيل الوكالة',
      brandingTab: 'الهوية البصرية للوكالة',
      brandingTitle: 'الهوية البصرية للوكالة',
      brandingSubtitle:
        'تخصيص الشعار والألوان الخاصة بلوحة تحكم هذه الوكالة بشكل مستقل تماماً عن منصة IBONDA وبقية الوكالات.',
      uploadLogo: 'رفع شعار الوكالة',
      removeLogo: 'إزالة الشعار',
      uploadBanner: 'رفع صورة غلاف (اختياري)',
      removeBanner: 'إزالة الغلاف',
      displayName: 'اسم الوكالة الظاهر داخل لوحتها',
      primaryColor: 'اللون الأساسي',
      secondaryColor: 'اللون الثانوي',
      accentColor: 'لون التمييز',
      livePreviewTitle: 'معاينة حية للوحة تحكم الوكالة',
      previewNote: 'يعكس هذا النموذج شكل بوابة الوكالة بالهوية المختارة والوحدات المفعلة في باقتها.',
      resetBranding: 'إعادة إلى الافتراضي',
      saveBranding: 'حفظ الهوية البصرية',
      lowContrastWarning: 'تنبيه تباين: درجة اللون المختار قد تجعل النصوص أقل وضوحاً؛ يوصى باختيار لون أغمق أو أكثر تبايناً.',
      isolationNotice: 'تُطبّق هذه الهوية على لوحة تحكم هذه الوكالة فقط ولا تؤثر على لوحة IBONDA الإدارية أو الوكالات الأخرى.',
      previewSidebarHome: 'الرئيسية',
      previewSidebarProperties: 'العقارات',
      previewSidebarClients: 'إدارة العملاء',
      previewSidebarVisits: 'المعاينات',
      previewStatProperties: 'العقارات النشطة',
      previewStatLeads: 'العملاء المهتمون',
      previewStatVisits: 'معاينات هذا الأسبوع',
      previewPrimaryBtn: 'إضافة عقار',
      previewAccentBtn: 'جدولة معاينة',
      previewTableTitle: 'أحدث العقارات المسجلة',
      previewRowProp1: 'شقة فاخرة — حي أنفا',
      previewRowProp2: 'فيلا حديثة — السويسي',
      previewRowProp3: 'مكتب تجاري — وسط المدينة',
    },
    subscriptions: {
      title: 'إدارة الاشتراكات',
      subtitle: 'متابعة التجارب المجانية (7 أيام)، الاشتراكات النشطة، التجديدات، وحالات الأداء.',
      createSub: 'إنشاء اشتراك',
      runExpiryCheck: 'فحص الاشتراكات المنتهية',
      tabAll: 'جميع الاشتراكات',
      tabTrial: 'التجارب المجانية',
      tabActive: 'النشطة',
      tabPending: 'في انتظار الأداء',
      tabExpired: 'المنتهية',
      tabSuspended: 'الموقوفة',
      tabCancelled: 'الملغاة',
      colAgency: 'الوكالة',
      colPlan: 'الباقة',
      colStart: 'البداية',
      colEnd: 'النهاية',
      colRemaining: 'المدة المتبقية',
      colPrice: 'السعر',
      colPaymentStatus: 'حالة الأداء',
      colSubStatus: 'حالة الاشتراك',
      trialAlertExpiring: 'تنبيه: تجربة مجانية تقترب من الانتهاء',
      trialBadge: 'تجربة 7 أيام',
      extendAction: 'تمديد',
      renewAction: 'تجديد',
      changePlanAction: 'تغيير الباقة',
      convertTrialAction: 'تحويل إلى مدفوع',
      activateAfterPayment: 'تفعيل بعد تأكيد الأداء',
      suspendAction: 'إيقاف',
      cancelAction: 'إلغاء',
      historyAction: 'سجل الاشتراكات',
      historyTitle: 'سجل الاشتراكات السابقة',
      convertTrialModalTitle: 'تحويل التجربة المجانية إلى اشتراك مدفوع',
      convertTrialRuleNote:
        'وفق قواعد النظام، لا تتحول التجربة المجانية إلى اشتراك نشط إلا بعد تسجيل أداء وتأكيده، أو تسجيل فاتورة في انتظار الأداء بموافقة صريحة.',
      confirmPaymentNow: 'تسجيل وتأكيد الأداء الآن (تفعيل فوري)',
      createPendingPayment: 'إنشاء فاتورة في انتظار الأداء',
      extendDaysLabel: 'عدد أيام التمديد',
      confirmSuspendMsg: 'هل تريد إيقاف هذا الاشتراك؟ سينعكس ذلك مباشرة على حالة الوكالة.',
      confirmCancelMsg: 'هل تريد إلغاء هذا الاشتراك نهائياً؟',
    },
    plans: {
      title: 'الباقات والمميزات',
      subtitle: 'إنشاء وتعديل الباقات وإدارة مصفوفة المميزات وحدود الاستخدام لكل باقة.',
      addPlan: 'إضافة باقة جديدة',
      editPlan: 'تعديل الباقة',
      manageFeatures: 'إدارة المميزات',
      addFeature: 'إضافة ميزة جديدة',
      editFeature: 'تعديل الميزة',
      planNameAr: 'اسم الباقة (بالعربية)',
      planNameFr: 'اسم الباقة (بالفرنسية)',
      planNameEn: 'اسم الباقة (بالإنجليزية)',
      descAr: 'الوصف (بالعربية)',
      descFr: 'الوصف (بالفرنسية)',
      descEn: 'الوصف (بالإنجليزية)',
      price: 'السعر',
      billingCycle: 'دورة الفوترة',
      durationDays: 'مدة الباقة (أيام)',
      maxUsers: 'الحد الأقصى للمستخدمين',
      maxProperties: 'الحد الأقصى للعقارات',
      includedFeatures: 'المميزات المفعلة في الباقة',
      planStatus: 'حالة الباقة',
      activeLabel: 'نشطة',
      inactiveLabel: 'غير نشطة',
      comparisonMatrix: 'جدول مقارنة المميزات والحدود',
      featureName: 'الميزة',
      planChangeRuleNote:
        'تعديل الباقة ينطبق على الاشتراكات الجديدة ولا يغيّر اشتراكات الوكالات الحالية تلقائياً دون قرار إداري.',
      confirmDeleteFeature: 'هل تريد حذف هذه الميزة من النظام وإزالتها من الباقات؟',
      featureInUseWarning: 'هذه الميزة مستخدمة حالياً في باقة أو أكثر.',
    },
    payments: {
      title: 'الأداءات والفواتير',
      subtitle: 'تتبع المداخيل، تأكيد الأداءات إدارياً، وإصدار الفواتير القابلة للطباعة.',
      recordPayment: 'تسجيل أداء جديد',
      totalRevenue: 'إجمالي المداخيل المؤكدة',
      monthRevenue: 'مداخيل هذا الشهر',
      duePayments: 'الأداءات المستحقة',
      overduePayments: 'الأداءات المتأخرة',
      completedCount: 'الأداءات المكتملة',
      colRef: 'رقم العملية',
      colAgency: 'الوكالة',
      colPlan: 'الباقة',
      colAmount: 'المبلغ',
      colDate: 'تاريخ الأداء',
      colPaymentDate: 'تاريخ الدفع',
      colDueDate: 'تاريخ الاستحقاق',
      colTiming: 'التأخر / المتبقي',
      colContact: 'التواصل',
      colMethod: 'طريقة الأداء',
      colStatus: 'الحالة',
      daysOverdue: 'متأخر',
      daysRemaining: 'متبقي',
      dueToday: 'مستحق اليوم',
      paidOnTime: 'مدفوع في الموعد',
      paidLateDays: 'دُفع بتأخير',
      notPaidYet: 'لم يُدفع بعد',
      selectAgency: 'اختيار الوكالة',
      selectSubscription: 'الاشتراك المرتبط',
      transactionRef: 'مرجع العملية',
      paymentDate: 'تاريخ الأداء',
      dueDate: 'تاريخ الاستحقاق',
      method: 'طريقة الأداء',
      confirmPaymentAction: 'تأكيد الأداء',
      markOverdueAction: 'تحديد كمتأخر',
      refundAction: 'استرداد المبلغ',
      viewInvoice: 'عرض الفاتورة',
      invoiceTitle: 'فاتورة أداء رسمية',
      invoiceNumber: 'رقم الفاتورة',
      billedTo: 'موجهة إلى',
      issuedBy: 'صادرة عن',
      paymentRuleNotice:
        'تسجيل الأداء ينشئ عملية بحالة «قيد الانتظار» ولا يُحتسب مكتملاً أو يفعّل الاشتراك إلا بعد التأكيد الإداري أو بوابة دفع حقيقية.',
      confirmPaymentTitle: 'تأكيد استلام الأداء',
      confirmPaymentMsg: 'سيتم احتساب المبلغ ضمن المداخيل المؤكدة وتفعيل الاشتراك المرتبط إذا كان بانتظار الأداء.',
      confirmRefundTitle: 'تأكيد استرداد الأداء',
      confirmRefundMsg: 'هل أنت متأكد من تحويل حالة هذه العملية إلى مستردة؟',
    },
    users: {
      title: 'المستخدمون والصلاحيات',
      subtitle: 'إدارة حسابات مدراء وموظفي الوكالات العقارية مع الحفاظ على استقلال وسرية الحسابات.',
      inviteUser: 'إضافة / دعوة مستخدم',
      searchPlaceholder: 'ابحث بالاسم، البريد، أو اسم الوكالة...',
      colUser: 'المستخدم',
      colContact: 'التواصل',
      colAgency: 'الوكالة',
      colRole: 'الدور',
      colStatus: 'الحالة',
      colLastLogin: 'آخر تسجيل دخول',
      neverLoggedIn: 'لم يسجل الدخول بعد',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني الشخصي',
      phone: 'رقم الهاتف',
      agency: 'الوكالة المرتبطة',
      role: 'الدور الوظيفي',
      securityRuleNote:
        'كل مستخدم يملك بريداً وحساباً مستقلاً مرتبطاً بوكالة واحدة فقط. لا يتم تخزين أو عرض أي كلمات مرور في لوحة الإدارة.',
      userDetailsTitle: 'ملف المستخدم',
      disableAccount: 'تعطيل الحساب',
      enableAccount: 'تفعيل الحساب',
      resendInvite: 'إعادة إرسال الدعوة',
      resetPassword: 'إعادة تعيين كلمة المرور',
      activityLog: 'سجل الأنشطة',
      confirmDisableTitle: 'تأكيد تعطيل حساب المستخدم',
      confirmDisableMsg: 'سيتم إيقاف دخول المستخدم مع الاحتفاظ التام ببياناته وسجل أنشطته دون حذف.',
      duplicateEmailError: 'هذا البريد الإلكتروني مستخدم بالفعل لحساب آخر.',
    },
    support: {
      title: 'الدعم الفني',
      subtitle: 'استقبال طلبات الوكالات، متابعة الردود، وإضافة ملاحظات داخلية للفريق الإداري.',
      newTicket: 'تسجيل طلب دعم',
      colCode: 'رقم الطلب',
      colAgency: 'الوكالة',
      colSubject: 'الموضوع',
      colType: 'النوع',
      colDate: 'تاريخ الإرسال',
      colPriority: 'الأولوية',
      colStatus: 'الحالة',
      ticketDetails: 'تفاصيل الطلب',
      description: 'وصف المشكلة',
      attachments: 'المرفقات',
      conversation: 'سجل المحادثة والمتابعة',
      publicReply: 'رد للوكالة',
      internalNote: 'ملاحظة داخلية (لا تظهر للوكالة)',
      internalNoteBadge: 'ملاحظة داخلية',
      replyPlaceholder: 'اكتب رداً واضحاً يظهر للوكالة...',
      internalPlaceholder: 'اكتب ملاحظة إدارية داخلية خاصة بفريق IBONDA...',
      sendReply: 'إرسال الرد',
      saveInternalNote: 'حفظ الملاحظة الداخلية',
      changeStatus: 'تغيير الحالة',
      changePriority: 'الأولوية',
      selectTicketPrompt: 'اختر طلباً من الجدول لعرض تفاصيله والرد عليه.',
    },
    notifications: {
      title: 'نظام الإشعارات',
      subtitle: 'إنشاء وتعديل وجدولة الإشعارات الموجهة للوكالات العقارية.',
      createNotification: 'إنشاء إشعار جديد',
      editNotification: 'تعديل الإشعار',
      honestDeliveryNotice:
        'تنبيه تكامل: لا توجد خدمة بريد إلكتروني أو تنبيهات فورية أو واتساب مربوطة حالياً؛ الإرسال يحفظ الإشعار في سجل المعالجة المحلي فقط ولا يدّعي التسليم الفعلي.',
      notifTitle: 'عنوان الإشعار',
      notifContent: 'محتوى الإشعار',
      notifType: 'نوع الإشعار',
      recipientScope: 'المستلمون',
      allAgencies: 'جميع الوكالات',
      specificAgency: 'وكالة محددة',
      scheduledDate: 'تاريخ الإرسال',
      saveDraft: 'حفظ كمسودة',
      dispatchAction: 'تسجيل الإرسال',
      historyTitle: 'سجل الإشعارات',
      colTitle: 'العنوان',
      colType: 'النوع',
      colRecipients: 'المستلمون',
      colDate: 'التاريخ',
      colStatus: 'الحالة',
    },
    analytics: {
      title: 'التقارير والتحليلات',
      subtitle: 'مؤشرات النمو، تحويل التجارب، الاحتفاظ، ومتوسط العائد لكل وكالة محسوبة مباشرة من البيانات.',
      range7d: 'آخر 7 أيام',
      range30d: 'آخر 30 يوماً',
      range3m: 'آخر 3 أشهر',
      range6m: 'آخر 6 أشهر',
      range1y: 'آخر سنة',
      rangeCustom: 'فترة مخصصة',
      from: 'من',
      to: 'إلى',
      totalAgencies: 'إجمالي الوكالات',
      newAgencies: 'الوكالات الجديدة (ضمن الفترة)',
      activeSubs: 'الاشتراكات النشطة',
      trialConversionRate: 'معدل تحويل التجارب',
      churnRate: 'معدل الإلغاء',
      renewalRate: 'معدل التجديد',
      totalRevenue: 'إجمالي المداخيل (ضمن الفترة)',
      arpa: 'متوسط المداخيل لكل وكالة',
      chartMonthlyGrowth: 'نمو الوكالات شهرياً',
      chartRevenueTrend: 'تطور المداخيل',
      chartSubsByPlan: 'توزيع الاشتراكات حسب الباقة',
      chartTrialsVsSubs: 'التجارب المجانية مقابل المدفوعة',
      chartExpiredVsRenewed: 'الاشتراكات المنتهية والمتجددة',
    },
    settings: {
      title: 'إعدادات منصة IBONDA',
      subtitle: 'ضبط الهوية العامة، اللغات، أمان الإدارة، العملة، وتصدير النسخ المحلية.',
      tabGeneral: 'المعلومات العامة',
      tabLanguage: 'إعدادات اللغة',
      tabAccount: 'حساب المدير',
      tabSecurity: 'الأمان وسجل العمليات',
      tabSystem: 'النظام والنسخ الاحتياطي',
      platformName: 'اسم المنصة',
      officialEmail: 'البريد الإلكتروني الرسمي',
      officialPhone: 'رقم الهاتف الرسمي',
      platformDesc: 'وصف المنصة',
      defaultLanguage: 'اللغة الافتراضية',
      enabledLanguages: 'اللغات المتاحة',
      rtlTag: 'من اليمين إلى اليسار',
      ltrTag: 'من اليسار إلى اليمين',
      adminName: 'اسم مدير المنصة',
      adminEmail: 'البريد الإلكتروني للمدير',
      passwordAuthNotice:
        'تغيير كلمة المرور وإدارة الجلسات الحقيقية يتطلبان ربط مزود مصادقة آمن في الخادم.',
      twoFactorLabel: 'إلزام المصادقة الثنائية لحسابات الإدارة',
      sessionTimeoutLabel: 'مهلة انتهاء الجلسة (بالدقائق)',
      activeSessionTitle: 'الجلسة الحالية',
      activeSessionDesc: 'جلسة متصفح محلية (وضع العرض التجريبي). لا توجد خوادم جلسات نشطة حالياً.',
      auditLogTitle: 'سجل العمليات الإدارية',
      trialDurationLabel: 'مدة التجربة المجانية الافتراضية (أيام)',
      trialWarningLabel: 'التنبيه قبل انتهاء التجربة (أيام)',
      currencyLabel: 'عملة المنصة',
      currencyNames: {
        MAD: 'درهم مغربي (د.م.)',
        EUR: 'يورو (€)',
        USD: 'دولار أمريكي ($)',
      },
      timezoneLabel: 'المنطقة الزمنية',
      alertsSection: 'إعدادات التنبيهات',
      notifyTrialExpiry: 'تنبيه قبل انتهاء التجربة المجانية',
      notifyOverduePayment: 'تنبيه عند تأخر الأداءات',
      backupSection: 'تصدير البيانات وإعادة الضبط',
      backupHonestNote:
        'النسخ الاحتياطي السحابي التلقائي غير مربوط بخادم حالياً؛ يمكنك تصدير نسخة كاملة للبيانات الحالية أو إعادة ضبط البيانات التجريبية.',
      exportJsonBackup: 'تصدير نسخة احتياطية',
      resetDemoData: 'إعادة ضبط البيانات التجريبية',
      confirmResetTitle: 'إعادة ضبط البيانات التجريبية',
      confirmResetMsg: 'سيتم استرجاع البيانات الأولية وحذف جميع التعديلات المحفوظة في المتصفح.',
    },
    toasts: {
      agencyAdded: 'تمت إضافة الوكالة وإنشاء حساب المدير والاشتراك بنجاح.',
      agencyUpdated: 'تم تحديث بيانات الوكالة.',
      agencyStatusUpdated: 'تم تحديث حالة الوكالة بنجاح.',
      agencySuspended: 'تم إيقاف الوكالة وتحديث اشتراكها.',
      agencyActivated: 'تم تفعيل الوكالة بنجاح.',
      subCreated: 'تم إنشاء الاشتراك وربطه بالوكالة.',
      subExtended: 'تم تمديد مدة الاشتراك بنجاح.',
      subRenewed: 'تم تجديد الاشتراك وإنشاء عملية الأداء الموافقة.',
      subPlanChanged: 'تم تحديث باقة الاشتراك بنجاح.',
      subCancelled: 'تم إلغاء الاشتراك.',
      subActivated: 'تم تفعيل الاشتراك.',
      expiryCheckDone: 'تم فحص تواريخ انتهاء الاشتراكات والتجارب.',
      planSaved: 'تم حفظ بيانات الباقة بنجاح.',
      featureSaved: 'تم حفظ الميزة بنجاح.',
      featureDeleted: 'تم حذف الميزة من الباقات.',
      paymentRecorded: 'تم تسجيل العملية بحالة قيد الانتظار للمراجعة.',
      paymentConfirmed: 'تم تأكيد الأداء وتحديث حالة الاشتراك.',
      paymentOverdue: 'تم تحديث حالة الأداء إلى متأخر.',
      paymentRefunded: 'تم تسجيل استرداد المبلغ.',
      paymentStatusUpdated: 'تم تحديث حالة الدفع والاشتراك المرتبط بنجاح.',
      userInvited: 'تمت إضافة المستخدم وإصدار دعوة مستقلة.',
      userUpdated: 'تم تحديث حالة المستخدم مع الحفاظ على سجله.',
      inviteResent: 'تم تسجيل طلب إعادة إرسال الدعوة (يتطلب خدمة بريد فعلية).',
      passwordResetQueued: 'تم تسجيل طلب رابط إعادة التعيين الآمن (يتطلب خدمة المصادقة).',
      ticketCreated: 'تم إنشاء طلب الدعم الفني.',
      replyAdded: 'تمت إضافة الرسالة إلى سجل الطلب.',
      ticketUpdated: 'تم تحديث بيانات طلب الدعم.',
      notifSaved: 'تم حفظ مسودة الإشعار.',
      notifQueued: 'تم تسجيل الإشعار في السجل المحلي (بانتظار ربط مزود الإرسال).',
      settingsSaved: 'تم حفظ إعدادات المنصة.',
      backupExported: 'تم تنزيل ملف النسخة الاحتياطية بنجاح.',
      demoReset: 'تمت استعادة البيانات التجريبية الافتراضية.',
      csvExported: 'تم تصدير التقرير الجدولي بنجاح.',
      brandingSaved: 'تم حفظ الهوية البصرية لهذه الوكالة وتطبيقها على معاينتها.',
      brandingReset: 'تمت إعادة الهوية البصرية للوكالة إلى الإعدادات الافتراضية.',
    },
  },
  fr: {
    common: {
      appTitle: 'IBONDA',
      brandInitials: 'IB',
      adminConsole: 'Console d’Administration',
      demoNoticeBadge: 'Mode Données Démo',
      demoBannerText:
        'Cette interface fonctionne avec des données démo persistées localement dans le navigateur ; l’authentification, les paiements en ligne et l’envoi de courriels requièrent un serveur.',
      search: 'Rechercher',
      filter: 'Filtrer',
      all: 'Tout',
      actions: 'Actions',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      close: 'Fermer',
      edit: 'Modifier',
      delete: 'Supprimer',
      create: 'Créer',
      add: 'Ajouter',
      viewDetails: 'Voir détails',
      backToList: 'Retour à la liste',
      resetFilters: 'Réinitialiser',
      noResults: 'Aucun résultat trouvé',
      noResultsDesc: 'Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.',
      requiredField: 'Ce champ est requis',
      invalidEmail: 'Veuillez saisir une adresse courriel valide',
      days: 'jours',
      daysLeft: 'restants',
      expiredDaysAgo: 'expiré depuis',
      yes: 'Oui',
      no: 'Non',
      loading: 'Chargement...',
      printPdf: 'Imprimer / PDF',
      exportCsv: 'Exporter CSV',
      notes: 'Notes',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour',
      unlimited: 'Illimité',
      usersCount: 'utilisateurs',
      propertiesCount: 'biens',
      month: 'Mois',
      monthShort: 'mois',
      amount: 'Montant',
      date: 'Date',
      status: 'Statut',
      languageName: { ar: 'Arabe', fr: 'Français', en: 'Anglais' },
      langShort: { ar: 'AR', fr: 'FR', en: 'EN' },
      backendRequiredNote: 'Nécessite un serveur et des interfaces d’intégration réelles en production.',
      globalSearchPlaceholder: 'Recherche rapide : agence, utilisateur, facture, ticket...',
      noSearchResults: 'Aucun résultat correspondant sur la plateforme',
      collapseSidebar: 'Réduire le menu',
      expandSidebar: 'Développer le menu',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      clearSearch: 'Effacer la recherche',
      breadcrumb: 'Fil d’Ariane',
      showing: 'Affichage',
      of: 'sur',
      previous: 'Précédent',
      next: 'Suivant',
      page: 'Page',
    },
    nav: {
      overview: 'Vue d’ensemble',
      agencies: 'Agences',
      subscriptions: 'Abonnements',
      plans: 'Offres & Fonctions',
      payments: 'Paiements & Factures',
      users: 'Utilisateurs & Rôles',
      support: 'Support Technique',
      notifications: 'Notifications',
      analytics: 'Rapports & Analyses',
      settings: 'Paramètres Plateforme',
    },
    agencyStatus: {
      free_trial: 'Essai gratuit',
      active: 'Actif',
      pending_payment: 'En attente de paiement',
      expired: 'Expiré',
      suspended: 'Suspendue',
      cancelled: 'Annulée',
    },
    paymentStatus: {
      paid: 'Payé',
      pending: 'En attente',
      overdue: 'En retard',
      refunded: 'Remboursé',
    },
    paymentMethod: {
      bank_transfer: 'Virement bancaire',
      card: 'Carte bancaire',
      cash: 'Espèces',
      check: 'Chèque',
    },
    billingCycle: {
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      annual: 'Annuel',
    },
    userRole: {
      agency_owner: 'Directeur d’agence',
      manager: 'Responsable',
      employee: 'Employé',
    },
    userStatus: {
      active: 'Actif',
      disabled: 'Désactivé',
      invited: 'Invité',
    },
    ticketType: {
      technical: 'Problème technique',
      account: 'Problème de compte',
      subscription: 'Problème d’abonnement',
      integration: 'Intégration externe',
      help: 'Demande d’assistance',
      suggestion: 'Suggestion produit',
    },
    ticketPriority: {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      urgent: 'Urgente',
    },
    ticketStatus: {
      new: 'Nouveau',
      in_progress: 'En cours',
      waiting_agency: 'Attente agence',
      resolved: 'Résolu',
      closed: 'Fermé',
    },
    notificationType: {
      general: 'Annonce générale (toutes agences)',
      agency_specific: 'Notification ciblée (agence)',
      subscription: 'Alerte abonnement',
      payment: 'Alerte paiement',
      maintenance: 'Maintenance planifiée',
      update: 'Nouvelle mise à jour',
      admin: 'Avis administratif',
    },
    notificationStatus: {
      draft: 'Brouillon',
      queued_demo: 'Journalisé (fournisseur d’envoi requis)',
    },
    integrationProvider: {
      meta_ads: 'Publicités Meta et Facebook',
      instagram: 'Instagram Entreprise',
      whatsapp_business: 'Messagerie WhatsApp Pro',
      google_sheets: 'Feuilles de calcul Google',
      automation_webhooks: 'Automatisations et flux',
    },
    integrationStatus: {
      connected: 'Connecté',
      not_connected: 'Non connecté',
      connection_required: 'Connexion requise',
      connection_error: 'Erreur de connexion',
    },
    overview: {
      title: 'Vue d’ensemble IBONDA',
      subtitle: 'Synthèse en temps réel des agences immobilières actives, abonnements et revenus calculés.',
      totalAgencies: 'Total Agences',
      activeAgencies: 'Agences Actives',
      trialAgencies: 'En Essai Gratuit',
      expiredAgencies: 'Abonnements Expirés',
      pendingPaymentAgencies: 'Attente Paiement',
      totalRevenue: 'Revenus Totaux',
      monthlyRevenue: 'Revenus Mensuels',
      duePayments: 'Paiements Dus',
      chartAgencyGrowth: 'Évolution du nombre d’agences',
      chartMonthlyRevenue: 'Évolution des revenus mensuels',
      chartStatusDist: 'Répartition par statut d’abonnement',
      chartTrialsVsPaid: 'Essais gratuits vs Abonnements payants',
      recentActivities: 'Activités Récentes',
      quickActions: 'Actions Rapides',
      addAgency: 'Nouvelle agence',
      addPlan: 'Nouvelle offre',
      sendNotification: 'Envoyer notification',
      viewDuePayments: 'Voir paiements dus',
      trialsLabel: 'Essais gratuits',
      paidLabel: 'Payants',
    },
    agencies: {
      title: 'Gestion des Agences Immobilières',
      subtitle: 'Agences utilisant activement la plateforme IBONDA en période d’essai ou sous abonnement.',
      addAgency: 'Ajouter une agence',
      editAgency: 'Modifier l’agence',
      searchPlaceholder: 'Rechercher par agence, directeur ou courriel...',
      filterStatus: 'Statut',
      filterPlan: 'Offre',
      filterCity: 'Ville',
      viewModeTable: 'Vue tableau',
      viewModePackGrid: 'Grille par offre',
      allPacks: 'Toutes les offres',
      packDistributionTitle: 'Répartition des agences par offre',
      packAgencyCount: 'agences',
      emptyPackNote: 'Aucune agence ne correspond aux filtres dans cette offre.',
      poweredByPlatform: 'Propulsé par IBONDA',
      colAgency: 'Agence',
      colManager: 'Directeur',
      colContact: 'Contact',
      colPlan: 'Offre actuelle',
      colPeriod: 'Période',
      colStatus: 'Statut',
      contactAction: 'Contacter',
      contactWhatsapp: 'WhatsApp',
      contactCall: 'Appel normal',
      agencyPhoneLabel: 'Téléphone agence',
      managerPhoneLabel: 'Téléphone directeur',
      agencyInfoSection: 'Informations de l’agence',
      managerInfoSection: 'Informations du directeur',
      subscriptionInfoSection: 'Informations d’abonnement',
      agencyName: 'Nom de l’agence',
      nameAr: 'Nom de l’agence (Arabe)',
      nameFr: 'Nom de l’agence (Français)',
      nameEn: 'Nom de l’agence (Anglais)',
      city: 'Ville',
      cityAr: 'Ville (Arabe)',
      cityFr: 'Ville (Français)',
      cityEn: 'Ville (Anglais)',
      address: 'Adresse',
      addressAr: 'Adresse (Arabe)',
      addressFr: 'Adresse (Français)',
      addressEn: 'Adresse (Anglais)',
      phone: 'Téléphone',
      email: 'Courriel de l’agence',
      logoColor: 'Couleur d’identité',
      managerFullName: 'Nom complet du directeur',
      managerNameAr: 'Nom du directeur (Arabe)',
      managerNameFr: 'Nom du directeur (Français)',
      managerNameEn: 'Nom du directeur (Anglais)',
      managerEmail: 'Courriel du directeur',
      managerPhone: 'Téléphone du directeur',
      multilingualHint: 'Saisissez les champs multilingues pour adapter automatiquement les noms et villes selon la langue choisie.',
      selectPlan: 'Sélectionner l’offre',
      startDate: 'Date de début',
      durationDays: 'Durée (jours)',
      endDate: 'Date de fin',
      initialStatus: 'Statut initial',
      adminNotes: 'Notes administratives',
      detailsTitle: 'Dossier de l’agence',
      employeesTitle: 'Collaborateurs rattachés',
      paymentsTitle: 'Paiements et factures',
      integrationsTitle: 'État des intégrations externes',
      integrationsNote:
        'La connexion réelle aux plateformes tierces requiert une autorisation serveur sécurisée. Aucun mot de passe tiers n’est collecté ici.',
      activityTitle: 'Journal d’activité',
      changePlan: 'Changer d’offre',
      extendSub: 'Prolonger',
      suspendAgency: 'Suspendre l’agence',
      activateAgency: 'Activer l’agence',
      cancelSub: 'Annuler l’abonnement',
      previewPortal: 'Aperçu portail agence',
      previewTitle: 'Aperçu du tableau de bord agence',
      previewReadOnlyNotice: 'Aperçu en lecture seule basé sur les modules inclus dans l’offre actuelle.',
      previewEnabledFeatures: 'Fonctionnalités incluses dans l’offre',
      previewLockedFeatures: 'Fonctionnalités non incluses',
      confirmSuspendTitle: 'Confirmer la suspension',
      confirmSuspendMsg: 'La suspension bloque temporairement l’accès de l’agence tout en conservant toutes ses données.',
      confirmCancelTitle: 'Confirmer l’annulation',
      confirmCancelMsg: 'Voulez-vous vraiment annuler l’abonnement de cette agence ?',
      saveNotes: 'Enregistrer les notes',
      viewUsers: 'Voir les utilisateurs',
      overviewTab: 'Aperçu & Dossier',
      brandingTab: 'Identité visuelle',
      brandingTitle: 'Identité Visuelle de l’Agence',
      brandingSubtitle: 'Personnalisez le logo et la palette du portail de cette agence indépendamment d’IBONDA et des autres agences.',
      uploadLogo: 'Téléverser le logo',
      removeLogo: 'Retirer le logo',
      uploadBanner: 'Bannière optionnelle',
      removeBanner: 'Retirer la bannière',
      displayName: 'Nom affiché dans le portail agence',
      primaryColor: 'Couleur principale',
      secondaryColor: 'Couleur secondaire',
      accentColor: 'Couleur d’accentuation',
      livePreviewTitle: 'Aperçu en direct du portail agence',
      previewNote: 'Prévisualisation fidèle du tableau de bord agence avec son thème et les modules de son offre.',
      resetBranding: 'Réinitialiser par défaut',
      saveBranding: 'Enregistrer l’identité',
      lowContrastWarning: 'Alerte contraste : cette teinte peut réduire la lisibilité ; privilégiez une couleur plus contrastée.',
      isolationNotice: 'Cette identité s’applique exclusivement à cette agence et ne modifie ni la console IBONDA ni les autres agences.',
      previewSidebarHome: 'Accueil',
      previewSidebarProperties: 'Biens',
      previewSidebarClients: 'Clients (GRC)',
      previewSidebarVisits: 'Visites',
      previewStatProperties: 'Biens actifs',
      previewStatLeads: 'Prospects actifs',
      previewStatVisits: 'Visites semaine',
      previewPrimaryBtn: 'Ajouter un bien',
      previewAccentBtn: 'Planifier visite',
      previewTableTitle: 'Derniers biens enregistrés',
      previewRowProp1: 'Appartement Standing — Anfa',
      previewRowProp2: 'Villa Contemporaine — Souissi',
      previewRowProp3: 'Bureau Direction — Centre',
    },
    subscriptions: {
      title: 'Gestion des Abonnements',
      subtitle: 'Suivi des essais gratuits (7 jours), abonnements actifs, renouvellements et échéances.',
      createSub: 'Créer un abonnement',
      runExpiryCheck: 'Vérifier les expirations',
      tabAll: 'Tous',
      tabTrial: 'Essais gratuits',
      tabActive: 'Actifs',
      tabPending: 'Attente paiement',
      tabExpired: 'Expirés',
      tabSuspended: 'Suspendus',
      tabCancelled: 'Annulés',
      colAgency: 'Agence',
      colPlan: 'Offre',
      colStart: 'Début',
      colEnd: 'Fin',
      colRemaining: 'Jours restants',
      colPrice: 'Prix',
      colPaymentStatus: 'Paiement',
      colSubStatus: 'Statut',
      trialAlertExpiring: 'Alerte : essai proche de l’expiration',
      trialBadge: 'Essai 7 j',
      extendAction: 'Prolonger',
      renewAction: 'Renouveler',
      changePlanAction: 'Changer offre',
      convertTrialAction: 'Convertir en payant',
      activateAfterPayment: 'Activer après paiement',
      suspendAction: 'Suspendre',
      cancelAction: 'Annuler',
      historyAction: 'Historique',
      historyTitle: 'Historique des abonnements',
      convertTrialModalTitle: 'Convertir l’essai gratuit en abonnement payant',
      convertTrialRuleNote: 'Un essai gratuit ne passe jamais en abonnement actif sans consentement et enregistrement/confirmation d’un paiement.',
      confirmPaymentNow: 'Enregistrer et confirmer le paiement maintenant',
      createPendingPayment: 'Créer une facture en attente de paiement',
      extendDaysLabel: 'Jours supplémentaires',
      confirmSuspendMsg: 'Confirmer la suspension de cet abonnement ?',
      confirmCancelMsg: 'Confirmer l’annulation définitive de cet abonnement ?',
    },
    plans: {
      title: 'Offres & Fonctionnalités',
      subtitle: 'Configurez vos offres, limites de capacité et matrice de fonctionnalités.',
      addPlan: 'Nouvelle offre',
      editPlan: 'Modifier l’offre',
      manageFeatures: 'Gérer les fonctionnalités',
      addFeature: 'Ajouter une fonctionnalité',
      editFeature: 'Modifier la fonctionnalité',
      planNameAr: 'Nom (Arabe)',
      planNameFr: 'Nom (Français)',
      planNameEn: 'Nom (Anglais)',
      descAr: 'Description (Arabe)',
      descFr: 'Description (Français)',
      descEn: 'Description (Anglais)',
      price: 'Prix',
      billingCycle: 'Cycle de facturation',
      durationDays: 'Durée (jours)',
      maxUsers: 'Utilisateurs max',
      maxProperties: 'Biens max',
      includedFeatures: 'Fonctionnalités incluses',
      planStatus: 'Statut de l’offre',
      activeLabel: 'Active',
      inactiveLabel: 'Inactive',
      comparisonMatrix: 'Matrice comparative des offres',
      featureName: 'Fonctionnalité',
      planChangeRuleNote: 'Les modifications d’une offre s’appliquent aux nouveaux abonnements sans modifier automatiquement les contrats existants.',
      confirmDeleteFeature: 'Supprimer cette fonctionnalité du catalogue et de toutes les offres ?',
      featureInUseWarning: 'Cette fonctionnalité est utilisée par une ou plusieurs offres.',
    },
    payments: {
      title: 'Paiements & Factures',
      subtitle: 'Suivez les encaissements, validez les règlements manuellement et éditez des factures PDF.',
      recordPayment: 'Enregistrer un paiement',
      totalRevenue: 'Revenus confirmés',
      monthRevenue: 'Revenus du mois',
      duePayments: 'Paiements en attente',
      overduePayments: 'Paiements en retard',
      completedCount: 'Paiements complétés',
      colRef: 'Référence',
      colAgency: 'Agence',
      colPlan: 'Offre',
      colAmount: 'Montant',
      colDate: 'Date paiement',
      colPaymentDate: 'Date paiement',
      colDueDate: 'Échéance',
      colTiming: 'Retard / Restant',
      colContact: 'Contact',
      colMethod: 'Méthode',
      colStatus: 'Statut',
      daysOverdue: 'En retard',
      daysRemaining: 'Restants',
      dueToday: 'Échu aujourd’hui',
      paidOnTime: 'Payé à temps',
      paidLateDays: 'Payé avec retard',
      notPaidYet: 'Non payé',
      selectAgency: 'Sélectionner l’agence',
      selectSubscription: 'Abonnement associé',
      transactionRef: 'Référence de transaction',
      paymentDate: 'Date de paiement',
      dueDate: 'Date d’échéance',
      method: 'Méthode de paiement',
      confirmPaymentAction: 'Confirmer paiement',
      markOverdueAction: 'Marquer en retard',
      refundAction: 'Rembourser',
      viewInvoice: 'Voir facture',
      invoiceTitle: 'Facture officielle',
      invoiceNumber: 'Facture N°',
      billedTo: 'Facturé à',
      issuedBy: 'Émis par',
      paymentRuleNotice: 'Un paiement créé démarre toujours en « En attente » et n’active l’abonnement qu’après validation administrative ou passerelle réelle.',
      confirmPaymentTitle: 'Valider l’encaissement',
      confirmPaymentMsg: 'Confirmer ce paiement mettra à jour le chiffre d’affaires et activera l’abonnement lié s’il est en attente.',
      confirmRefundTitle: 'Confirmer le remboursement',
      confirmRefundMsg: 'Voulez-vous vraiment marquer cette transaction comme remboursée ?',
    },
    users: {
      title: 'Utilisateurs & Permissions',
      subtitle: 'Comptes individuels des directeurs, responsables et employés rattachés à leurs agences.',
      inviteUser: 'Inviter un utilisateur',
      searchPlaceholder: 'Rechercher par nom, courriel ou agence...',
      colUser: 'Utilisateur',
      colContact: 'Coordonnées',
      colAgency: 'Agence',
      colRole: 'Rôle',
      colStatus: 'Statut',
      colLastLogin: 'Dernière connexion',
      neverLoggedIn: 'Jamais connecté',
      fullName: 'Nom complet',
      email: 'Courriel professionnel unique',
      phone: 'Téléphone',
      agency: 'Agence rattachée',
      role: 'Rôle',
      securityRuleNote: 'Chaque utilisateur dispose d’un compte isolé par agence. Aucun mot de passe en clair n’est stocké ni affiché.',
      userDetailsTitle: 'Fiche utilisateur',
      disableAccount: 'Désactiver le compte',
      enableAccount: 'Activer le compte',
      resendInvite: 'Renvoyer l’invitation',
      resetPassword: 'Réinitialiser mot de passe',
      activityLog: 'Journal d’activité',
      confirmDisableTitle: 'Désactiver le compte utilisateur',
      confirmDisableMsg: 'L’accès sera révoqué mais l’historique et les données de l’utilisateur resteront intactes.',
      duplicateEmailError: 'Cette adresse courriel est déjà associée à un autre compte.',
    },
    support: {
      title: 'Support Technique',
      subtitle: 'Centralisez les demandes des agences, répondez aux tickets et consignez des notes internes.',
      newTicket: 'Nouveau ticket',
      colCode: 'Ticket',
      colAgency: 'Agence',
      colSubject: 'Sujet',
      colType: 'Catégorie',
      colDate: 'Créé le',
      colPriority: 'Priorité',
      colStatus: 'Statut',
      ticketDetails: 'Détails du ticket',
      description: 'Description',
      attachments: 'Pièces jointes',
      conversation: 'Fil de discussion',
      publicReply: 'Réponse à l’agence',
      internalNote: 'Note interne (masquée à l’agence)',
      internalNoteBadge: 'Note interne',
      replyPlaceholder: 'Rédiger une réponse visible par l’agence...',
      internalPlaceholder: 'Ajouter une note interne pour l’équipe IBONDA...',
      sendReply: 'Envoyer la réponse',
      saveInternalNote: 'Enregistrer note interne',
      changeStatus: 'Statut',
      changePriority: 'Priorité',
      selectTicketPrompt: 'Sélectionnez un ticket dans le tableau pour consulter le fil et répondre.',
    },
    notifications: {
      title: 'Notifications',
      subtitle: 'Rédigez et gérez les communications destinées aux agences immobilières.',
      createNotification: 'Créer une notification',
      editNotification: 'Modifier la notification',
      honestDeliveryNotice:
        'Avertissement d’intégration : aucun service d’envoi de courriel ou de messagerie instantanée n’est connecté ; l’envoi journalise uniquement la notification localement.',
      notifTitle: 'Titre',
      notifContent: 'Contenu du message',
      notifType: 'Type',
      recipientScope: 'Destinataires',
      allAgencies: 'Toutes les agences',
      specificAgency: 'Agence spécifique',
      scheduledDate: 'Date d’envoi',
      saveDraft: 'Enregistrer brouillon',
      dispatchAction: 'Journaliser l’envoi',
      historyTitle: 'Historique des notifications',
      colTitle: 'Titre',
      colType: 'Type',
      colRecipients: 'Destinataires',
      colDate: 'Date',
      colStatus: 'Statut',
    },
    analytics: {
      title: 'Rapports & Analyses',
      subtitle: 'Indicateurs de croissance, conversion d’essais, rétention et revenu moyen par agence.',
      range7d: '7 derniers jours',
      range30d: '30 derniers jours',
      range3m: '3 derniers mois',
      range6m: '6 derniers mois',
      range1y: 'Dernière année',
      rangeCustom: 'Période personnalisée',
      from: 'Du',
      to: 'Au',
      totalAgencies: 'Total agences',
      newAgencies: 'Nouvelles agences (période)',
      activeSubs: 'Abonnements actifs',
      trialConversionRate: 'Conversion des essais',
      churnRate: 'Taux d’annulation',
      renewalRate: 'Taux de renouvellement',
      totalRevenue: 'Revenus (période)',
      arpa: 'Revenu moyen / agence',
      chartMonthlyGrowth: 'Croissance mensuelle des agences',
      chartRevenueTrend: 'Courbe des revenus',
      chartSubsByPlan: 'Abonnements par offre',
      chartTrialsVsSubs: 'Essais vs Abonnements payants',
      chartExpiredVsRenewed: 'Expirés vs Renouvelés',
    },
    settings: {
      title: 'Paramètres de la Plateforme',
      subtitle: 'Configuration générale d’IBONDA, préférences linguistiques, sécurité et sauvegardes.',
      tabGeneral: 'Informations générales',
      tabLanguage: 'Langues',
      tabAccount: 'Compte administrateur',
      tabSecurity: 'Sécurité & Audit',
      tabSystem: 'Système & Sauvegarde',
      platformName: 'Nom de la plateforme',
      officialEmail: 'Courriel officiel',
      officialPhone: 'Téléphone officiel',
      platformDesc: 'Description',
      defaultLanguage: 'Langue par défaut',
      enabledLanguages: 'Langues activées',
      rtlTag: 'Droite à gauche',
      ltrTag: 'Gauche à droite',
      adminName: 'Nom de l’administrateur',
      adminEmail: 'Courriel de l’administrateur',
      passwordAuthNotice: 'La modification du mot de passe et le contrôle réel des sessions exigent un serveur d’authentification sécurisé.',
      twoFactorLabel: 'Exiger la double authentification pour les administrateurs',
      sessionTimeoutLabel: 'Expiration de session (minutes)',
      activeSessionTitle: 'Session active',
      activeSessionDesc: 'Session locale du navigateur (mode démo). Aucun serveur de session distant connecté.',
      auditLogTitle: 'Journal d’audit administratif',
      trialDurationLabel: 'Durée d’essai par défaut (jours)',
      trialWarningLabel: 'Seuil d’alerte avant expiration (jours)',
      currencyLabel: 'Devise',
      currencyNames: {
        MAD: 'Dirham marocain (MAD)',
        EUR: 'Euro (€)',
        USD: 'Dollar américain ($)',
      },
      timezoneLabel: 'Fuseau horaire',
      alertsSection: 'Alertes système',
      notifyTrialExpiry: 'Alerter avant expiration d’essai',
      notifyOverduePayment: 'Alerter en cas de retard de paiement',
      backupSection: 'Export & Réinitialisation',
      backupHonestNote: 'Les sauvegardes distantes automatiques ne sont pas actives sans serveur ; vous pouvez exporter les données JSON localement ou réinitialiser la démo.',
      exportJsonBackup: 'Exporter JSON',
      resetDemoData: 'Réinitialiser les données démo',
      confirmResetTitle: 'Réinitialiser la démonstration',
      confirmResetMsg: 'Toutes les modifications locales seront effacées et remplacées par le jeu de données initial.',
    },
    toasts: {
      agencyAdded: 'Agence, compte directeur et abonnement créés avec succès.',
      agencyUpdated: 'Informations de l’agence mises à jour.',
      agencyStatusUpdated: 'Statut de l’agence mis à jour.',
      agencySuspended: 'Agence suspendue et abonnement mis à jour.',
      agencyActivated: 'Agence activée avec succès.',
      subCreated: 'Abonnement créé et lié à l’agence.',
      subExtended: 'Abonnement prolongé avec succès.',
      subRenewed: 'Abonnement renouvelé avec facture associée.',
      subPlanChanged: 'Offre d’abonnement modifiée.',
      subCancelled: 'Abonnement annulé.',
      subActivated: 'Abonnement activé.',
      expiryCheckDone: 'Vérification des échéances terminée.',
      planSaved: 'Offre enregistrée avec succès.',
      featureSaved: 'Fonctionnalité enregistrée.',
      featureDeleted: 'Fonctionnalité supprimée du catalogue.',
      paymentRecorded: 'Paiement enregistré en attente de validation.',
      paymentConfirmed: 'Paiement confirmé et abonnement mis à jour.',
      paymentOverdue: 'Paiement marqué en retard.',
      paymentRefunded: 'Remboursement enregistré.',
      paymentStatusUpdated: 'Statut du paiement mis à jour avec synchronisation.',
      userInvited: 'Utilisateur ajouté avec invitation individuelle.',
      userUpdated: 'Statut mis à jour (historique conservé).',
      inviteResent: 'Renvoi d’invitation journalisé (service courriel requis).',
      passwordResetQueued: 'Demande de réinitialisation journalisée (serveur d’authentification requis).',
      ticketCreated: 'Ticket de support créé.',
      replyAdded: 'Message ajouté au ticket.',
      ticketUpdated: 'Ticket mis à jour.',
      notifSaved: 'Brouillon de notification enregistré.',
      notifQueued: 'Notification enregistrée localement (fournisseur d’envoi requis).',
      settingsSaved: 'Paramètres enregistrés.',
      backupExported: 'Sauvegarde JSON téléchargée.',
      demoReset: 'Données démo réinitialisées.',
      csvExported: 'Rapport CSV exporté avec succès.',
      brandingSaved: 'Identité visuelle de l’agence enregistrée.',
      brandingReset: 'Identité visuelle réinitialisée aux valeurs par défaut.',
    },
  },
  en: {
    common: {
      appTitle: 'IBONDA',
      brandInitials: 'IB',
      adminConsole: 'Admin Control Plane',
      demoNoticeBadge: 'Local Demo State',
      demoBannerText:
        'This dashboard runs on interconnected demo data persisted in your browser; authentication, live payments, and email delivery require a backend server.',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      add: 'Add',
      viewDetails: 'View details',
      backToList: 'Back to list',
      resetFilters: 'Reset filters',
      noResults: 'No matching records',
      noResultsDesc: 'Try adjusting your search query or clearing active filters.',
      requiredField: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      days: 'days',
      daysLeft: 'left',
      expiredDaysAgo: 'expired',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      printPdf: 'Print / PDF',
      exportCsv: 'Export CSV',
      notes: 'Notes',
      createdAt: 'Created',
      updatedAt: 'Updated',
      unlimited: 'Unlimited',
      usersCount: 'users',
      propertiesCount: 'properties',
      month: 'Month',
      monthShort: 'mo',
      amount: 'Amount',
      date: 'Date',
      status: 'Status',
      languageName: { ar: 'Arabic', fr: 'French', en: 'English' },
      langShort: { ar: 'AR', fr: 'FR', en: 'EN' },
      backendRequiredNote: 'Requires a production backend server and real API/OAuth credentials.',
      globalSearchPlaceholder: 'Quick search agencies, users, invoices, tickets...',
      noSearchResults: 'No matching results across the platform',
      collapseSidebar: 'Collapse sidebar',
      expandSidebar: 'Expand sidebar',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      clearSearch: 'Clear search',
      breadcrumb: 'Breadcrumb',
      showing: 'Showing',
      of: 'of',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
    },
    nav: {
      overview: 'Overview',
      agencies: 'Agencies',
      subscriptions: 'Subscriptions',
      plans: 'Plans & Features',
      payments: 'Payments & Invoices',
      users: 'Users & Permissions',
      support: 'Support',
      notifications: 'Notifications',
      analytics: 'Analytics & Reports',
      settings: 'Platform Settings',
    },
    agencyStatus: {
      free_trial: 'Free Trial',
      active: 'Active',
      pending_payment: 'Pending Payment',
      expired: 'Expired',
      suspended: 'Suspended',
      cancelled: 'Cancelled',
    },
    paymentStatus: {
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      refunded: 'Refunded',
    },
    paymentMethod: {
      bank_transfer: 'Bank Transfer',
      card: 'Card',
      cash: 'Cash',
      check: 'Check',
    },
    billingCycle: {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      annual: 'Annual',
    },
    userRole: {
      agency_owner: 'Agency Owner',
      manager: 'Manager',
      employee: 'Employee',
    },
    userStatus: {
      active: 'Active',
      disabled: 'Disabled',
      invited: 'Invited',
    },
    ticketType: {
      technical: 'Technical Issue',
      account: 'Account Issue',
      subscription: 'Subscription Issue',
      integration: 'Service Integration',
      help: 'Help Request',
      suggestion: 'Feature Suggestion',
    },
    ticketPriority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    },
    ticketStatus: {
      new: 'New',
      in_progress: 'In Progress',
      waiting_agency: 'Waiting for Agency',
      resolved: 'Resolved',
      closed: 'Closed',
    },
    notificationType: {
      general: 'General (All Agencies)',
      agency_specific: 'Specific Agency',
      subscription: 'Subscription Alert',
      payment: 'Payment Alert',
      maintenance: 'Maintenance Notice',
      update: 'Product Update',
      admin: 'Administrative Notice',
    },
    notificationStatus: {
      draft: 'Draft',
      queued_demo: 'Logged Locally (Delivery Provider Required)',
    },
    integrationProvider: {
      meta_ads: 'Meta / Facebook Ads',
      instagram: 'Instagram Business',
      whatsapp_business: 'WhatsApp Business API',
      google_sheets: 'Google Sheets',
      automation_webhooks: 'Automation & Webhooks',
    },
    integrationStatus: {
      connected: 'Connected',
      not_connected: 'Not Connected',
      connection_required: 'Connection Required',
      connection_error: 'Connection Error',
    },
    overview: {
      title: 'IBONDA Platform Overview',
      subtitle: 'Live operational summary computed directly from active agencies, subscriptions, and payment records.',
      totalAgencies: 'Total Agencies',
      activeAgencies: 'Active Agencies',
      trialAgencies: 'In Free Trial',
      expiredAgencies: 'Expired Subscriptions',
      pendingPaymentAgencies: 'Pending Payment',
      totalRevenue: 'Total Revenue',
      monthlyRevenue: 'Monthly Revenue',
      duePayments: 'Due Payments',
      chartAgencyGrowth: 'Agency Growth Over Months',
      chartMonthlyRevenue: 'Monthly Revenue Trend',
      chartStatusDist: 'Agencies by Subscription Status',
      chartTrialsVsPaid: 'Free Trials vs Paid Subscriptions',
      recentActivities: 'Recent Activity',
      quickActions: 'Quick Actions',
      addAgency: 'Add New Agency',
      addPlan: 'Add New Plan',
      sendNotification: 'Send Notification',
      viewDuePayments: 'View Due Payments',
      trialsLabel: 'Free Trials',
      paidLabel: 'Paid Plans',
    },
    agencies: {
      title: 'Real Estate Agencies',
      subtitle: 'Agencies actively using IBONDA in a free trial or paid subscription.',
      addAgency: 'Add New Agency',
      editAgency: 'Edit Agency',
      searchPlaceholder: 'Search by agency, manager, or email...',
      filterStatus: 'Status',
      filterPlan: 'Plan',
      filterCity: 'City',
      viewModeTable: 'Table View',
      viewModePackGrid: 'Grouped by Pack',
      allPacks: 'All Packs',
      packDistributionTitle: 'Agencies Grouped by Subscription Pack',
      packAgencyCount: 'agencies',
      emptyPackNote: 'No agencies match the active filters in this pack.',
      poweredByPlatform: 'Powered by IBONDA',
      colAgency: 'Agency',
      colManager: 'Manager',
      colContact: 'Contact',
      colPlan: 'Current Plan',
      colPeriod: 'Subscription Period',
      colStatus: 'Status',
      contactAction: 'Contact',
      contactWhatsapp: 'WhatsApp',
      contactCall: 'Voice Call',
      agencyPhoneLabel: 'Agency Phone',
      managerPhoneLabel: 'Manager Phone',
      agencyInfoSection: 'Agency Information',
      managerInfoSection: 'Manager Information',
      subscriptionInfoSection: 'Subscription Information',
      agencyName: 'Agency Name',
      nameAr: 'Agency Name (Arabic)',
      nameFr: 'Agency Name (French)',
      nameEn: 'Agency Name (English)',
      city: 'City',
      cityAr: 'City (Arabic)',
      cityFr: 'City (French)',
      cityEn: 'City (English)',
      address: 'Address',
      addressAr: 'Address (Arabic)',
      addressFr: 'Address (French)',
      addressEn: 'Address (English)',
      phone: 'Phone Number',
      email: 'Agency Email',
      logoColor: 'Brand Color',
      managerFullName: 'Manager Full Name',
      managerNameAr: 'Manager Name (Arabic)',
      managerNameFr: 'Manager Name (French)',
      managerNameEn: 'Manager Name (English)',
      managerEmail: 'Manager Email',
      managerPhone: 'Manager Phone',
      multilingualHint: 'Enter localized fields so agency names, cities, and manager names translate cleanly when switching UI languages.',
      selectPlan: 'Select Plan',
      startDate: 'Start Date',
      durationDays: 'Duration (days)',
      endDate: 'End Date',
      initialStatus: 'Initial Status',
      adminNotes: 'Admin Notes',
      detailsTitle: 'Agency Profile',
      employeesTitle: 'Agency Staff & Users',
      paymentsTitle: 'Payments & Invoices',
      integrationsTitle: 'External Service Connections',
      integrationsNote:
        'Live connections to Meta, Instagram, WhatsApp, and Google Sheets require server-side OAuth and API configuration. External account passwords are never requested here.',
      activityTitle: 'Agency Activity Log',
      changePlan: 'Change Plan',
      extendSub: 'Extend Subscription',
      suspendAgency: 'Suspend Agency',
      activateAgency: 'Activate Agency',
      cancelSub: 'Cancel Subscription',
      previewPortal: 'Preview Agency Dashboard',
      previewTitle: 'Agency Portal Capability Preview',
      previewReadOnlyNotice: 'Read-only preview reflecting the modules unlocked by this agency’s current plan.',
      previewEnabledFeatures: 'Enabled Modules in Current Plan',
      previewLockedFeatures: 'Modules Not Included in Current Plan',
      confirmSuspendTitle: 'Confirm Agency Suspension',
      confirmSuspendMsg: 'Suspending this agency pauses portal access and subscription status while preserving all historical data.',
      confirmCancelTitle: 'Confirm Subscription Cancellation',
      confirmCancelMsg: 'Are you sure you want to cancel this agency’s subscription?',
      saveNotes: 'Save Notes',
      viewUsers: 'View Users',
      overviewTab: 'Profile & Operations',
      brandingTab: 'Agency Branding',
      brandingTitle: 'Agency Branding & White-Label Identity',
      brandingSubtitle: 'Customize this agency’s logo and color palette independently from IBONDA Admin and all other agencies.',
      uploadLogo: 'Upload Logo',
      removeLogo: 'Remove Logo',
      uploadBanner: 'Optional Header Image',
      removeBanner: 'Remove Banner',
      displayName: 'Display Name inside Agency Portal',
      primaryColor: 'Primary Color',
      secondaryColor: 'Secondary Color',
      accentColor: 'Accent Color',
      livePreviewTitle: 'Live Agency Dashboard Preview',
      previewNote: 'Real-time preview of this agency’s portal reflecting its custom identity and active plan modules.',
      resetBranding: 'Reset to Default',
      saveBranding: 'Save Branding',
      lowContrastWarning: 'Contrast warning: this color may reduce text legibility; consider a higher-contrast shade.',
      isolationNotice: 'Branding changes apply exclusively to this agency’s portal and never alter IBONDA Admin or any other agency.',
      previewSidebarHome: 'Home',
      previewSidebarProperties: 'Properties',
      previewSidebarClients: 'Clients (CRM)',
      previewSidebarVisits: 'Viewings',
      previewStatProperties: 'Active Listings',
      previewStatLeads: 'Active Leads',
      previewStatVisits: 'Weekly Viewings',
      previewPrimaryBtn: 'Add Listing',
      previewAccentBtn: 'Schedule Tour',
      previewTableTitle: 'Recent Agency Listings',
      previewRowProp1: 'Luxury Apartment — Anfa',
      previewRowProp2: 'Modern Villa — Souissi',
      previewRowProp3: 'Executive Office — Downtown',
    },
    subscriptions: {
      title: 'Subscriptions',
      subtitle: 'Manage 7-day free trials, active subscriptions, renewals, and payment-gated activations.',
      createSub: 'Create Subscription',
      runExpiryCheck: 'Run Expiry Check',
      tabAll: 'All',
      tabTrial: 'Free Trials',
      tabActive: 'Active',
      tabPending: 'Pending Payment',
      tabExpired: 'Expired',
      tabSuspended: 'Suspended',
      tabCancelled: 'Cancelled',
      colAgency: 'Agency',
      colPlan: 'Plan',
      colStart: 'Start Date',
      colEnd: 'End Date',
      colRemaining: 'Time Remaining',
      colPrice: 'Price',
      colPaymentStatus: 'Payment',
      colSubStatus: 'Status',
      trialAlertExpiring: 'Alert: Trial expiring soon',
      trialBadge: '7-Day Trial',
      extendAction: 'Extend',
      renewAction: 'Renew',
      changePlanAction: 'Change Plan',
      convertTrialAction: 'Convert to Paid',
      activateAfterPayment: 'Activate After Payment',
      suspendAction: 'Suspend',
      cancelAction: 'Cancel',
      historyAction: 'History',
      historyTitle: 'Past Subscription History',
      convertTrialModalTitle: 'Convert Free Trial to Paid Subscription',
      convertTrialRuleNote:
        'By platform rule, a free trial never converts to an active paid subscription without explicit consent and a recorded/confirmed payment.',
      confirmPaymentNow: 'Record & Confirm Payment Now (Activate)',
      createPendingPayment: 'Create Pending Payment Invoice',
      extendDaysLabel: 'Additional Days',
      confirmSuspendMsg: 'Confirm suspending this subscription? The linked agency status will update immediately.',
      confirmCancelMsg: 'Confirm permanently cancelling this subscription?',
    },
    plans: {
      title: 'Plans & Features',
      subtitle: 'Create and edit subscription tiers, feature entitlements, and numeric capacity limits.',
      addPlan: 'Add New Plan',
      editPlan: 'Edit Plan',
      manageFeatures: 'Manage Features',
      addFeature: 'Add Feature',
      editFeature: 'Edit Feature',
      planNameAr: 'Plan Name (Arabic)',
      planNameFr: 'Plan Name (French)',
      planNameEn: 'Plan Name (English)',
      descAr: 'Description (Arabic)',
      descFr: 'Description (French)',
      descEn: 'Description (English)',
      price: 'Price',
      billingCycle: 'Billing Cycle',
      durationDays: 'Duration (days)',
      maxUsers: 'Max Users',
      maxProperties: 'Max Properties',
      includedFeatures: 'Included Features',
      planStatus: 'Plan Status',
      activeLabel: 'Active',
      inactiveLabel: 'Inactive',
      comparisonMatrix: 'Plan Comparison Matrix',
      featureName: 'Feature',
      planChangeRuleNote: 'Plan edits apply cleanly to new subscriptions and never silently overwrite existing agency contracts.',
      confirmDeleteFeature: 'Delete this feature and remove it from all plans?',
      featureInUseWarning: 'This feature is currently assigned to one or more plans.',
    },
    payments: {
      title: 'Payments & Invoices',
      subtitle: 'Track agency payments, perform administrative payment confirmations, and print PDF invoices.',
      recordPayment: 'Record Payment',
      totalRevenue: 'Confirmed Revenue',
      monthRevenue: 'This Month Revenue',
      duePayments: 'Due / Pending',
      overduePayments: 'Overdue Payments',
      completedCount: 'Completed Payments',
      colRef: 'Transaction Ref',
      colAgency: 'Agency',
      colPlan: 'Plan',
      colAmount: 'Amount',
      colDate: 'Payment Date',
      colPaymentDate: 'Payment Date',
      colDueDate: 'Due Date',
      colTiming: 'Overdue / Remaining',
      colContact: 'Contact',
      colMethod: 'Method',
      colStatus: 'Status',
      daysOverdue: 'Overdue',
      daysRemaining: 'Remaining',
      dueToday: 'Due today',
      paidOnTime: 'Paid on time',
      paidLateDays: 'Paid late',
      notPaidYet: 'Not paid yet',
      selectAgency: 'Select Agency',
      selectSubscription: 'Linked Subscription',
      transactionRef: 'Transaction Reference',
      paymentDate: 'Payment Date',
      dueDate: 'Due Date',
      method: 'Payment Method',
      confirmPaymentAction: 'Confirm Payment',
      markOverdueAction: 'Mark Overdue',
      refundAction: 'Refund',
      viewInvoice: 'View Invoice',
      invoiceTitle: 'Official Payment Invoice',
      invoiceNumber: 'Invoice #',
      billedTo: 'Billed To',
      issuedBy: 'Issued By',
      paymentRuleNotice:
        'Recording a payment creates a Pending entry. It is not marked Paid and does not activate a subscription until confirmed by an admin or real gateway.',
      confirmPaymentTitle: 'Confirm Payment Receipt',
      confirmPaymentMsg: 'Confirming this payment adds it to confirmed revenue and activates any linked Pending Payment subscription.',
      confirmRefundTitle: 'Confirm Refund',
      confirmRefundMsg: 'Are you sure you want to mark this payment as refunded?',
    },
    users: {
      title: 'Users & Permissions',
      subtitle: 'Manage isolated agency user accounts across owners, managers, and staff.',
      inviteUser: 'Invite User',
      searchPlaceholder: 'Search by name, email, or agency...',
      colUser: 'User',
      colContact: 'Contact',
      colAgency: 'Agency',
      colRole: 'Role',
      colStatus: 'Status',
      colLastLogin: 'Last Login',
      neverLoggedIn: 'Never signed in',
      fullName: 'Full Name',
      email: 'Unique Work Email',
      phone: 'Phone Number',
      agency: 'Agency',
      role: 'Role',
      securityRuleNote: 'Every user has an isolated account scoped strictly to one agency. Passwords are never stored or exposed in plaintext.',
      userDetailsTitle: 'User Account Details',
      disableAccount: 'Disable Account',
      enableAccount: 'Enable Account',
      resendInvite: 'Resend Invitation',
      resetPassword: 'Trigger Password Reset',
      activityLog: 'Activity Log',
      confirmDisableTitle: 'Disable User Account',
      confirmDisableMsg: 'This revokes login access while preserving all user records and activity logs.',
      duplicateEmailError: 'This email address is already registered to another user.',
    },
    support: {
      title: 'Technical Support',
      subtitle: 'Track agency support requests, exchange replies, and log private internal admin notes.',
      newTicket: 'New Ticket',
      colCode: 'Ticket ID',
      colAgency: 'Agency',
      colSubject: 'Subject',
      colType: 'Category',
      colDate: 'Created',
      colPriority: 'Priority',
      colStatus: 'Status',
      ticketDetails: 'Ticket Details',
      description: 'Issue Description',
      attachments: 'Attachments',
      conversation: 'Conversation & Notes',
      publicReply: 'Reply to Agency',
      internalNote: 'Internal Note (Hidden from Agency)',
      internalNoteBadge: 'Internal Note',
      replyPlaceholder: 'Write a response visible to the agency...',
      internalPlaceholder: 'Write an internal note for IBONDA admins...',
      sendReply: 'Send Reply',
      saveInternalNote: 'Save Internal Note',
      changeStatus: 'Status',
      changePriority: 'Priority',
      selectTicketPrompt: 'Select a ticket from the table to inspect details and respond.',
    },
    notifications: {
      title: 'Notifications',
      subtitle: 'Compose, edit, and log platform announcements for real estate agencies.',
      createNotification: 'Create Notification',
      editNotification: 'Edit Notification',
      honestDeliveryNotice:
        'Integration Notice: No SMTP, Push, or WhatsApp delivery provider is connected yet. Dispatching records the notice in the local queue without claiming external delivery.',
      notifTitle: 'Title',
      notifContent: 'Message Content',
      notifType: 'Notification Type',
      recipientScope: 'Recipients',
      allAgencies: 'All Agencies',
      specificAgency: 'Specific Agency',
      scheduledDate: 'Scheduled Date',
      saveDraft: 'Save Draft',
      dispatchAction: 'Queue Dispatch',
      historyTitle: 'Notification History',
      colTitle: 'Title',
      colType: 'Type',
      colRecipients: 'Recipients',
      colDate: 'Date',
      colStatus: 'Status',
    },
    analytics: {
      title: 'Analytics & Reports',
      subtitle: 'Growth, trial conversion, churn, renewal rates, and ARPA computed dynamically from platform data.',
      range7d: 'Last 7 Days',
      range30d: 'Last 30 Days',
      range3m: 'Last 3 Months',
      range6m: 'Last 6 Months',
      range1y: 'Last Year',
      rangeCustom: 'Custom Range',
      from: 'From',
      to: 'To',
      totalAgencies: 'Total Agencies',
      newAgencies: 'New Agencies (in range)',
      activeSubs: 'Active Subscriptions',
      trialConversionRate: 'Trial Conversion Rate',
      churnRate: 'Cancellation Rate',
      renewalRate: 'Renewal Rate',
      totalRevenue: 'Total Revenue (in range)',
      arpa: 'Avg Revenue / Agency',
      chartMonthlyGrowth: 'Monthly Agency Growth',
      chartRevenueTrend: 'Revenue Trend',
      chartSubsByPlan: 'Subscriptions by Plan',
      chartTrialsVsSubs: 'Free Trials vs Paid Plans',
      chartExpiredVsRenewed: 'Expired vs Renewed',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Configure IBONDA identity, language defaults, admin security policies, and local backups.',
      tabGeneral: 'General Info',
      tabLanguage: 'Language',
      tabAccount: 'Admin Account',
      tabSecurity: 'Security & Audit',
      tabSystem: 'System & Backup',
      platformName: 'Platform Name',
      officialEmail: 'Official Email',
      officialPhone: 'Official Phone',
      platformDesc: 'Platform Description',
      defaultLanguage: 'Default Language',
      enabledLanguages: 'Enabled Languages',
      rtlTag: 'RTL',
      ltrTag: 'LTR',
      adminName: 'Admin Name',
      adminEmail: 'Admin Email',
      passwordAuthNotice: 'Password changes and server-side session revocation require connecting a real authentication backend.',
      twoFactorLabel: 'Require Two-Factor Authentication (2FA) for Admin Accounts',
      sessionTimeoutLabel: 'Session Timeout (minutes)',
      activeSessionTitle: 'Current Browser Session',
      activeSessionDesc: 'Local demo browser session. No remote session store is connected.',
      auditLogTitle: 'Administrative Audit Log',
      trialDurationLabel: 'Default Free Trial Duration (days)',
      trialWarningLabel: 'Trial Expiry Warning Window (days)',
      currencyLabel: 'Platform Currency',
      currencyNames: {
        MAD: 'Moroccan Dirham (MAD)',
        EUR: 'Euro (€)',
        USD: 'US Dollar ($)',
      },
      timezoneLabel: 'Timezone',
      alertsSection: 'Alert Preferences',
      notifyTrialExpiry: 'Alert before free trial expiry',
      notifyOverduePayment: 'Alert on overdue payments',
      backupSection: 'Data Export & Reset',
      backupHonestNote:
        'Automated cloud backups require a backend database. You can export a full JSON snapshot or reset the demo dataset below.',
      exportJsonBackup: 'Export JSON Snapshot',
      resetDemoData: 'Reset Demo Data',
      confirmResetTitle: 'Reset Demo Dataset',
      confirmResetMsg: 'All local browser changes will be cleared and replaced with the initial IBONDA demo dataset.',
    },
    toasts: {
      agencyAdded: 'Agency, manager account, and subscription created.',
      agencyUpdated: 'Agency details updated.',
      agencyStatusUpdated: 'Agency status updated.',
      agencySuspended: 'Agency suspended and subscription updated.',
      agencyActivated: 'Agency activated.',
      subCreated: 'Subscription created and linked to agency.',
      subExtended: 'Subscription extended.',
      subRenewed: 'Subscription renewed with linked payment record.',
      subPlanChanged: 'Subscription plan updated.',
      subCancelled: 'Subscription cancelled.',
      subActivated: 'Subscription activated.',
      expiryCheckDone: 'Subscription and trial expiry check completed.',
      planSaved: 'Plan saved successfully.',
      featureSaved: 'Feature saved.',
      featureDeleted: 'Feature removed from catalog.',
      paymentRecorded: 'Payment recorded as Pending for review.',
      paymentConfirmed: 'Payment confirmed and subscription updated.',
      paymentOverdue: 'Payment marked as Overdue.',
      paymentRefunded: 'Payment marked as Refunded.',
      paymentStatusUpdated: 'Payment status updated and synced.',
      userInvited: 'User added with isolated agency invitation.',
      userUpdated: 'User status updated (history preserved).',
      inviteResent: 'Invitation resend logged (requires email service).',
      passwordResetQueued: 'Password reset link logged (requires Auth backend).',
      ticketCreated: 'Support ticket created.',
      replyAdded: 'Message added to ticket thread.',
      ticketUpdated: 'Support ticket updated.',
      notifSaved: 'Notification draft saved.',
      notifQueued: 'Notification logged locally (requires delivery provider).',
      settingsSaved: 'Platform settings saved.',
      backupExported: 'JSON snapshot downloaded.',
      demoReset: 'Demo data restored to defaults.',
      csvExported: 'CSV report exported successfully.',
      brandingSaved: 'Agency branding saved and isolated to this agency.',
      brandingReset: 'Agency branding reset to platform defaults.',
    },
  },
};
