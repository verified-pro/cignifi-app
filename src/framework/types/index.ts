// User and Authentication Types
export interface LocationState {
  referralCode?: string;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  status: 'active' | 'pending' | 'rejected';
}

// Product Types
export type ProductTier = 'member_only' | 'member_family' | 'member_extended';

export interface Product {
  id: string;
  tier: ProductTier;
  name: string;
  description: string;
  basePrice: number;
  coverage: {
    primary: string[];
    dependents?: number;
  };
  riders?: Rider[];
}

export interface Rider {
  id: string;
  name: string;
  description: string;
  type: 'legacy' | 'grief_support' | 'flexible_payout' | 'wellness';
  price: number;
  features: string[];
}

// Policy Types
export interface Policy {
  id: string;
  userId: string;
  productId: string;
  riderIds: string[];
  premiumAmount: number;
  status: 'active' | 'pending_underwriting' | 'declined' | 'cancelled';
  coverStartDate: string;
  waitingPeriodWaived: boolean;
  waitingPeriodEndDate?: string;
  lastPaymentDate?: string;
  nextPaymentDate: string;
  policyDocument?: string;
  beneficiaries: Beneficiary[];
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  percentage: number;
}

// Dependent Types
export interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  idNumber?: string;
}

// Referral & Commission Types
export interface ReferralRecord {
  id: string;
  agentId: string;
  userId: string;
  status: 'pending' | 'active' | 'paid';
  baseCommission: number;
  bonusCommission?: number;
  totalCommission: number;
  createdAt: string;
  paidAt?: string;
}

export interface CommissionPayout {
  id: string;
  agentId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
  bankAccount?: {
    accountNumber: string;
    bankCode: string;
    accountHolder: string;
  };
}

// KYC/Onboarding Types
export interface KYCData {
  step: number;
  phone: string;
  idNumber?: string;
  idData?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    idNumber?: string;
    idType?: string;
  };
  biometricVerified: boolean;
  documentUrl?: string;
}

export interface UnderwritingResponse {
  status: 'approved' | 'pending' | 'declined';
  message: string;
  policyId?: string;
  reasonForDecline?: string;
  nextSteps?: string;
}

// Agent Portal Types
export interface AgentStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  lastPayoutDate?: string;
}

export interface AgentDashboard {
  agent: User;
  stats: AgentStats;
  referrals: ReferralRecord[];
  payouts: CommissionPayout[];
  leaderboardPosition?: number;
}

// Payment Types
export interface PaymentSetup {
  bankAccount: string;
  bankCode: string;
  accountHolder: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'debit_order' | 'credit_card' | 'mobile_wallet';
  details: PaymentSetup | Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
}

// Claims Types
export interface Claim {
  id: string;
  policyId: string;
  status: 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected';
  beneficiary: string;
  claimAmount?: number;
  claimDate: string;
  submittedDocuments: string[];
  statusHistory: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
