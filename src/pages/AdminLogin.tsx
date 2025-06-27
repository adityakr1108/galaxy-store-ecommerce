
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Shield, Lock, Mail } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate admin credentials
      if (credentials.email === 'admin@galaxy.com' && credentials.password === 'admin123') {
        // Set admin session
        localStorage.setItem('galaxy_store_admin_session', JSON.stringify({
          isAdmin: true,
          email: credentials.email,
          loginTime: new Date().toISOString()
        }));

        toast({
          title: "Welcome, Admin!",
          description: "You have successfully logged into the admin panel.",
        });

        navigate('/admin');
      } else {
        toast({
          title: "Invalid admin credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-galaxy-gradient flex items-center justify-center p-4">
      <Card className="galaxy-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-galaxy-purple/30 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-galaxy-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            Admin Login
          </CardTitle>
          <p className="text-gray-300">Access the Galaxy Store Admin Panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-white">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@galaxy.com"
                  className="cosmic-input pl-10"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-white">Admin Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  className="cosmic-input pl-10"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              Back to Store
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
