
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { database, Order } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Calendar, DollarSign, Truck, CheckCircle, Clock } from 'lucide-react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const userOrders = database.getOrdersByUserId(user.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please sign in</h1>
          <p className="text-gray-400">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-8xl mb-6">📦</div>
          <h1 className="text-3xl font-bold text-white mb-4">No orders yet</h1>
          <p className="text-gray-400 mb-8">
            You haven't placed any orders yet. Start exploring our cosmic collection!
          </p>
          <Button asChild className="btn-primary">
            <Link to="/shop">
              <Package className="w-4 h-4 mr-2" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          My <span className="text-gradient">Orders</span>
        </h1>
        <p className="text-gray-400">
          Track and manage your cosmic deliveries
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="galaxy-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order #{order.id}
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2 capitalize">{order.status}</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Items ({order.items.length})</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-4 p-3 rounded-lg bg-galaxy-purple/10">
                        <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover hover:scale-105 transition-transform"
                          />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.product.id}`}>
                            <h5 className="text-white font-medium hover:text-galaxy-gold transition-colors line-clamp-1">
                              {item.product.name}
                            </h5>
                          </Link>
                          <p className="text-gray-400 text-sm">
                            Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-galaxy-gold font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 pt-4 border-t border-galaxy-purple-light/20">
                  <div className="text-sm text-gray-400">
                    <p>Shipping to: {order.shippingAddress}</p>
                    {order.status === 'shipped' && (
                      <p className="text-blue-400 mt-1">
                        <Truck className="w-4 h-4 inline mr-1" />
                        Estimated delivery: 2-3 business days
                      </p>
                    )}
                    {order.status === 'delivered' && (
                      <p className="text-green-400 mt-1">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Delivered successfully
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40">
                        Leave Review
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
