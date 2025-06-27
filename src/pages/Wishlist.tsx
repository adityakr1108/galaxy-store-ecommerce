
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { database, Product } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingBag } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const wishlist = database.getWishlist(user.id);
      const productIds = wishlist.map(item => item.productId);
      const products = productIds
        .map(id => database.getProductById(id))
        .filter((product): product is Product => product !== null);
      
      setWishlistProducts(products);
      setWishlistProductIds(productIds);
    }
  }, [user]);

  const handleToggleWishlist = (productId: string) => {
    if (!user) return;

    if (wishlistProductIds.includes(productId)) {
      database.removeFromWishlist(user.id, productId);
      setWishlistProducts(prev => prev.filter(p => p.id !== productId));
      setWishlistProductIds(prev => prev.filter(id => id !== productId));
    } else {
      database.addToWishlist(user.id, productId);
      const product = database.getProductById(productId);
      if (product) {
        setWishlistProducts(prev => [...prev, product]);
        setWishlistProductIds(prev => [...prev, productId]);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please sign in</h1>
          <p className="text-gray-400">You need to be logged in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-8xl mb-6">💫</div>
          <h1 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h1>
          <p className="text-gray-400 mb-8">
            Save your favorite cosmic items to your wishlist and never lose track of them.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/shop">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Discover Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          My <span className="text-gradient">Wishlist</span>
        </h1>
        <p className="text-gray-400">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved for later
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToWishlist={handleToggleWishlist}
            isInWishlist={wishlistProductIds.includes(product.id)}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild className="btn-secondary">
          <Link to="/shop">
            <Heart className="w-4 h-4 mr-2" />
            Discover More Products
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Wishlist;
