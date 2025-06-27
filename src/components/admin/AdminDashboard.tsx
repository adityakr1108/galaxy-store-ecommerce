
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { database, Order, Product, User } from '@/lib/database';
import { Users, Package, ShoppingCart, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SalesForecast from './SalesForecast';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as Order[]
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const users = database.getUsers();
    const products = database.getProducts();
    const orders = database.getOrders();
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const outOfStockProducts = products.filter(p => p.stock <= 0).length;
    const recentOrders = orders.slice(-5).reverse();
    
    setStats({
      totalUsers: users.length,
      premiumUsers: users.filter(u => u.isPremium).length,
      totalProducts: products.length,
      outOfStockProducts,
      totalOrders: orders.length,
      totalRevenue,
      recentOrders
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="galaxy-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="text-gray-400">Overview of your cosmic store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-400"
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          icon={TrendingUp}
          color="text-galaxy-gold"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="text-green-400"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStockProducts}
          icon={AlertCircle}
          color="text-red-400"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="text-purple-400"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="text-galaxy-gold"
        />
      </div>

      {/* Sales Forecast */}
      <SalesForecast />

      {/* Recent Orders */}
      <Card className="galaxy-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-400">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map(order => {
                const user = database.getUserById(order.userId);
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-galaxy-purple/10 rounded-lg">
                    <div>
                      <p className="text-white font-medium">#{order.id.slice(-6)}</p>
                      <p className="text-gray-400 text-sm">{user?.name || 'Unknown User'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-galaxy-gold font-bold">${order.total.toFixed(2)}</p>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'shipped' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
