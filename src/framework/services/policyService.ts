import type { Policy, Beneficiary, ApiResponse } from '../types';
import type { IPolicyService } from './interfaces/IPolicyService';
import type { IHttpClient } from './interfaces/IHttpClient';
import apiClient from './apiClient';

/**
 * PolicyService - Policy service implementation (Single Responsibility Principle)
 * Only handles policy-related operations
 * Depends on IHttpClient abstraction (Dependency Inversion Principle)
 */
class PolicyService implements IPolicyService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create new policy
   */
  async createPolicy(data: {
    productId: string;
    riderIds: string[];
    dependents?: Array<{ name: string; relationship: string; dateOfBirth: string }>;
    referralCode?: string;
  }): Promise<ApiResponse<Policy>> {
    return this.httpClient.post('/policies', data);
  }

  /**
   * Get user's policies
   */
  async getPolicies(): Promise<ApiResponse<Policy[]>> {
    return this.httpClient.get('/policies');
  }

  /**
   * Get specific policy
   */
  async getPolicyById(policyId: string): Promise<ApiResponse<Policy>> {
    return this.httpClient.get(`/policies/${policyId}`);
  }

  /**
   * Submit policy to underwriting
   */
  async submitToUnderwriting(policyId: string, kycData: unknown): Promise<ApiResponse<{
    status: 'approved' | 'pending' | 'declined';
    message: string;
  }>> {
    return this.httpClient.post(`/policies/${policyId}/underwrite`, { kycData });
  }

  /**
   * Add beneficiary to policy
   */
  async addBeneficiary(
    policyId: string,
    beneficiary: Beneficiary
  ): Promise<ApiResponse<Policy>> {
    return this.httpClient.post(`/policies/${policyId}/beneficiaries`, beneficiary);
  }

  /**
   * Update beneficiary
   */
  async updateBeneficiary(
    policyId: string,
    beneficiaryId: string,
    beneficiary: Partial<Beneficiary>
  ): Promise<ApiResponse<Policy>> {
    return this.httpClient.put(
      `/policies/${policyId}/beneficiaries/${beneficiaryId}`,
      beneficiary
    );
  }

  /**
   * Remove beneficiary
   */
  async removeBeneficiary(policyId: string, beneficiaryId: string): Promise<ApiResponse<Policy>> {
    return this.httpClient.delete(`/policies/${policyId}/beneficiaries/${beneficiaryId}`);
  }

  /**
   * Cancel policy
   */
  async cancelPolicy(policyId: string, reason: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.httpClient.post(`/policies/${policyId}/cancel`, { reason });
  }

  /**
   * Get policy document
   */
  async getPolicyDocument(policyId: string): Promise<ApiResponse<{ documentUrl: string }>> {
    return this.httpClient.get(`/policies/${policyId}/document`);
  }
}

// Export singleton instance
export default new PolicyService(apiClient);
