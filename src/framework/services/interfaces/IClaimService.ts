import type { ApiResponse, Claim } from '../../types';

/**
 * IClaimService - Claim service interface (Interface Segregation Principle)
 * Specific contract for claims-related operations only
 */
export interface IClaimService {
  /**
   * Initiate new claim
   */
  initiateClaim(data: {
    policyId: string;
    beneficiaryName: string;
    claimDetails: string;
  }): Promise<ApiResponse<Claim>>;

  /**
   * Get user's claims
   */
  getClaims(): Promise<ApiResponse<Claim[]>>;

  /**
   * Get specific claim
   */
  getClaimById(claimId: string): Promise<ApiResponse<Claim>>;

  /**
   * Submit claim documents
   */
  submitClaimDocuments(claimId: string, documents: File[]): Promise<ApiResponse<Claim>>;

  /**
   * Get claim status
   */
  getClaimStatus(claimId: string): Promise<ApiResponse<{
    status: string;
    lastUpdate: string;
    nextStep?: string;
  }>>;

  /**
   * Cancel claim
   */
  cancelClaim(claimId: string, reason: string): Promise<ApiResponse<{ success: boolean }>>;
}
