
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { database } from '@/lib/database';
import { toast } from '@/hooks/use-toast';
import { Package, Plus, Minus, Trash2, ShoppingBag, Star, Truck, Tag, MapPin } from 'lucide-react';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [shippingInfo, setShippingInfo] = useState<any>(null);

  const shippingLocations = database.getShippingLocations();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      // Check if enough stock is available
      const isInStock = database.isProductInStock(productId, newQuantity);
      if (!isInStock) {
        toast({
          title: "Insufficient stock",
          description: "Not enough items in stock for the requested quantity.",
          variant: "destructive",
        });
        return;
      }
      updateQuantity(productId, newQuantity);
    }
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    const shipping = database.getShippingByLocation(location);
    setShippingInfo(shipping);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter coupon code",
        description: "Please enter a coupon code to apply.",
        variant: "destructive",
      });
      return;
    }

    if (appliedCoupon) {
      toast({
        title: "Coupon already applied",
        description: "Please remove the current coupon before applying a new one.",
        variant: "destructive",
      });
      return;
    }

    const coupon = database.getCouponByCode(couponCode.toUpperCase());
    if (!coupon || !coupon.isActive) {
      toast({
        title: "Invalid coupon",
        description: "This coupon code is not valid or has expired.",
        variant: "destructive",
      });
      return;
    }

    // Check if coupon is expired
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      toast({
        title: "Expired coupon",
        description: "This coupon code has expired.",
        variant: "destructive",
      });
      return;
    }

    setAppliedCoupon(coupon);
    toast({
      title: "Coupon applied!",
      description: `${coupon.description} has been applied to your order.`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order.",
    });
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = getTotalPrice();
    switch (appliedCoupon.type) {
      case 'percentage':
        return (subtotal * appliedCoupon.value) / 100;
      case 'fixed':
        return Math.min(appliedCoupon.value, subtotal);
      default:
        return 0;
    }
  };

  const calculateShipping = () => {
    if (appliedCoupon?.type === 'shipping') return 0;
    if (!shippingInfo) return user?.isPremium ? 0 : 50;
    return user?.isPremium ? 0 : shippingInfo.cost;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your order.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products to your cart first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Select location",
        description: "Please select your delivery location.",
        variant: "destructive",
      });
      return;
    }

    // Check stock availability and update stock
    const stockIssues = [];
    for (const item of items) {
      const isInStock = database.isProductInStock(item.productId, item.quantity);
      if (!isInStock) {
        stockIssues.push(item.product.name);
      }
    }

    if (stockIssues.length > 0) {
      toast({
        title: "Stock unavailable",
        description: `The following items are out of stock: ${stockIssues.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const subtotal = getTotalPrice();
      const discount = calculateDiscount();
      const shippingCost = calculateShipping();
      const tax = (subtotal - discount) * 0.08;
      const total = subtotal - discount + shippingCost + tax;

      // Update stock for each item
      for (const item of items) {
        database.updateProductStock(item.productId, item.quantity);
      }

      // Create order
      const order = database.createOrder({
        userId: user.id,
        items: items,
        subtotal: subtotal,
        discount: discount,
        shippingCost: shippingCost,
        total: total,
        couponCode: appliedCoupon?.code,
        status: 'pending',
        shippingAddress: 'Default Address',
        location: selectedLocation,
        estimatedDelivery: shippingInfo ? `${shippingInfo.days} days` : '2-3 days'
      });

      // Clear cart
      clearCart();
      setAppliedCoupon(null);
      setCouponCode('');
      setSelectedLocation('');
      setShippingInfo(null);

      // Show success message with animation
      toast({
        title: "🎉 Order placed successfully!",
        description: `Order #${order.id.slice(-6)} has been created. Estimated delivery: ${order.estimatedDelivery}`,
      });

      // Simulate order processing delay
      setTimeout(() => {
        toast({
          title: "Order confirmed!",
          description: "Your cosmic order is being prepared for intergalactic shipping.",
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added any cosmic items to your cart yet.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/shop">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const discount = calculateDiscount();
  const shipping = calculateShipping();
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Shopping <span className="text-gradient">Cart</span>
        </h1>
        <p className="text-gray-400">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cosmic cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="galaxy-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-galaxy-purple/20">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="text-lg font-semibold text-white hover:text-galaxy-gold transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.product.brand}
                          </Badge>
                          {item.product.isPremiumExclusive && (
                            <Badge className="bg-galaxy-gold text-galaxy-dark text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {item.product.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Stock: {item.product.stock} available
                        </p>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-white text-sm">Qty:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="w-8 h-8 p-0 bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-white font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 p-0 bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40 disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          ${item.product.price.toFixed(2)} each
                        </p>
                        <p className="text-lg font-bold text-galaxy-gold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="galaxy-card sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon Section */}
              <div className="p-3 rounded-lg bg-galaxy-purple/10 border border-galaxy-purple-light/20">
                <Label className="text-white mb-2 block">Coupon Code</Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-green-500/20 rounded">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">{appliedCoupon.code}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="cosmic-input flex-1"
                    />
                    <Button
                      onClick={applyCoupon}
                      variant="outline"
                      size="sm"
                      className="bg-galaxy-purple/20 text-white hover:bg-galaxy-purple/40"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Try: SAVE10, FLAT100, FREESHIP
                </p>
              </div>

              {/* Shipping Location */}
              <div className="p-3 rounded-lg bg-galaxy-purple/10 border border-galaxy-purple-light/20">
                <Label className="text-white mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Delivery Location
                </Label>
                <Select value={selectedLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger className="cosmic-input">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent className="galaxy-card border-galaxy-purple-light/20">
                    {shippingLocations.map((location) => (
                      <SelectItem key={location.name} value={location.name}>
                        {location.name} - ₹{location.cost}, {location.days} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {shippingInfo && (
                  <div className="mt-2 p-2 bg-galaxy-gold/10 rounded text-sm">
                    <p className="text-galaxy-gold">
                      <Truck className="w-4 h-4 inline mr-1" />
                      Delivery in {shippingInfo.days} days - ₹{shippingInfo.cost}
                    </p>
                  </div>
                )}
              </div>

              {/* Premium Benefits */}
              {user?.isPremium && (
                <div className="p-3 rounded-lg bg-galaxy-gold/10 border border-galaxy-gold/20">
                  <div className="flex items-center space-x-2 text-galaxy-gold">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-semibold">Premium Benefits</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300 mt-1">
                    <Truck className="w-3 h-3" />
                    <span>Free shipping included</span>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-galaxy-purple-light/20 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-galaxy-gold' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-galaxy-purple-light/20 pt-4">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-galaxy-gold">${total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-400 mt-1">
                    You saved ${discount.toFixed(2)}!
                  </p>
                )}
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || !selectedLocation}
                className="w-full btn-primary text-lg py-6"
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    Checkout - ${total.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-gray-400">
                <p>Secure checkout powered by Galaxy Security</p>
                <p className="mt-1">🔒 Your payment information is encrypted</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
