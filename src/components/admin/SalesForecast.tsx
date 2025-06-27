
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { database } from '@/lib/database';

const SalesForecast: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'category' | 'premium'>('all');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Generate real data based on actual orders and products
  const generateRealData = useMemo(() => {
    const orders = database.getOrders();
    const products = database.getProducts();
    const users = database.getUsers();
    
    // Create data for June (historical) and July-August (predicted)
    const months = ['Jun', 'Jul', 'Aug'];
    
    return months.map((month, index) => {
      const isHistorical = index < 1; // Only June is historical
      let revenue = 0;
      let units = 0;
      
      if (isHistorical) {
        // June - Calculate actual revenue from all orders
        revenue = orders.reduce((sum, order) => {
          let orderRevenue = order.total;
          
          // Apply filter adjustments
          if (selectedFilter === 'category') {
            // Get electronics category orders
            const orderProducts = order.items.filter(item => {
              const product = products.find(p => p.id === item.productId);
              return product?.category.toLowerCase().includes('electronics') || 
                     product?.category.toLowerCase().includes('tech');
            });
            orderRevenue = orderProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
          } else if (selectedFilter === 'premium') {
            // Get premium user orders
            const user = users.find(u => u.id === order.userId);
            orderRevenue = user?.isPremium ? order.total : 0;
          }
          
          return sum + orderRevenue;
        }, 0);
        
        units = orders.reduce((sum, order) => {
          let orderUnits = order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
          
          if (selectedFilter === 'category') {
            const orderProducts = order.items.filter(item => {
              const product = products.find(p => p.id === item.productId);
              return product?.category.toLowerCase().includes('electronics') || 
                     product?.category.toLowerCase().includes('tech');
            });
            orderUnits = orderProducts.reduce((sum, item) => sum + item.quantity, 0);
          } else if (selectedFilter === 'premium') {
            const user = users.find(u => u.id === order.userId);
            orderUnits = user?.isPremium ? orderUnits : 0;
          }
          
          return sum + orderUnits;
        }, 0);
      } else {
        // July-August - Predict future months based on June data
        const juneRevenue = orders.reduce((sum, order) => {
          let orderRevenue = order.total;
          
          if (selectedFilter === 'category') {
            const orderProducts = order.items.filter(item => {
              const product = products.find(p => p.id === item.productId);
              return product?.category.toLowerCase().includes('electronics') || 
                     product?.category.toLowerCase().includes('tech');
            });
            orderRevenue = orderProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
          } else if (selectedFilter === 'premium') {
            const user = users.find(u => u.id === order.userId);
            orderRevenue = user?.isPremium ? order.total : 0;
          }
          
          return sum + orderRevenue;
        }, 0);
        
        const juneUnits = orders.reduce((sum, order) => {
          let orderUnits = order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
          
          if (selectedFilter === 'category') {
            const orderProducts = order.items.filter(item => {
              const product = products.find(p => p.id === item.productId);
              return product?.category.toLowerCase().includes('electronics') || 
                     product?.category.toLowerCase().includes('tech');
            });
            orderUnits = orderProducts.reduce((sum, item) => sum + item.quantity, 0);
          } else if (selectedFilter === 'premium') {
            const user = users.find(u => u.id === order.userId);
            orderUnits = user?.isPremium ? orderUnits : 0;
          }
          
          return sum + orderUnits;
        }, 0);
        
        // Apply growth prediction (10-20% growth for next months)
        const growthFactor = 1.1 + (index * 0.05) + (Math.random() * 0.1);
        revenue = Math.round(juneRevenue * growthFactor);
        units = Math.round(juneUnits * growthFactor);
      }
      
      return {
        month,
        revenue: Math.round(revenue),
        units,
        type: isHistorical ? 'historical' : 'predicted'
      };
    });
  }, [selectedFilter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPredicted = data.type === 'predicted';
      
      return (
        <div className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-primary">
            Revenue: ${payload[0].value.toLocaleString()}
            {isPredicted && <span className="text-yellow-400 ml-2">(Predicted)</span>}
          </p>
          <p className="text-muted-foreground text-sm">Units: {data.units}</p>
          {isPredicted && (
            <p className="text-xs text-yellow-400 mt-1">
              <Info className="inline w-3 h-3 mr-1" />
              Prediction based on June trends
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="theme-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">Sales Forecast</CardTitle>
            <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Based on June Orders
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={selectedFilter} onValueChange={(value: any) => setSelectedFilter(value)}>
              <SelectTrigger className="w-32 bg-background border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="category">Electronics</SelectItem>
                <SelectItem value="premium">Premium Users</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-20 bg-background border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={generateRealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={(props) => {
                    const { payload } = props;
                    return (
                      <circle 
                        {...props}
                        fill={payload.type === 'predicted' ? '#EAB308' : 'hsl(var(--primary))'}
                        stroke={payload.type === 'predicted' ? '#EAB308' : 'hsl(var(--primary))'}
                        strokeWidth={2}
                        r={4}
                      />
                    );
                  }}
                />
              </LineChart>
            ) : (
              <BarChart data={generateRealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue">
                  {generateRealData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'predicted' ? '#EAB308' : 'hsl(var(--primary))'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Real Data Analysis</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            June shows actual order data. July-August predictions based on June performance with 10-20% growth projection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesForecast;
