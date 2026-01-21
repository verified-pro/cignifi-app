import type { Claim, ApiResponse } from '../types';
import type { IClaimService } from './interfaces/IClaimService';
import type { IHttpClient } from './interfaces/IHttpClient';
import apiClient from './apiClient';

/**
 * ClaimService - Claim service implementation (Single Responsibility Principle)
 * Only handles claims-related operations
 * Depends on IHttpClient abstraction (Dependency Inversion Principle)
 */
class ClaimService implements IClaimService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Initiate new claim
   */
  async initiateClaim(data: {
    policyId: string;
    beneficiaryName: string;
    claimDetails: string;
  }): Promise<ApiResponse<Claim>> {
    return this.httpClient.post('/claims', data);
  }

  /**
   * Get user's claims
   */
  async getClaims(): Promise<ApiResponse<Claim[]>> {
    return this.httpClient.get('/claims');
  }

  /**
   * Get specific claim
   */
  async getClaimById(claimId: string): Promise<ApiResponse<Claim>> {
    return this.httpClient.get(`/claims/${claimId}`);
  }

  /**
   * Submit claim documents
   */
  async submitClaimDocuments(
    claimId: string,
    documents: File[]
  ): Promise<ApiResponse<Claim>> {
    const formData = new FormData();
    documents.forEach((doc) => formData.append('documents', doc));

    return this.httpClient.request(`/claims/${claimId}/documents`, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  /**
   * Get claim status
   */
  async getClaimStatus(claimId: string): Promise<ApiResponse<{
    status: string;
    lastUpdate: string;
    nextStep?: string;
  }>> {
    return this.httpClient.get(`/claims/${claimId}/status`);
  }

  /**
   * Cancel claim
   */
  async cancelClaim(claimId: string, reason: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.httpClient.post(`/claims/${claimId}/cancel`, { reason });
  }
}

// Export singleton instance
export default new ClaimService(apiClient);
