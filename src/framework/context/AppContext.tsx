import React, { createContext, useReducer, useCallback } from 'react';
import type { AppContextState, AppContextActions } from './appContextTypes';
import type { SignupData, LoginData, PaymentSetup, OnboardingStep, ApplicationStep } from './appContextTypes';
import type { User, Policy } from '../types';
import authService from '../services/authService';
import productService from '../services/productService';
import policyService from '../services/policyService';

/**
 * Initial state for the application
 */
const initialState: AppContextState = {
  currentStep: 'welcome',
  previousStep: null,
  auth: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  onboarding: {
    step: 'phone_verification',
    phone: '',
    otp: '',
    otpSent: false,
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    loading: false,
    error: null,
  },
  productSelection: {
    selectedProductId: null,
    selectedRiderIds: [],
    dependents: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  underwriting: {
    policyId: null,
    answers: {},
    status: null,
    message: null,
    loading: false,
    error: null,
  },
  payment: {
    bankAccount: '',
    bankCode: '',
    accountHolder: '',
    verificationStatus: null,
    loading: false,
    error: null,
  },
  policies: [],
  activePolicyId: null,
};

/**
 * Action types
 */
type AppAction =
  | { type: 'SET_STEP'; payload: ApplicationStep }
  | { type: 'GO_BACK' }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }
  | { type: 'SET_AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SET_AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_ONBOARDING_STEP'; payload: OnboardingStep }
  | { type: 'UPDATE_ONBOARDING'; payload: Partial<AppContextState['onboarding']> }
  | { type: 'SELECT_PRODUCT'; payload: string }
  | { type: 'TOGGLE_RIDER'; payload: string }
  | { type: 'ADD_DEPENDENT'; payload: any }
  | { type: 'REMOVE_DEPENDENT'; payload: number }
  | { type: 'SET_PRODUCT_PRICE'; payload: number }
  | { type: 'UPDATE_UNDERWRITING_ANSWERS'; payload: Record<string, unknown> }
  | { type: 'SET_UNDERWRITING_SUCCESS'; payload: { status: string; message: string; policyId: string } }
  | { type: 'UPDATE_PAYMENT'; payload: Partial<AppContextState['payment']> }
  | { type: 'SET_POLICIES'; payload: Policy[] }
  | { type: 'SET_ACTIVE_POLICY'; payload: string };

/**
 * Reducer function for app state
 */
function appReducer(state: AppContextState, action: AppAction): AppContextState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        previousStep: state.currentStep,
        currentStep: action.payload,
      };

    case 'GO_BACK':
      return {
        ...state,
        currentStep: state.previousStep || state.currentStep,
      };

    case 'SET_AUTH_LOADING':
      return {
        ...state,
        auth: { ...state.auth, loading: action.payload },
      };

    case 'SET_AUTH_SUCCESS':
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          loading: false,
          error: null,
        },
      };

    case 'SET_AUTH_ERROR':
      return {
        ...state,
        auth: { ...state.auth, loading: false, error: action.payload },
      };

    case 'LOGOUT':
      return {
        ...state,
        auth: { ...initialState.auth, isAuthenticated: false },
        currentStep: 'welcome',
      };

    case 'SET_ONBOARDING_STEP':
      return {
        ...state,
        onboarding: { ...state.onboarding, step: action.payload },
      };

    case 'UPDATE_ONBOARDING':
      return {
        ...state,
        onboarding: { ...state.onboarding, ...action.payload },
      };

    case 'SELECT_PRODUCT':
      return {
        ...state,
        productSelection: { ...state.productSelection, selectedProductId: action.payload },
      };

    case 'TOGGLE_RIDER':
      return {
        ...state,
        productSelection: {
          ...state.productSelection,
          selectedRiderIds: state.productSelection.selectedRiderIds.includes(action.payload)
            ? state.productSelection.selectedRiderIds.filter((id) => id !== action.payload)
            : [...state.productSelection.selectedRiderIds, action.payload],
        },
      };

    case 'ADD_DEPENDENT':
      return {
        ...state,
        productSelection: {
          ...state.productSelection,
          dependents: [...state.productSelection.dependents, action.payload],
        },
      };

    case 'REMOVE_DEPENDENT':
      return {
        ...state,
        productSelection: {
          ...state.productSelection,
          dependents: state.productSelection.dependents.filter((_, i) => i !== action.payload),
        },
      };

    case 'SET_PRODUCT_PRICE':
      return {
        ...state,
        productSelection: { ...state.productSelection, totalPrice: action.payload },
      };

    case 'UPDATE_UNDERWRITING_ANSWERS':
      return {
        ...state,
        underwriting: { ...state.underwriting, answers: action.payload },
      };

    case 'SET_UNDERWRITING_SUCCESS':
      return {
        ...state,
        underwriting: {
          ...state.underwriting,
          status: action.payload.status as any,
          message: action.payload.message,
          policyId: action.payload.policyId,
          loading: false,
        },
      };

    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payment: { ...state.payment, ...action.payload },
      };

    case 'SET_POLICIES':
      return {
        ...state,
        policies: action.payload,
      };

    case 'SET_ACTIVE_POLICY':
      return {
        ...state,
        activePolicyId: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Create the app context
 */
export const AppContext = createContext<(AppContextState & AppContextActions) | null>(null);

/**
 * App context provider component
 */
export interface AppContextProviderProps {
  children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Navigation actions
  const setStep = useCallback((step: ApplicationStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  // Auth actions
  const signup = useCallback(async (data: SignupData) => {
    dispatch({ type: 'SET_AUTH_LOADING', payload: true });
    try {
      const response = await authService.signup(data);
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'SET_AUTH_SUCCESS', payload: { user, token } });
        dispatch({ type: 'SET_STEP', payload: 'products' });
      } else {
        dispatch({ type: 'SET_AUTH_ERROR', payload: response.error || 'Signup failed' });
      }
    } catch (error) {
      dispatch({
        type: 'SET_AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, []);

  const login = useCallback(async (data: LoginData) => {
    dispatch({ type: 'SET_AUTH_LOADING', payload: true });
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'SET_AUTH_SUCCESS', payload: { user, token } });
        dispatch({ type: 'SET_STEP', payload: 'dashboard' });
      } else {
        dispatch({ type: 'SET_AUTH_ERROR', payload: response.error || 'Login failed' });
      }
    } catch (error) {
      dispatch({
        type: 'SET_AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const verifyOTP = useCallback(async (phone: string, otp: string) => {
    dispatch({ type: 'UPDATE_ONBOARDING', payload: { loading: true } });
    try {
      const response = await authService.verifyOTP({ phone, otp });
      if (response.success) {
        dispatch({
          type: 'UPDATE_ONBOARDING',
          payload: { loading: false, otpSent: false, otp: '' },
        });
        dispatch({ type: 'SET_ONBOARDING_STEP', payload: 'personal_info' });
      } else {
        dispatch({
          type: 'UPDATE_ONBOARDING',
          payload: { loading: false, error: response.error || 'OTP verification failed' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_ONBOARDING',
        payload: {
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        },
      });
    }
  }, []);

  const requestOTP = useCallback(async (phone: string) => {
    dispatch({ type: 'UPDATE_ONBOARDING', payload: { loading: true } });
    try {
      const response = await authService.requestOTP(phone);
      if (response.success) {
        dispatch({
          type: 'UPDATE_ONBOARDING',
          payload: { loading: false, otpSent: true, phone },
        });
      } else {
        dispatch({
          type: 'UPDATE_ONBOARDING',
          payload: { loading: false, error: response.error || 'Failed to send OTP' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_ONBOARDING',
        payload: {
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        },
      });
    }
  }, []);

  // Onboarding actions
  const setOnboardingStep = useCallback((step: OnboardingStep) => {
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: step });
  }, []);

  const updateOnboarding = useCallback((data: Partial<AppContextState['onboarding']>) => {
    dispatch({ type: 'UPDATE_ONBOARDING', payload: data });
  }, []);

  const validateReferralCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const response = await authService.validateReferralCode(code);
      return response.success && response.data?.valid ? true : false;
    } catch {
      return false;
    }
  }, []);

  // Product selection actions
  const selectProduct = useCallback((productId: string) => {
    dispatch({ type: 'SELECT_PRODUCT', payload: productId });
  }, []);

  const toggleRider = useCallback((riderId: string) => {
    dispatch({ type: 'TOGGLE_RIDER', payload: riderId });
  }, []);

  const addDependent = useCallback(
    (dependent: { name: string; relationship: string; dateOfBirth: string }) => {
      dispatch({ type: 'ADD_DEPENDENT', payload: dependent });
    },
    []
  );

  const removeDependent = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_DEPENDENT', payload: index });
  }, []);

  const calculatePrice = useCallback(async () => {
    if (!state.productSelection.selectedProductId) return;

    dispatch({
      type: 'UPDATE_ONBOARDING',
      payload: { loading: true },
    });

    try {
      const response = await productService.calculatePrice({
        productId: state.productSelection.selectedProductId,
        riderIds: state.productSelection.selectedRiderIds,
        dependents: state.productSelection.dependents.length,
      });

      if (response.success && response.data) {
        dispatch({ type: 'SET_PRODUCT_PRICE', payload: response.data.totalPrice });
        dispatch({
          type: 'UPDATE_ONBOARDING',
          payload: { loading: false },
        });
      } else {
        dispatch({
          type: 'UPDATE_ONBOARDING',
          payload: { loading: false, error: response.error || 'Price calculation failed' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_ONBOARDING',
        payload: {
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        },
      });
    }
  }, [state.productSelection.selectedProductId, state.productSelection.selectedRiderIds, state.productSelection.dependents.length]);

  // Underwriting actions
  const updateUnderwritingAnswers = useCallback((answers: Record<string, unknown>) => {
    dispatch({ type: 'UPDATE_UNDERWRITING_ANSWERS', payload: answers });
  }, []);

  const submitUnderwriting = useCallback(async () => {
    dispatch({
      type: 'UPDATE_ONBOARDING',
      payload: { loading: true },
    });

    try {
      // TODO: Call underwriting API
      dispatch({
        type: 'SET_UNDERWRITING_SUCCESS',
        payload: {
          status: 'approved',
          message: 'You have been approved instantly!',
          policyId: 'policy-' + Date.now(),
        },
      });
      dispatch({ type: 'SET_STEP', payload: 'payment' });
    } catch (error) {
      dispatch({
        type: 'UPDATE_ONBOARDING',
        payload: {
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        },
      });
    }
  }, []);

  // Payment actions
  const setupPayment = useCallback(async (data: PaymentSetup) => {
    dispatch({
      type: 'UPDATE_PAYMENT',
      payload: { loading: true },
    });

    try {
      // TODO: Call payment setup API
      dispatch({
        type: 'UPDATE_PAYMENT',
        payload: {
          ...data,
          verificationStatus: 'verified',
          loading: false,
        },
      });
      dispatch({ type: 'SET_STEP', payload: 'dashboard' });
    } catch (error) {
      dispatch({
        type: 'UPDATE_PAYMENT',
        payload: {
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        },
      });
    }
  }, []);

  // Policy actions
  const fetchPolicies = useCallback(async () => {
    try {
      const response = await policyService.getPolicies();
      if (response.success && response.data) {
        dispatch({ type: 'SET_POLICIES', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error);
    }
  }, []);

  const setActivePolicy = useCallback((policyId: string) => {
    dispatch({ type: 'SET_ACTIVE_POLICY', payload: policyId });
  }, []);

  const value: AppContextState & AppContextActions = {
    ...state,
    setStep,
    goBack,
    signup,
    login,
    logout,
    verifyOTP,
    requestOTP,
    setOnboardingStep,
    updateOnboarding,
    validateReferralCode,
    selectProduct,
    toggleRider,
    addDependent,
    removeDependent,
    calculatePrice,
    updateUnderwritingAnswers,
    submitUnderwriting,
    setupPayment,
    fetchPolicies,
    setActivePolicy,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
