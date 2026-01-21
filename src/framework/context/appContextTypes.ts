/**
 * Application Flow Types
 * Defines the data structures for managing app state and user journey
 */

import type { User, Policy } from '../types';

export type OnboardingStep = 'phone_verification' | 'personal_info' | 'kyc_verification' | 'complete';
export type ApplicationStep = 'welcome' | 'onboarding' | 'products' | 'underwriting' | 'payment' | 'dashboard';

/**
 * Onboarding state during user registration
 */
export interface OnboardingState {
  step: OnboardingStep;
  phone: string;
  otp: string;
  otpSent: boolean;
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  referralCode?: string;
  loading: boolean;
  error: string | null;
}

/**
 * Product selection state
 */
export interface ProductSelectionState {
  selectedProductId: string | null;
  selectedRiderIds: string[];
  dependents: Array<{
    name: string;
    relationship: string;
    dateOfBirth: string;
  }>;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

/**
 * Underwriting state
 */
export interface UnderwritingState {
  policyId: string | null;
  answers: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | null;
  message: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Payment state
 */
export interface PaymentState {
  bankAccount: string;
  bankCode: string;
  accountHolder: string;
  verificationStatus: 'pending' | 'verified' | 'failed' | null;
  loading: boolean;
  error: string | null;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Application context state
 */
export interface AppContextState {
  // Navigation
  currentStep: ApplicationStep;
  previousStep: ApplicationStep | null;
  
  // Auth
  auth: AuthState;
  
  // Onboarding
  onboarding: OnboardingState;
  
  // Product Selection
  productSelection: ProductSelectionState;
  
  // Underwriting
  underwriting: UnderwritingState;
  
  // Payment
  payment: PaymentState;
  
  // User's policies
  policies: Policy[];
  activePolicyId: string | null;
}

/**
 * App context actions
 */
export interface AppContextActions {
  // Navigation
  setStep: (step: ApplicationStep) => void;
  goBack: () => void;
  
  // Auth
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  requestOTP: (phone: string) => Promise<void>;
  
  // Onboarding
  setOnboardingStep: (step: OnboardingStep) => void;
  updateOnboarding: (data: Partial<OnboardingState>) => void;
  validateReferralCode: (code: string) => Promise<boolean>;
  
  // Product Selection
  selectProduct: (productId: string) => void;
  toggleRider: (riderId: string) => void;
  addDependent: (dependent: { name: string; relationship: string; dateOfBirth: string }) => void;
  removeDependent: (index: number) => void;
  calculatePrice: () => Promise<void>;
  
  // Underwriting
  submitUnderwriting: () => Promise<void>;
  updateUnderwritingAnswers: (answers: Record<string, unknown>) => void;
  
  // Payment
  setupPayment: (data: PaymentSetup) => Promise<void>;
  
  // Policies
  fetchPolicies: () => Promise<void>;
  setActivePolicy: (policyId: string) => void;
}

// Helper types for actions
export interface SignupData {
  phone: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  password: string;
  referralCode?: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface PaymentSetup {
  bankAccount: string;
  bankCode: string;
  accountHolder: string;
}
