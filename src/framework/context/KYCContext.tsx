import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { KYCData } from '../types';

export interface KYCContextType {
  kycData: KYCData;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  updateKYCData: (data: Partial<KYCData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetKYC: () => void;
}

const initialKYCData: KYCData = {
  step: 1,
  phone: '',
  idNumber: '',
  biometricVerified: false,
};

export const KYCContext = createContext<KYCContextType | undefined>(undefined);

interface KYCProviderProps {
  children: ReactNode;
}

export const KYCProvider = ({ children }: KYCProviderProps) => {
  const [kycData, setKYCData] = useState<KYCData>(initialKYCData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateKYCData = useCallback((data: Partial<KYCData>) => {
    setKYCData(prev => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => (prev < 4 ? prev + 1 : prev));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
  }, []);

  const setStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  const resetKYC = useCallback(() => {
    setKYCData(initialKYCData);
    setCurrentStep(1);
    setError(null);
  }, []);

  const value: KYCContextType = {
    kycData,
    currentStep,
    isLoading,
    error,
    updateKYCData,
    nextStep,
    previousStep,
    setStep,
    setError,
    setLoading: setIsLoading,
    resetKYC,
  };

  return <KYCContext.Provider value={value}>{children}</KYCContext.Provider>;
};
