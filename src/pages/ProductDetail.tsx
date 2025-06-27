
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { database, Product, Review } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Star, Heart, Package, ArrowLeft, Plus, Minus, TrendingUp, Zap } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (!id) return;

    const productData = database.getProductById(id);
    if (productData) {
      setProduct(productData);
      setSelectedImage(0);

      // Get reviews
      const productReviews = database.getReviewsByProductId(id);
      setReviews(productReviews);

      // Get related products (same category)
      const related = database.getProductsByCategory(productData.category)
        .filter(p => p.id !== id && p.inStock)
        .slice(0, 4);
      setRelatedProducts(related);

      // Check wishlist status
      if (user) {
        const wishlist = database.getWishlist(user.id);
        setIsInWishlist(wishlist.some(item => item.productId === id));
      }
    }
  }, [id, user]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link to="/shop">
            <Button className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (product.isPremiumExclusive && !user.isPremium) {
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

    if (quantity > product.stock) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock} items available.`,
        variant: "destructive",
      });
      return;
    }

    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist) {
      database.removeFromWishlist(user.id, product.id);
      setIsInWishlist(false);
      toast({ title: "Removed from wishlist" });
    } else {
      database.addToWishlist(user.id, product.id);
      setIsInWishlist(true);
      toast({ title: "Added to wishlist" });
    }
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Review required",
        description: "Please write a review comment.",
        variant: "destructive",
      });
      return;
    }

    const review = database.createReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment
    });

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    
    // Update product data to reflect new rating
    const updatedProduct = database.getProductById(product.id);
    if (updatedProduct) {
      setProduct(updatedProduct);
    }

    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback.",
    });
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => interactive && onRate && onRate(index + 1)}
        disabled={!interactive}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
      >
        <Star
          className={`h-5 w-5 ${
            index < Math.floor(rating)
              ? 'text-galaxy-gold fill-current'
              : 'text-gray-400'
          }`}
        />
      </button>
    ));
  };

  const availableImages = product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/shop" className="hover:text-galaxy-gold">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-galaxy-gold">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div 
            className="aspect-square overflow-hidden rounded-xl bg-galaxy-purple/20 cursor-zoom-in relative"
            onClick={() => setIsImageZoomed(!isImageZoomed)}
          >
            <img
              src={availableImages[selectedImage]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isImageZoomed ? 'scale-150' : 'hover:scale-110'
              }`}
            />
            <div className="absolute top-3 right-3 bg-galaxy-dark/50 rounded-full p-2">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {availableImages.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {availableImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-galaxy-gold shadow-lg scale-105'
                      : 'border-transparent hover:border-galaxy-gold/50 hover:scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 flex-wrap">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-gray-400 ml-2">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <Badge variant="secondary">{product.brand}</Badge>
                  <Badge variant="outline" className="text-gray-400">
                    {product.category}
                  </Badge>
                </div>
              </div>
              
              <button
                onClick={handleWishlistToggle}
                className="p-3 rounded-full bg-galaxy-purple/20 hover:bg-galaxy-purple/40 transition-colors"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isInWishlist ? 'text-red-500 fill-current' : 'text-white'
                  }`}
                />
              </button>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center space-x-4 flex-wrap">
            <span className="text-4xl font-bold text-galaxy-gold">
              ${product.price.toFixed(2)}
            </span>
            
            {product.isTrending && (
              <Badge className="bg-red-500 text-white font-semibold animate-pulse">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </Badge>
            )}
            
            {product.isPremiumExclusive && (
              <Badge className="bg-galaxy-gold text-galaxy-dark font-semibold animate-glow">
                <Star className="w-4 h-4 mr-1" />
                Premium Exclusive
              </Badge>
            )}
            
            {!product.inStock && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Stock Information */}
          <div className="p-4 rounded-lg bg-galaxy-purple/10 border border-galaxy-purple-light/20">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Stock Status:</span>
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <>
                    <span className="text-green-400">{product.stock} available</span>
                    {product.stock <= 5 && (
                      <Badge className="bg-orange-500 text-xs">Low Stock</Badge>
                    )}
                  </>
                ) : (
                  <span className="text-red-400">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label className="text-white">Quantity:</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-400">
                Max: {product.stock}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || product.stock <= 0}
              className="w-full btn-primary text-lg py-6 disabled:opacity-50"
            >
              <Package className="w-5 h-5 mr-2" />
              {product.inStock && product.stock > 0 
                ? `Add to Cart - $${(product.price * quantity).toFixed(2)}` 
                : 'Out of Stock'
              }
            </Button>
          </div>

          {/* Features/Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-galaxy-purple/20 text-white border-galaxy-purple-light/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specifications" className="mb-16">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="write-review">Write Review</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications">
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white">Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-galaxy-purple-light/20">
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
                {/* Additional product info */}
                <div className="flex justify-between py-2 border-b border-galaxy-purple-light/20">
                  <span className="text-gray-400">Stock:</span>
                  <span className="text-white font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between py-2 border-b border-galaxy-purple-light/20">
                  <span className="text-gray-400">Brand:</span>
                  <span className="text-white font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-galaxy-purple-light/20">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white font-medium">{product.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-galaxy-purple-light/20 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{review.userName}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="write-review">
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white">Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white mb-4 block">Rating</Label>
                <div className="flex space-x-1">
                  {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="review-comment" className="text-white">Your Review</Label>
                <textarea
                  id="review-comment"
                  placeholder="Share your experience with this product..."
                  className="cosmic-input w-full h-32 mt-2 resize-none"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                />
              </div>
              
              <Button onClick={handleSubmitReview} className="btn-primary">
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            Related <span className="text-gradient">Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
