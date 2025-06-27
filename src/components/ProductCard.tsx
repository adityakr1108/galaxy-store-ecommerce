
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, Heart, Package, TrendingUp } from 'lucide-react';
import { Product } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToWishlist, 
  isInWishlist = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (product.isPremiumExclusive && !user?.isPremium) {
      toast({
        title: "Premium required",
        description: "This is a premium exclusive product. Upgrade to access it!",
        variant: "destructive",
      });
      return;
    }

    if (!product.inStock || product.stock <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-500'
        }`}
      />
    ));
  };

  const getStockBadge = () => {
    if (!product.inStock || product.stock <= 0) {
      return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
    }
    if (product.stock <= 5) {
      return <Badge className="bg-orange-500 text-white text-xs">Low Stock</Badge>;
    }
    return null;
  };

  const isOutOfStock = !product.inStock || product.stock <= 0;
  const isPremiumProduct = product.isPremiumExclusive;

  return (
    <Card className={`${isPremiumProduct ? 'premium-card' : 'theme-card'} group hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col h-full`}>
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {product.isTrending && (
            <Badge className="bg-red-500 text-white font-semibold text-xs animate-pulse">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          {isPremiumProduct && (
            <Badge className={`${user?.isPremium ? 'bg-premium-gold text-black' : 'bg-gray-500 text-white'} font-semibold text-xs`}>
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {getStockBadge()}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isInWishlist ? 'text-red-500 fill-current' : 'text-white hover:text-red-400'
            }`}
          />
        </button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-400 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center space-x-1">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-400 ml-2">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className={`text-xl font-bold ${isPremiumProduct && user?.isPremium ? 'text-premium-gold' : 'text-theme-green'}`}>
              ${product.price.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500">
              Stock: {product.stock}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs bg-card/80 text-gray-300 mb-1">
              {product.brand}
            </Badge>
            <p className="text-xs text-gray-400">{product.category}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : isPremiumProduct && user?.isPremium
                ? 'btn-premium'
                : 'btn-primary'
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
