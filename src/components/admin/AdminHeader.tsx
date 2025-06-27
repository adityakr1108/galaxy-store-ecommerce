
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('galaxy_store_admin_session');
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel.",
    });
    navigate('/admin-login');
  };

  return (
    <div className="flex justify-between items-center p-6 bg-card/50 backdrop-blur-sm border-b border-border/50">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage your e-commerce platform</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-theme-green/20 hover:bg-theme-green/30 border border-theme-green/30">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-theme-green text-black font-semibold">
                  <Shield className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-lg border border-border/50" align="end" forceMount>
            <div className="flex items-center space-x-2 p-3 border-b border-border/30">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-theme-green text-black text-sm font-semibold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@galaxy.com</p>
              </div>
            </div>
            
            <DropdownMenuItem className="text-white hover:bg-card/80 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="text-white hover:bg-card/80 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-red-400 hover:bg-red-500/20 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminHeader;
