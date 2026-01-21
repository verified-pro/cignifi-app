import type { User, ApiResponse } from '../types';
import type { IAuthService } from './interfaces/IAuthService';
import type { IHttpClient } from './interfaces/IHttpClient';
import apiClient from './apiClient';

/**
 * AuthService - Authentication service implementation (Single Responsibility Principle)
 * Only handles authentication-related operations
 * Depends on IHttpClient abstraction (Dependency Inversion Principle)
 */
class AuthService implements IAuthService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Sign up a new user
   */
  async signup(data: {
    phone: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string;
    password: string;
    referralCode?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.httpClient.post('/auth/signup', data);
  }

  /**
   * Login user
   */
  async login(data: {
    phone: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.httpClient.post('/auth/login', data);
  }

  /**
   * Verify OTP
   */
  async verifyOTP(data: {
    phone: string;
    otp: string;
  }): Promise<ApiResponse<{ verified: boolean }>> {
    return this.httpClient.post('/auth/verify-otp', data);
  }

  /**
   * Request OTP
   */
  async requestOTP(phone: string): Promise<ApiResponse<{ messageSent: boolean }>> {
    return this.httpClient.post('/auth/request-otp', { phone });
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    return this.httpClient.post('/auth/logout', {});
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.httpClient.get('/auth/me');
  }

  /**
   * Validate referral code
   */
  async validateReferralCode(code: string): Promise<ApiResponse<{ valid: boolean; agentName?: string }>> {
    return this.httpClient.get(`/referrals/validate/${code}`);
  }
}

// Export singleton instance
export default new AuthService(apiClient);
