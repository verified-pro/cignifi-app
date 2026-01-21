import type { ApiResponse, ReferralRecord, CommissionPayout, AgentDashboard } from '../../types';

/**
 * IAgentService - Agent service interface (Interface Segregation Principle)
 * Specific contract for agent portal operations only
 */
export interface IAgentService {
  /**
   * Get agent dashboard
   */
  getAgentDashboard(): Promise<ApiResponse<AgentDashboard>>;

  /**
   * Get agent's referrals
   */
  getReferrals(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{ referrals: ReferralRecord[]; total: number }>>;

  /**
   * Get specific referral
   */
  getReferralById(referralId: string): Promise<ApiResponse<ReferralRecord>>;

  /**
   * Get payout history
   */
  getPayoutHistory(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{ payouts: CommissionPayout[]; total: number }>>;

  /**
   * Get leaderboard
   */
  getLeaderboard(
    limit?: number
  ): Promise<ApiResponse<Array<{ rank: number; agentId: string; agentName: string; totalEarnings: number; referrals: number }>>>;

  /**
   * Get marketing materials
   */
  getMarketingMaterials(): Promise<ApiResponse<{
    images: Array<{ id: string; url: string; title: string }>;
    videos: Array<{ id: string; url: string; title: string }>;
  }>>;

  /**
   * Get my referral code
   */
  getMyReferralCode(): Promise<ApiResponse<{ code: string; link: string }>>;

  /**
   * Generate new referral code
   */
  generateNewReferralCode(): Promise<ApiResponse<{ code: string; link: string }>>;

  /**
   * Setup payout bank details
   */
  setupPayout(data: {
    bankAccount: string;
    bankCode: string;
    accountHolder: string;
  }): Promise<ApiResponse<{ success: boolean }>>;

  /**
   * Request payout
   */
  requestPayout(amount: number): Promise<ApiResponse<{ payoutId: string; status: string }>>;
}
