import type { ApiResponse, KYCData } from '../types';

// Mock OCR response interface
interface OCRResult {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idNumber: string;
  idType: 'national_id' | 'passport';
}

// Mock ID verification response
interface IDVerificationResult {
  verified: boolean;
  matchScore: number;
  data?: OCRResult;
}

class KYCService {
  private apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  /**
   * Step 1: Verify phone number and send OTP
   */
  async verifyPhoneNumber(phone: string): Promise<ApiResponse<{ otpSent: boolean }>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/verify-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) throw new Error('Failed to send OTP');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Phone verification failed',
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(phone: string, otp: string): Promise<ApiResponse<{ verified: boolean; token?: string }>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      if (!response.ok) throw new Error('Invalid OTP');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OTP verification failed',
      };
    }
  }

  /**
   * Step 2: Process ID document via OCR
   * In production, this would use a real OCR provider
   */
  async processIDDocument(
    imageData: string,
    idType: 'national_id' | 'passport'
  ): Promise<ApiResponse<OCRResult>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/process-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          idType,
        }),
      });

      if (!response.ok) throw new Error('Failed to process ID');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'ID processing failed',
      };
    }
  }

  /**
   * Step 3: Verify ID authenticity against Home Affairs
   */
  async verifyIDWithAuthority(idNumber: string): Promise<ApiResponse<IDVerificationResult>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/verify-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber }),
      });

      if (!response.ok) throw new Error('Failed to verify ID');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'ID verification failed',
      };
    }
  }

  /**
   * Step 4: Biometric verification (facial recognition)
   */
  async verifyBiometric(imageData: string, idImage: string): Promise<ApiResponse<{ verified: boolean; score: number }>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/verify-biometric`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieImage: imageData,
          idImage,
        }),
      });

      if (!response.ok) throw new Error('Biometric verification failed');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Biometric verification failed',
      };
    }
  }

  /**
   * Pre-populate user data from credit bureau or mobile providers
   */
  async prePopulateData(phone: string): Promise<ApiResponse<Partial<KYCData>>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/prepopulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) throw new Error('Failed to pre-populate data');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Pre-population failed',
      };
    }
  }

  /**
   * Save KYC data to backend
   */
  async saveKYCData(kycData: KYCData): Promise<ApiResponse<{ kycId: string }>> {
    try {
      const response = await fetch(`${this.apiBase}/kyc/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kycData),
      });

      if (!response.ok) throw new Error('Failed to save KYC data');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save KYC data',
      };
    }
  }

  /**
   * Validate KYC step completion
   */
  validateStep(step: number, kycData: KYCData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (step) {
      case 1: // Phone verification
        if (!kycData.phone || kycData.phone.length < 10) {
          errors.push('Valid phone number required');
        }
        break;

      case 2: // ID capture
        if (!kycData.idNumber) {
          errors.push('ID number required');
        }
        if (!kycData.idData) {
          errors.push('ID document not processed');
        }
        break;

      case 3: // Biometric
        if (!kycData.biometricVerified) {
          errors.push('Biometric verification required');
        }
        break;

      case 4: // Personal details
        if (!kycData.idData?.firstName || !kycData.idData?.lastName) {
          errors.push('Personal details incomplete');
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }
}

export const kycService = new KYCService();
export default new KYCService();
