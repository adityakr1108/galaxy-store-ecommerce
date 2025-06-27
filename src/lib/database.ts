import { v4 as uuidv4 } from 'uuid';
import { sqliteDB } from './sqliteDatabase';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isPremium: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  isPremiumExclusive: boolean;
  isTrending: boolean;
  tags: string[];
  specifications: Record<string, string>;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  location: string;
  estimatedDelivery: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  description: string;
  isActive: boolean;
  expiresAt?: string;
}

interface ShippingLocation {
  name: string;
  cost: number;
  days: number;
}

interface PromoBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

interface WishlistItem {
  userId: string;
  productId: string;
  addedAt: string;
}

class Database {
  constructor() {
    if (!localStorage.getItem('galaxy_store_users')) {
      localStorage.setItem('galaxy_store_users', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_products')) {
      localStorage.setItem('galaxy_store_products', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_orders')) {
      localStorage.setItem('galaxy_store_orders', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_cart')) {
      localStorage.setItem('galaxy_store_cart', JSON.stringify({}));
    }

    if (!localStorage.getItem('galaxy_store_reviews')) {
      localStorage.setItem('galaxy_store_reviews', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_coupons')) {
      localStorage.setItem('galaxy_store_coupons', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_shipping_locations')) {
      localStorage.setItem('galaxy_store_shipping_locations', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_promo_banners')) {
      localStorage.setItem('galaxy_store_promo_banners', JSON.stringify([]));
    }

    if (!localStorage.getItem('galaxy_store_wishlist')) {
      localStorage.setItem('galaxy_store_wishlist', JSON.stringify([]));
    }
  }

  private getUsersData(): User[] {
    return JSON.parse(localStorage.getItem('galaxy_store_users') || '[]');
  }

  private setUsersData(users: User[]): void {
    localStorage.setItem('galaxy_store_users', JSON.stringify(users));
  }

  private getProductsData(): Product[] {
    return JSON.parse(localStorage.getItem('galaxy_store_products') || '[]');
  }

  private setProductsData(products: Product[]): void {
    localStorage.setItem('galaxy_store_products', JSON.stringify(products));
  }

  private getOrdersData(): Order[] {
    return JSON.parse(localStorage.getItem('galaxy_store_orders') || '[]');
  }

  private setOrdersData(orders: Order[]): void {
    localStorage.setItem('galaxy_store_orders', JSON.stringify(orders));
  }

  private getCartData(userId: string): CartItem[] {
    const cart = JSON.parse(localStorage.getItem('galaxy_store_cart') || '{}');
    return cart[userId] || [];
  }

  private setCartData(userId: string, cart: CartItem[]): void {
    const allCarts = JSON.parse(localStorage.getItem('galaxy_store_cart') || '{}');
    allCarts[userId] = cart;
    localStorage.setItem('galaxy_store_cart', JSON.stringify(allCarts));
  }

  private getReviewsData(): Review[] {
    return JSON.parse(localStorage.getItem('galaxy_store_reviews') || '[]');
  }

  private setReviewsData(reviews: Review[]): void {
    localStorage.setItem('galaxy_store_reviews', JSON.stringify(reviews));
  }

  private getCouponsData(): Coupon[] {
    return JSON.parse(localStorage.getItem('galaxy_store_coupons') || '[]');
  }

  private setCouponsData(coupons: Coupon[]): void {
    localStorage.setItem('galaxy_store_coupons', JSON.stringify(coupons));
  }

  private getWishlistData(): WishlistItem[] {
    return JSON.parse(localStorage.getItem('galaxy_store_wishlist') || '[]');
  }

  private setWishlistData(wishlist: WishlistItem[]): void {
    localStorage.setItem('galaxy_store_wishlist', JSON.stringify(wishlist));
  }

  getShippingLocations(): ShippingLocation[] {
    return JSON.parse(localStorage.getItem('galaxy_store_shipping_locations') || '[]');
  }

  getShippingByLocation(locationName: string): ShippingLocation | undefined {
    const locations = this.getShippingLocations();
    return locations.find(location => location.name === locationName);
  }

  private setShippingLocations(locations: ShippingLocation[]): void {
    localStorage.setItem('galaxy_store_shipping_locations', JSON.stringify(locations));
  }

  private getPromoBannersData(): PromoBanner[] {
    return JSON.parse(localStorage.getItem('galaxy_store_promo_banners') || '[]');
  }

  private setPromoBannersData(banners: PromoBanner[]): void {
    localStorage.setItem('galaxy_store_promo_banners', JSON.stringify(banners));
  }

  // Enhanced sync method
  private syncToSQLite(tableName: string, data: any) {
    try {
      sqliteDB.syncWithLocalStorage();
    } catch (error) {
      console.error('SQLite sync error:', error);
    }
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...user
    };
    const users = this.getUsersData();
    users.push(newUser);
    this.setUsersData(users);
    this.syncToSQLite('users', users);
    return newUser;
  }

  getUserById(id: string): User | undefined {
    const users = this.getUsersData();
    return users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsersData();
    return users.find(user => user.email === email);
  }

  getUsers(): User[] {
    return this.getUsersData();
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const users = this.getUsersData();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return undefined;
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    this.setUsersData(users);
    this.syncToSQLite('users', users);
    return updatedUser;
  }

  deleteUser(id: string): void {
    let users = this.getUsersData();
    users = users.filter(user => user.id !== id);
    this.setUsersData(users);
  }

  createProduct(product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'inStock' | 'specifications'>): Product {
    const newProduct: Product = {
      id: uuidv4(),
      rating: 0,
      reviewCount: 0,
      inStock: product.stock > 0,
      specifications: {},
      ...product
    };
    const products = this.getProductsData();
    products.push(newProduct);
    this.setProductsData(products);
    this.syncToSQLite('products', products);
    return newProduct;
  }

  getProductById(id: string): Product | undefined {
    const products = this.getProductsData();
    return products.find(product => product.id === id);
  }

  getProducts(): Product[] {
    return this.getProductsData();
  }

  getProductsByCategory(category: string): Product[] {
    const products = this.getProductsData();
    return products.filter(product => product.category === category);
  }

  getTrendingProducts(): Product[] {
    const products = this.getProductsData();
    return products.filter(product => product.isTrending);
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const products = this.getProductsData();
    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      return undefined;
    }

    const updatedProduct = { ...products[productIndex], ...updates };
    products[productIndex] = updatedProduct;
    this.setProductsData(products);
    this.syncToSQLite('products', products);
    return updatedProduct;
  }

  deleteProduct(id: string): void {
    let products = this.getProductsData();
    products = products.filter(product => product.id !== id);
    this.setProductsData(products);
    this.syncToSQLite('products', products);
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...order
    };
    const orders = this.getOrdersData();
    orders.push(newOrder);
    this.setOrdersData(orders);
    this.syncToSQLite('orders', orders);
    return newOrder;
  }

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrdersData();
    return orders.find(order => order.id === id);
  }

  getOrders(): Order[] {
    return this.getOrdersData();
  }

  getOrdersByUserId(userId: string): Order[] {
    const orders = this.getOrdersData();
    return orders.filter(order => order.userId === userId);
  }

  updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const orders = this.getOrdersData();
    const orderIndex = orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
      return undefined;
    }

    const updatedOrder = { ...orders[orderIndex], ...updates };
    orders[orderIndex] = updatedOrder;
    this.setOrdersData(orders);
    this.syncToSQLite('orders', orders);
    return updatedOrder;
  }

  deleteOrder(id: string): void {
    let orders = this.getOrdersData();
    orders = orders.filter(order => order.id !== id);
    this.setOrdersData(orders);
  }

  getCart(userId: string): CartItem[] {
    return this.getCartData(userId);
  }

  setCart(userId: string, cart: CartItem[]): void {
    this.setCartData(userId, cart);
  }

  clearCart(userId: string): void {
    this.setCartData(userId, []);
  }

  getWishlist(userId: string): WishlistItem[] {
    const wishlist = this.getWishlistData();
    return wishlist.filter(item => item.userId === userId);
  }

  addToWishlist(userId: string, productId: string): void {
    const wishlist = this.getWishlistData();
    const existingItem = wishlist.find(item => item.userId === userId && item.productId === productId);
    
    if (!existingItem) {
      wishlist.push({
        userId,
        productId,
        addedAt: new Date().toISOString()
      });
      this.setWishlistData(wishlist);
    }
  }

  removeFromWishlist(userId: string, productId: string): void {
    let wishlist = this.getWishlistData();
    wishlist = wishlist.filter(item => !(item.userId === userId && item.productId === productId));
    this.setWishlistData(wishlist);
  }

  createReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...review
    };
    const reviews = this.getReviewsData();
    reviews.push(newReview);
    this.setReviewsData(reviews);
    
    // Update product rating and review count
    this.updateProductRating(review.productId);
    
    return newReview;
  }

  getReviewsByProductId(productId: string): Review[] {
    const reviews = this.getReviewsData();
    return reviews.filter(review => review.productId === productId);
  }

  private updateProductRating(productId: string): void {
    const reviews = this.getReviewsByProductId(productId);
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    this.updateProduct(productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });
  }

  createCoupon(coupon: Coupon): Coupon {
    const coupons = this.getCouponsData();
    coupons.push(coupon);
    this.setCouponsData(coupons);
    this.syncToSQLite('coupons', coupons);
    return coupon;
  }

  getCouponByCode(code: string): Coupon | undefined {
    const coupons = this.getCouponsData();
    return coupons.find(coupon => coupon.code === code);
  }

  getCoupons(): Coupon[] {
    return this.getCouponsData();
  }

  createPromoBanner(banner: Omit<PromoBanner, 'id'>): PromoBanner {
    const newBanner: PromoBanner = {
      id: uuidv4(),
      ...banner
    };
    const banners = this.getPromoBannersData();
    banners.push(newBanner);
    this.setPromoBannersData(banners);
    return newBanner;
  }

  getPromoBannerById(id: string): PromoBanner | undefined {
    const banners = this.getPromoBannersData();
    return banners.find(banner => banner.id === id);
  }

  getActivePromoBanners(): PromoBanner[] {
    const banners = this.getPromoBannersData();
    return banners.filter(banner => banner.isActive);
  }

  getPromoBanners(): PromoBanner[] {
    return this.getPromoBannersData();
  }

  updatePromoBanner(id: string, updates: Partial<PromoBanner>): PromoBanner | undefined {
    const banners = this.getPromoBannersData();
    const bannerIndex = banners.findIndex(banner => banner.id === id);

    if (bannerIndex === -1) {
      return undefined;
    }

    const updatedBanner = { ...banners[bannerIndex], ...updates };
    banners[bannerIndex] = updatedBanner;
    this.setPromoBannersData(banners);
    return updatedBanner;
  }

  deletePromoBanner(id: string): void {
    let banners = this.getPromoBannersData();
    banners = banners.filter(banner => banner.id !== id);
    this.setPromoBannersData(banners);
  }

  // Add SQLite query interface
  query(sql: string): any[] {
    return sqliteDB.query(sql);
  }

  exportToSQLite(): void {
    sqliteDB.syncWithLocalStorage();
    console.log('✅ All data exported to SQLite emulator');
  }

  exportToCSV(tableName: string): string {
    return sqliteDB.exportToCSV(tableName);
  }

  private initializeDefaultData() {
    // Create default admin user if not exists
    const adminUser = this.getUserByEmail('admin@galaxy.com');
    if (!adminUser) {
      this.createUser({
        name: 'Admin',
        email: 'admin@galaxy.com',
        password: 'admin123',
        isPremium: true,
        isAdmin: true
      });
    }

    // Initialize products from external data
    const existingProducts = this.getProducts();
    if (existingProducts.length < 30) {
      // Import and initialize products
      import('./initializeProducts').then(({ initializeProducts }) => {
        initializeProducts();
      });
    }

    // Initialize default coupons
    const existingCoupons = this.getCoupons();
    if (existingCoupons.length === 0) {
      this.createCoupon({
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        description: '10% off on your order',
        isActive: true,
        expiresAt: new Date('2025-12-31').toISOString()
      });

      this.createCoupon({
        code: 'FLAT100',
        type: 'fixed',
        value: 100,
        description: '$100 off on your order',
        isActive: true,
        expiresAt: new Date('2025-12-31').toISOString()
      });

      this.createCoupon({
        code: 'FREESHIP',
        type: 'shipping',
        value: 0,
        description: 'Free shipping on your order',
        isActive: true,
        expiresAt: new Date('2025-12-31').toISOString()
      });
    }

    // Initialize shipping locations
    const shippingLocations = this.getShippingLocations();
    if (shippingLocations.length === 0) {
      localStorage.setItem('galaxy_store_shipping_locations', JSON.stringify([
        { name: 'Delhi', cost: 50, days: 2 },
        { name: 'Mumbai', cost: 60, days: 3 },
        { name: 'Bangalore', cost: 55, days: 2 },
        { name: 'Chennai', cost: 65, days: 3 },
        { name: 'Kolkata', cost: 70, days: 4 },
        { name: 'Hyderabad', cost: 60, days: 3 },
        { name: 'Pune', cost: 55, days: 2 },
        { name: 'Remote', cost: 100, days: 5 }
      ]));
    }

    // Initialize hero banners
    const heroBanners = this.getPromoBanners();
    if (heroBanners.length === 0) {
      this.createPromoBanner({
        title: 'Big Summer Sale',
        description: 'Up to 50% Off on Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
        link: '/shop?category=Electronics',
        isActive: true
      });

      this.createPromoBanner({
        title: 'New Arrivals',
        description: 'Latest Fashion Collection',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
        link: '/shop?category=Fashion',
        isActive: true
      });

      this.createPromoBanner({
        title: 'Premium Exclusive',
        description: 'Special Deals for Premium Members',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop',
        link: '/shop?premium=true',
        isActive: true
      });

      this.createPromoBanner({
        title: 'Coupon Deals',
        description: 'Apply Coupons at Checkout - Save More!',
        imageUrl: 'https://downloadpsd.cc/wp-content/uploads/2020/07/Free-Discount-Coupons-Template-PSD.jpg',
        link: '/cart',
        isActive: true
      });
    }
  }

  getAllData() {
    return {
      users: this.getUsers(),
      products: this.getProducts(),
      orders: this.getOrders(),
      coupons: this.getCoupons(),
      shippingLocations: this.getShippingLocations(),
      promoBanners: this.getPromoBanners(),
      wishlist: this.getWishlistData()
    };
  }

  updateProductStock(productId: string, quantity: number): boolean {
    const product = this.getProductById(productId);
    if (!product || product.stock < quantity) {
      return false;
    }

    const newStock = product.stock - quantity;
    this.updateProduct(productId, { 
      ...product, 
      stock: newStock, 
      inStock: newStock > 0 
    });
    return true;
  }

  isProductInStock(productId: string, quantity: number = 1): boolean {
    const product = this.getProductById(productId);
    return product ? product.stock >= quantity : false;
  }
}

const database = new Database();
database['initializeDefaultData']();

(window as any).database = database;

export { database };
export type { User, Product, Order, CartItem, Review, Coupon, ShippingLocation, PromoBanner, WishlistItem };
