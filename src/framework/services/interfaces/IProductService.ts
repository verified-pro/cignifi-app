import type { ApiResponse, Product, Rider } from '../../types';

/**
 * IProductService - Product service interface (Interface Segregation Principle)
 * Specific contract for product-related operations only
 */
export interface IProductService {
  /**
   * Get all products
   */
  getProducts(): Promise<ApiResponse<Product[]>>;

  /**
   * Get specific product
   */
  getProductById(productId: string): Promise<ApiResponse<Product>>;

  /**
   * Get products by tier
   */
  getProductsByTier(tier: string): Promise<ApiResponse<Product[]>>;

  /**
   * Get all riders
   */
  getRiders(): Promise<ApiResponse<Rider[]>>;

  /**
   * Get specific rider
   */
  getRiderById(riderId: string): Promise<ApiResponse<Rider>>;

  /**
   * Calculate total price for product with riders
   */
  calculatePrice(data: {
    productId: string;
    riderIds: string[];
    dependents?: number;
  }): Promise<ApiResponse<{ totalPrice: number; breakdown: Record<string, number> }>>;
}
