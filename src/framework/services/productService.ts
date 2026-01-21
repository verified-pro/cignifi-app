import type { Product, Rider, ApiResponse } from '../types';
import type { IProductService } from './interfaces/IProductService';
import type { IHttpClient } from './interfaces/IHttpClient';
import apiClient from './apiClient';

/**
 * ProductService - Product service implementation (Single Responsibility Principle)
 * Only handles product and rider operations
 * Depends on IHttpClient abstraction (Dependency Inversion Principle)
 */
class ProductService implements IProductService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.httpClient.get('/products');
  }

  /**
   * Get specific product
   */
  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    return this.httpClient.get(`/products/${productId}`);
  }

  /**
   * Get products by tier
   */
  async getProductsByTier(tier: string): Promise<ApiResponse<Product[]>> {
    return this.httpClient.get(`/products?tier=${tier}`);
  }

  /**
   * Get all riders
   */
  async getRiders(): Promise<ApiResponse<Rider[]>> {
    return this.httpClient.get('/riders');
  }

  /**
   * Get specific rider
   */
  async getRiderById(riderId: string): Promise<ApiResponse<Rider>> {
    return this.httpClient.get(`/riders/${riderId}`);
  }

  /**
   * Calculate price with products and riders
   */
  async calculatePrice(data: {
    productId: string;
    riderIds: string[];
    dependents?: number;
  }): Promise<ApiResponse<{ totalPrice: number; breakdown: Record<string, number> }>> {
    return this.httpClient.post('/products/calculate-price', data);
  }
}

// Export singleton instance
export default new ProductService(apiClient);
