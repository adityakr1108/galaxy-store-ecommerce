
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket,
  Star
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  ];

  return (
    <div className="w-64 admin-sidebar min-h-screen border-r border-border/30">
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center space-x-2">
          <Star className="h-8 w-8 text-theme-green animate-glow" />
          <h2 className="text-xl font-bold text-gradient">Galaxy Admin</h2>
        </div>
      </div>
      
      <nav className="px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-theme-green/30 text-theme-green shadow-lg border border-theme-green/40' 
                  : 'text-gray-300 hover:bg-card/50 hover:text-white hover:shadow-md'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-glow' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
