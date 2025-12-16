# 🌌 Galaxy Store - E-Commerce Platform

A modern, feature-rich e-commerce platform built with **React 18**, **TypeScript**, and **Tailwind CSS**. Galaxy Store offers a premium shopping experience with advanced features like premium memberships, trending products, wishlist management, and comprehensive admin controls.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse products by categories, brands, and price ranges
- **Premium Products**: Exclusive products for premium members with glossy gold styling
- **Trending Products**: Hot items with glossy red styling and special indicators  
- **Combo Products**: Products that are both premium and trending with unique gradient styling
- **Advanced Search & Filters**: Search by name, filter by category, brand, price, and ratings
- **Shopping Cart**: Add/remove items with quantity management
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure login/register with profile management
- **Order Management**: Track orders with detailed history
- **Coupon System**: Apply discount codes at checkout (SAVE10, FLAT100, FREESHIP)
- **Multiple Shipping Options**: Choose from various US states with dollar pricing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Theme Support**: Built-in dark theme with cosmic styling

### 👨‍💼 Admin Features
- **Dashboard**: Comprehensive analytics and overview with charts
- **Product Management**: Add, edit, delete products with inventory tracking
- **Order Management**: View and update order statuses
- **Coupon Management**: Create and manage discount codes
- **Sales Forecasting**: Analytics with interactive charts (using Recharts)
- **Promo Banner Management**: Create and manage hero section banners

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui component system
- **Routing**: React Router DOM v6
- **State Management**: React Context API (AuthContext, CartContext, ThemeContext)
- **Icons**: Lucide React
- **Charts**: Recharts for analytics
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations
- **Build Tool**: Vite with SWC
- **Development**: ESLint, TypeScript
- **Package Manager**: npm/bun
- **Storage**: LocalStorage with planned SQLite integration

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aditya-Kumar-1108/nebula-e-shop-dreams.git
   cd E-Commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # Server runs on port 8080 by default
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components (40+ components)
│   ├── admin/           # Admin panel components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProductManagement.tsx
│   │   ├── AdminOrderManagement.tsx
│   │   └── SalesForecast.tsx
│   ├── ProductCard.tsx  # Product display with premium/trending styles
│   ├── Navbar.tsx       # Navigation with auth & cart
│   ├── BannerCarousel.tsx # Hero banners carousel
│   └── AuthModal.tsx    # Login/Register modal
├── pages/               # Page components
│   ├── Home.tsx         # Landing page with carousels
│   ├── Shop.tsx         # Product listing with filters
│   ├── Cart.tsx         # Shopping cart with US shipping
│   ├── Orders.tsx       # Order history
│   ├── Profile.tsx      # User profile management
│   ├── Wishlist.tsx     # Saved products
│   ├── Admin.tsx        # Admin panel
│   ├── About.tsx        # Company information
│   └── Contact.tsx      # Contact form
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   ├── CartContext.tsx  # Shopping cart state  
│   └── ThemeContext.tsx # Theme management
├── lib/                 # Utilities and data
│   ├── database.ts      # LocalStorage data layer
│   ├── productData.ts   # Sample product data
│   ├── expandedProductData.ts # Extended products
│   ├── initializeProducts.ts  # Data initialization
│   └── utils.ts         # Helper functions
└── hooks/               # Custom hooks
    ├── use-mobile.tsx   # Mobile detection
    └── use-toast.ts     # Toast notifications
```

## 🎨 Styling System

The app uses a custom cosmic-themed design system built on Tailwind CSS:

### Product Cards
- **Premium Products**: Gold gradient with glossy effects (`.premium-card`)
- **Trending Products**: Red gradient with glossy effects (`.trending-card`)  
- **Combo Products**: Multi-color gradient for premium + trending (`.combo-card`)

### Button Styles  
- **Premium Buttons**: Gold styling (`.btn-premium`)
- **Trending Buttons**: Red styling (`.btn-trending`)
- **Combo Buttons**: Multi-gradient styling (`.btn-combo`)

### Theme Colors
```css
/* Custom CSS variables defined in index.css */
--galaxy-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--premium-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--trending-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

## 👤 Default Users & Demo Data

### Test Accounts
- **Customer**: email: `user@galaxy.com`, password: `password123`
- **Admin**: email: `admin@galaxy.com`, password: `admin123`

### Sample Data Included
- **Products**: 50+ products across multiple categories (Electronics, Fashion, Gaming, etc.)
- **Categories**: Electronics, Fashion, Sports & Fitness, Home & Kitchen, Health & Beauty, Books, Gaming, Audio, Wearables, Furniture
- **Brands**: Apple, Samsung, Nike, Adidas, Sony, Herman Miller, CosmicGaming, etc.
- **Coupons**: 
  - `SAVE10` - 10% off entire order
  - `FLAT100` - $100 off orders 
  - `FREESHIP` - Free shipping
- **Shipping**: US states with realistic costs ($50-100, 2-5 days)

## �️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🎯 Key Features Implemented

### Customer Experience
- ✅ Product browsing with filtering and search
- ✅ Shopping cart with persistent storage
- ✅ User authentication and profiles  
- ✅ Order placement and tracking
- ✅ Wishlist functionality
- ✅ Coupon system
- ✅ Responsive design
- ✅ Premium/trending product styling

### Admin Panel
- ✅ Product management (CRUD operations)
- ✅ Order management and status updates  
- ✅ Coupon management
- ✅ Sales analytics with charts
- ✅ Banner management
- ✅ User management

### Technical
- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Context API for state management
- ✅ LocalStorage for data persistence
- ✅ Responsive UI with Tailwind CSS
- ✅ Form validation with Zod
- ✅ Toast notifications
- ✅ Error handling

## 🔧 Configuration

### Development Server
The Vite configuration runs the development server on:
- **Host**: `::` (all interfaces)  
- **Port**: `8080`
- **Plugins**: React SWC, Component Tagger (dev mode)

### Path Aliases
```typescript
// Configured in vite.config.ts
"@": path.resolve(__dirname, "./src")
```

### No Environment Variables Required
The app runs completely client-side with no external API dependencies.

## 🚀 Deployment

### Build Commands
```bash
# Production build
npm run build

# Development build  
npm run build:dev

# Preview build locally
npm run preview
```

### Deployment Platforms
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment
- **Any static hosting**: Upload the `dist` folder

## 🔮 Future Enhancements

### Planned Features
- [ ] Backend API integration (Node.js/Express)
- [ ] Real SQLite/PostgreSQL database
- [ ] Payment processing (Stripe integration)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Real-time inventory updates
- [ ] Advanced search with Elasticsearch
- [ ] PWA capabilities
- [ ] Multi-language support

### Database Integration Ready
The codebase includes infrastructure for SQLite integration:
- Database abstraction layer in `lib/database.ts`
- SQLite emulator in `lib/sqliteDatabase.ts`  
- Migration-ready data models

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact & Support

- **Repository**: [nebula-e-shop-dreams](https://github.com/Aditya-Kumar-1108/nebula-e-shop-dreams)
- **Issues**: Create an issue on GitHub
- **Developer**: Aditya Kumar

---

**✨ Built with passion using React, TypeScript, and the power of the cosmos! 🌌**