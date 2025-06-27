
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { BannerCarousel } from '@/components/BannerCarousel';
import { database, Product } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Star, TrendingUp, Zap, Users, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);

  useEffect(() => {
    const allProducts = database.getProducts();
    
    // Get featured products (highest rated and in stock)
    const featured = allProducts
      .filter(p => p.inStock && p.stock > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    setFeaturedProducts(featured);

    // Get trending products (in stock)
    const trending = database.getTrendingProducts()
      .filter(p => p.inStock && p.stock > 0)
      .slice(0, 6);
    setTrendingProducts(trending);

    // Get premium products (in stock)
    const premium = allProducts
      .filter(p => p.isPremiumExclusive && p.inStock && p.stock > 0)
      .slice(0, 4);
    setPremiumProducts(premium);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <BannerCarousel />
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="theme-card text-center hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <Zap className="w-12 h-12 text-theme-green mx-auto mb-4 animate-glow" />
              <h3 className="text-xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-400">
                Lightning-fast delivery with real-time tracking
              </p>
            </CardContent>
          </Card>
          
          <Card className="theme-card text-center hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <Shield className="w-12 h-12 text-theme-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Secure Shopping</h3>
              <p className="text-gray-400">
                Your data is protected with advanced encryption
              </p>
            </CardContent>
          </Card>
          
          <Card className="theme-card text-center hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-theme-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Round-the-clock support from our expert team
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-red-500 animate-pulse" />
              Trending <span className="text-gradient ml-2">Now</span>
            </h2>
            <Button asChild variant="outline" className="bg-card/50 text-white hover:bg-card/80 border-border/50">
              <Link to="/shop?trending=true">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Premium Products for Premium Users */}
      {user?.isPremium && premiumProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Star className="w-8 h-8 mr-3 text-premium-gold animate-premium-pulse" />
              Premium <span className="text-premium-gradient ml-2">Exclusive</span>
            </h2>
            <Button asChild variant="outline" className="bg-premium-gold/20 text-premium-gold hover:bg-premium-gold/40 border-premium-gold/40">
              <Link to="/shop?premium=true">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">
            Featured <span className="text-gradient">Products</span>
          </h2>
          <Button asChild className="btn-primary">
            <Link to="/shop">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop All
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Card className="theme-card hover:scale-105 transition-all duration-300">
          <CardContent className="p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start <span className="text-gradient">Shopping</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of satisfied customers and discover amazing products with unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary text-lg px-8 py-4">
                <Link to="/shop">Start Shopping</Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" className="text-lg px-8 py-4 bg-card/50 text-white hover:bg-card/80 border-border/50">
                  <Link to="/register">Join Now</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
