import type { ApiResponse } from '../../types';

/**
 * IHttpClient - Interface for HTTP communication (Dependency Inversion Principle)
 * Defines contract for all HTTP operations
 */
export interface IHttpClient {
  /**
   * Set authentication token
   */
  setToken(token: string): void;

  /**
   * Clear authentication token
   */
  clearToken(): void;

  /**
   * Generic request method
   */
  request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>>;

  /**
   * GET request
   */
  get<T>(endpoint: string): Promise<ApiResponse<T>>;

  /**
   * POST request
   */
  post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>>;

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>>;

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>>;

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}
