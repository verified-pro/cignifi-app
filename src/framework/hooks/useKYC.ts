import { useContext } from 'react';
import type { KYCContextType } from '../context/KYCContext';
import { KYCContext } from '../context/KYCContext';

export const useKYC = (): KYCContextType => {
  const context = useContext(KYCContext);
  if (!context) {
    throw new Error('useKYC must be used within KYCProvider');
  }
  return context;
};
