import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextState, AppContextActions } from '../context/appContextTypes';

/**
 * Custom hook to use the App context
 * Provides access to app state and actions
 */
export function useApp(): AppContextState & AppContextActions {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within AppContextProvider');
  }

  return context;
}

/**
 * Hook to access only auth state and actions
 */
export function useAuth() {
  const { auth, signup, login, logout, verifyOTP, requestOTP } = useApp();

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    signup,
    login,
    logout,
    verifyOTP,
    requestOTP,
  };
}

/**
 * Hook to access only onboarding state and actions
 */
export function useOnboarding() {
  const {
    onboarding,
    setOnboardingStep,
    updateOnboarding,
    validateReferralCode,
    requestOTP,
    verifyOTP,
  } = useApp();

  return {
    ...onboarding,
    setOnboardingStep,
    updateOnboarding,
    validateReferralCode,
    requestOTP,
    verifyOTP,
  };
}

/**
 * Hook to access only product selection state and actions
 */
export function useProductSelection() {
  const {
    productSelection,
    selectProduct,
    toggleRider,
    addDependent,
    removeDependent,
    calculatePrice,
  } = useApp();

  return {
    ...productSelection,
    selectProduct,
    toggleRider,
    addDependent,
    removeDependent,
    calculatePrice,
  };
}

/**
 * Hook to access only underwriting state and actions
 */
export function useUnderwriting() {
  const { underwriting, updateUnderwritingAnswers, submitUnderwriting } = useApp();

  return {
    ...underwriting,
    updateUnderwritingAnswers,
    submitUnderwriting,
  };
}

/**
 * Hook to access only payment state and actions
 */
export function usePayment() {
  const { payment, setupPayment } = useApp();

  return {
    ...payment,
    setupPayment,
  };
}

/**
 * Hook to access only navigation
 */
export function useNavigation() {
  const { currentStep, previousStep, setStep, goBack } = useApp();

  return {
    currentStep,
    previousStep,
    setStep,
    goBack,
  };
}

/**
 * Hook to access policies
 */
export function usePolicies() {
  const { policies, activePolicyId, fetchPolicies, setActivePolicy } = useApp();

  return {
    policies,
    activePolicyId,
    activePolicy: policies.find((p) => p.id === activePolicyId),
    fetchPolicies,
    setActivePolicy,
  };
}
