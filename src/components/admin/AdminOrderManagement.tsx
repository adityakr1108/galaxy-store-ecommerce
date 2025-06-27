
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { database, Order, User } from '@/lib/database';
import { toast } from '@/hooks/use-toast';
import { Search, Eye, Edit } from 'lucide-react';

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const user = database.getUserById(order.userId);
        return (
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const loadOrders = () => {
    const allOrders = database.getOrders().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(allOrders);
    setFilteredOrders(allOrders);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    database.updateOrder(orderId, { 
      status: newStatus as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' 
    });
    toast({ title: "Order status updated successfully!" });
    loadOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Order <span className="text-gradient">Management</span>
        </h1>
        <p className="text-gray-400">Track and manage customer orders</p>
      </div>

      {/* Filters */}
      <Card className="galaxy-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cosmic-input pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="cosmic-input w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="galaxy-card">
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const user = database.getUserById(order.userId);
          return (
            <Card key={order.id} className="galaxy-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-white font-semibold">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="text-gray-400 text-sm space-y-1">
                      <p><span className="text-white">Customer:</span> {user?.name || 'Unknown'} ({user?.email})</p>
                      <p><span className="text-white">Items:</span> {order.items.length} products</p>
                      <p><span className="text-white">Total:</span> <span className="text-galaxy-gold">${order.total.toFixed(2)}</span></p>
                      <p><span className="text-white">Location:</span> {order.location}</p>
                      <p><span className="text-white">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:w-48">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="cosmic-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="galaxy-card">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="bg-galaxy-purple/20 text-white hover:bg-galaxy-purple/40"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t border-galaxy-purple/20">
                  <h4 className="text-white font-medium mb-2">Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="bg-galaxy-purple/10 rounded px-2 py-1 text-sm text-gray-300">
                        {item.product.name} × {item.quantity}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="bg-galaxy-purple/10 rounded px-2 py-1 text-sm text-gray-300">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="galaxy-card">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">No orders found</p>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="galaxy-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">
                  Order Details #{selectedOrder.id.slice(-8)}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="bg-galaxy-purple/10 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Customer Information</h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Name: {database.getUserById(selectedOrder.userId)?.name}</p>
                  <p>Email: {database.getUserById(selectedOrder.userId)?.email}</p>
                  <p>Shipping: {selectedOrder.shippingAddress}</p>
                  <p>Location: {selectedOrder.location}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-white font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-galaxy-purple/10 rounded-lg p-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">
                          ${item.product.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-galaxy-gold font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-galaxy-purple/10 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount:</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-galaxy-purple/20">
                    <span>Total:</span>
                    <span className="text-galaxy-gold">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
