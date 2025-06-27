
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Star, Search, User, Home, Package, Bell, Star as StarIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = getTotalItems();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-galaxy-dark/90 backdrop-blur-md border-b border-galaxy-purple-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <Star className="h-8 w-8 text-galaxy-gold animate-twinkle" />
              <span className="text-xl font-bold text-gradient">Galaxy Store</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-galaxy-gold transition-colors">
                <Home className="inline-block w-4 h-4 mr-2" />
                Home
              </Link>
              <Link to="/shop" className="text-white hover:text-galaxy-gold transition-colors">
                <Package className="inline-block w-4 h-4 mr-2" />
                Shop
              </Link>
              <Link to="/about" className="text-white hover:text-galaxy-gold transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white hover:text-galaxy-gold transition-colors">
                Contact
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="cosmic-input pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="text-white hover:text-galaxy-gold hover:bg-galaxy-purple/20">
                  <Package className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-galaxy-gold text-galaxy-dark text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:text-galaxy-gold hover:bg-galaxy-purple/20">
                      <User className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">{user?.name}</span>
                      {user?.isPremium && (
                        <StarIcon className="h-4 w-4 ml-1 text-galaxy-gold animate-twinkle" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="galaxy-card border-galaxy-purple-light/20">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="text-white hover:text-galaxy-gold">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="text-white hover:text-galaxy-gold">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="text-white hover:text-galaxy-gold">
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-galaxy-gold">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="btn-primary"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-galaxy-purple-light/20">
              <div className="space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="cosmic-input pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="block text-white hover:text-galaxy-gold transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="inline-block w-4 h-4 mr-2" />
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    className="block text-white hover:text-galaxy-gold transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="inline-block w-4 h-4 mr-2" />
                    Shop
                  </Link>
                  <Link
                    to="/about"
                    className="block text-white hover:text-galaxy-gold transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block text-white hover:text-galaxy-gold transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
