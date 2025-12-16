// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('galaxy_store_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('galaxy_store_token', token);
    } else {
      localStorage.removeItem('galaxy_store_token');
    }
  }

  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(name: string, email: string, password: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async verifyToken() {
    return await this.request('/auth/verify');
  }

  logout() {
    this.setToken(null);
  }

  // Products endpoints
  async getProducts(params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await this.request(endpoint);
  }

  async getProduct(id: string) {
    return await this.request(`/products/${id}`);
  }

  async getTrendingProducts() {
    return await this.request('/products/trending/list');
  }

  async getPremiumProducts() {
    return await this.request('/products/premium/list');
  }

  async createProduct(productData: any) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProductStock(id: string, quantity: number) {
    return await this.request(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  // Cart endpoints
  async getCart() {
    return await this.request('/cart');
  }

  async addToCart(productId: string, quantity: number) {
    return await this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCart(productId: string, quantity: number) {
    return await this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async clearCart() {
    return await this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders() {
    return await this.request('/orders');
  }

  async getOrder(id: string) {
    return await this.request(`/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return await this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getAllOrders() {
    return await this.request('/orders/admin/all');
  }

  // Wishlist endpoints
  async getWishlist() {
    return await this.request('/wishlist');
  }

  async addToWishlist(productId: string) {
    return await this.request('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return await this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearWishlist() {
    return await this.request('/wishlist', {
      method: 'DELETE',
    });
  }

  // Coupons endpoints
  async getCoupons() {
    return await this.request('/coupons');
  }

  async validateCoupon(code: string) {
    return await this.request(`/coupons/validate/${code}`);
  }

  async createCoupon(couponData: any) {
    return await this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  }

  async updateCoupon(id: string, couponData: any) {
    return await this.request(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    });
  }

  async deleteCoupon(id: string) {
    return await this.request(`/coupons/${id}`, {
      method: 'DELETE',
    });
  }

  // Users endpoints
  async getUsers() {
    return await this.request('/users');
  }

  async updateProfile(name: string) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async togglePremiumStatus(userId: string) {
    return await this.request(`/users/${userId}/premium`, {
      method: 'PATCH',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return await this.request('/admin/stats');
  }

  async getLowStockProducts() {
    return await this.request('/admin/low-stock');
  }

  async getAnalytics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const endpoint = params.toString() ? `/admin/analytics?${params}` : '/admin/analytics';
    return await this.request(endpoint);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;