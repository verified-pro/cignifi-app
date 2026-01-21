import type { ApiResponse, Policy, Beneficiary } from '../../types';

/**
 * IPolicyService - Policy service interface (Interface Segregation Principle)
 * Specific contract for policy-related operations only
 */
export interface IPolicyService {
  /**
   * Create new policy
   */
  createPolicy(data: {
    productId: string;
    riderIds: string[];
    dependents?: Array<{ name: string; relationship: string; dateOfBirth: string }>;
    referralCode?: string;
  }): Promise<ApiResponse<Policy>>;

  /**
   * Get user's policies
   */
  getPolicies(): Promise<ApiResponse<Policy[]>>;

  /**
   * Get specific policy
   */
  getPolicyById(policyId: string): Promise<ApiResponse<Policy>>;

  /**
   * Submit policy for underwriting
   */
  submitToUnderwriting(policyId: string, kycData: unknown): Promise<ApiResponse<{
    status: 'approved' | 'pending' | 'declined';
    message: string;
  }>>;

  /**
   * Add beneficiary to policy
   */
  addBeneficiary(policyId: string, beneficiary: Beneficiary): Promise<ApiResponse<Policy>>;

  /**
   * Update beneficiary
   */
  updateBeneficiary(
    policyId: string,
    beneficiaryId: string,
    beneficiary: Partial<Beneficiary>
  ): Promise<ApiResponse<Policy>>;

  /**
   * Remove beneficiary
   */
  removeBeneficiary(policyId: string, beneficiaryId: string): Promise<ApiResponse<Policy>>;

  /**
   * Cancel policy
   */
  cancelPolicy(policyId: string, reason: string): Promise<ApiResponse<{ success: boolean }>>;

  /**
   * Get policy document
   */
  getPolicyDocument(policyId: string): Promise<ApiResponse<{ documentUrl: string }>>;
}
