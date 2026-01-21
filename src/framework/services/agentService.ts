import type { ReferralRecord, CommissionPayout, AgentDashboard, ApiResponse } from '../types';
import type { IAgentService } from './interfaces/IAgentService';
import type { IHttpClient } from './interfaces/IHttpClient';
import apiClient from './apiClient';

/**
 * AgentService - Agent service implementation (Single Responsibility Principle)
 * Only handles agent portal and commission operations
 * Depends on IHttpClient abstraction (Dependency Inversion Principle)
 */
class AgentService implements IAgentService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get agent dashboard
   */
  async getAgentDashboard(): Promise<ApiResponse<AgentDashboard>> {
    return this.httpClient.get('/agent/dashboard');
  }

  /**
   * Get agent's referrals
   */
  async getReferrals(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ referrals: ReferralRecord[]; total: number }>> {
    return this.httpClient.get(`/agent/referrals?page=${page}&limit=${limit}`);
  }

  /**
   * Get specific referral
   */
  async getReferralById(referralId: string): Promise<ApiResponse<ReferralRecord>> {
    return this.httpClient.get(`/agent/referrals/${referralId}`);
  }

  /**
   * Get payout history
   */
  async getPayoutHistory(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ payouts: CommissionPayout[]; total: number }>> {
    return this.httpClient.get(`/agent/payouts?page=${page}&limit=${limit}`);
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(
    limit = 50
  ): Promise<ApiResponse<Array<{ rank: number; agentId: string; agentName: string; totalEarnings: number; referrals: number }>>> {
    return this.httpClient.get(`/agent/leaderboard?limit=${limit}`);
  }

  /**
   * Get marketing materials
   */
  async getMarketingMaterials(): Promise<ApiResponse<{
    images: Array<{ id: string; url: string; title: string }>;
    videos: Array<{ id: string; url: string; title: string }>;
  }>> {
    return this.httpClient.get('/agent/marketing-materials');
  }

  /**
   * Get my referral code
   */
  async getMyReferralCode(): Promise<ApiResponse<{ code: string; link: string }>> {
    return this.httpClient.get('/agent/referral-code');
  }

  /**
   * Generate new referral code
   */
  async generateNewReferralCode(): Promise<ApiResponse<{ code: string; link: string }>> {
    return this.httpClient.post('/agent/referral-code/regenerate', {});
  }

  /**
   * Setup payout bank details
   */
  async setupPayout(data: {
    bankAccount: string;
    bankCode: string;
    accountHolder: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return this.httpClient.post('/agent/payout-setup', data);
  }

  /**
   * Request payout
   */
  async requestPayout(amount: number): Promise<ApiResponse<{ payoutId: string; status: string }>> {
    return this.httpClient.post('/agent/request-payout', { amount });
  }
}

// Export singleton instance
export default new AgentService(apiClient);
