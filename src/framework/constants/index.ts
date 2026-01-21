export const PRODUCT_TIERS = {
  MEMBER_ONLY: 'member_only',
  MEMBER_FAMILY: 'member_family',
  MEMBER_EXTENDED: 'member_extended',
} as const;

export const RIDER_TYPES = {
  DIGITAL_LEGACY: 'legacy',
  GRIEF_SUPPORT: 'grief_support',
  FLEXIBLE_PAYOUT: 'flexible_payout',
  WELLNESS: 'wellness',
} as const;

export const POLICY_STATUS = {
  ACTIVE: 'active',
  PENDING_UNDERWRITING: 'pending_underwriting',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
} as const;

export const REFERRAL_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  PAID: 'paid',
} as const;

export const COMMISSION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const CLAIM_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
    REQUEST_OTP: '/auth/request-otp',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    GET: (id: string) => `/products/${id}`,
    BY_TIER: (tier: string) => `/products?tier=${tier}`,
    CALCULATE_PRICE: '/products/calculate-price',
  },
  RIDERS: {
    LIST: '/riders',
    GET: (id: string) => `/riders/${id}`,
  },
  POLICIES: {
    CREATE: '/policies',
    LIST: '/policies',
    GET: (id: string) => `/policies/${id}`,
    UNDERWRITE: (id: string) => `/policies/${id}/underwrite`,
    CANCEL: (id: string) => `/policies/${id}/cancel`,
    DOCUMENT: (id: string) => `/policies/${id}/document`,
    BENEFICIARIES: {
      ADD: (policyId: string) => `/policies/${policyId}/beneficiaries`,
      UPDATE: (policyId: string, benId: string) => `/policies/${policyId}/beneficiaries/${benId}`,
      REMOVE: (policyId: string, benId: string) => `/policies/${policyId}/beneficiaries/${benId}`,
    },
  },
  REFERRALS: {
    VALIDATE: (code: string) => `/referrals/validate/${code}`,
  },
  AGENT: {
    DASHBOARD: '/agent/dashboard',
    REFERRALS: (page?: number, limit?: number) => `/agent/referrals?page=${page || 1}&limit=${limit || 20}`,
    REFERRAL: (id: string) => `/agent/referrals/${id}`,
    PAYOUTS: (page?: number, limit?: number) => `/agent/payouts?page=${page || 1}&limit=${limit || 20}`,
    LEADERBOARD: (limit?: number) => `/agent/leaderboard?limit=${limit || 50}`,
    REFERRAL_CODE: '/agent/referral-code',
    REFERRAL_CODE_REGENERATE: '/agent/referral-code/regenerate',
    MARKETING_MATERIALS: '/agent/marketing-materials',
    PAYOUT_SETUP: '/agent/payout-setup',
    REQUEST_PAYOUT: '/agent/request-payout',
  },
  CLAIMS: {
    CREATE: '/claims',
    LIST: '/claims',
    GET: (id: string) => `/claims/${id}`,
    SUBMIT_DOCUMENTS: (id: string) => `/claims/${id}/documents`,
    STATUS: (id: string) => `/claims/${id}/status`,
    CANCEL: (id: string) => `/claims/${id}/cancel`,
  },
} as const;

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  POLICY_NOT_FOUND: 'POLICY_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_REQUEST: 'INVALID_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export const MESSAGES = {
  SUCCESS: {
    SIGNUP_COMPLETE: 'Account created successfully!',
    POLICY_CREATED: 'Policy created successfully!',
    PAYMENT_SETUP: 'Payment setup completed successfully!',
    CLAIM_SUBMITTED: 'Claim submitted successfully!',
  },
  ERROR: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_INPUT: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
  },
  WAITING_PERIOD: {
    STANDARD: 'Standard waiting period: 3-6 months',
    WAIVED: 'Waiting period waived!',
  },
} as const;

export const COMMISSION_RATES = {
  BASE_RATE: 0.05, // 5% base commission
  BONUS_RATE: 0.02, // 2% bonus for waived waiting period
} as const;

export const PAYOUT_SCHEDULE = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
} as const;

export const BANK_CODES = {
  ABSA: 'ABSA',
  FNB: 'FNBAZAJJ',
  NEDBANK: 'NEDSZAJJ',
  STANDARD: 'SBZAZAJJ',
  CAPITEC: 'CAPITEC',
} as const;
