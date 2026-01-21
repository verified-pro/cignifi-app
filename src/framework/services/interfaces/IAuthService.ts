import type { ApiResponse, User } from '../../types';

/**
 * IAuthService - Authentication service interface (Interface Segregation Principle)
 * Specific contract for auth-related operations only
 */
export interface IAuthService {
  /**
   * Sign up a new user
   */
  signup(data: {
    phone: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string;
    password: string;
    referralCode?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>>;

  /**
   * Login user
   */
  login(data: {
    phone: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>>;

  /**
   * Verify OTP
   */
  verifyOTP(data: {
    phone: string;
    otp: string;
  }): Promise<ApiResponse<{ verified: boolean }>>;

  /**
   * Request OTP
   */
  requestOTP(phone: string): Promise<ApiResponse<{ messageSent: boolean }>>;

  /**
   * Logout user
   */
  logout(): Promise<ApiResponse<{ success: boolean }>>;

  /**
   * Get current user
   */
  getCurrentUser(): Promise<ApiResponse<User>>;

  /**
   * Validate referral code
   */
  validateReferralCode(code: string): Promise<ApiResponse<{ valid: boolean; agentName?: string }>>;
}
