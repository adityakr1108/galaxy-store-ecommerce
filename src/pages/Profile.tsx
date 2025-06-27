
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Star, User, Mail, Calendar, Crown, Shield, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please sign in</h1>
          <p className="text-gray-400">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        email: editForm.email
      });
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeToPremium = () => {
    // Mock premium upgrade
    updateProfile({ isPremium: true });
    toast({
      title: "🎉 Welcome to Premium!",
      description: "You now have access to exclusive products and free shipping!",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          My <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <Card className="galaxy-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-galaxy-gradient rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-white text-xl">{user.name}</CardTitle>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {user.isPremium ? (
                  <Badge className="bg-galaxy-gold text-galaxy-dark font-semibold animate-glow">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium Member
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Star className="w-4 h-4 mr-1" />
                    Standard Member
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Account Verified</span>
              </div>
            </CardContent>
          </Card>

          {/* Premium Upgrade Card */}
          {!user.isPremium && (
            <Card className="galaxy-card mt-6 premium-glow">
              <CardHeader>
                <CardTitle className="text-galaxy-gold flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-galaxy-gold mr-2" />
                    Free shipping on all orders
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-galaxy-gold mr-2" />
                    Access to premium exclusive products
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-galaxy-gold mr-2" />
                    Early access to sales and new arrivals
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-galaxy-gold mr-2" />
                    Priority customer support
                  </li>
                </ul>
                <Button onClick={handleUpgradeToPremium} className="w-full btn-primary">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now - $9.99/month
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="galaxy-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-galaxy-gold hover:text-galaxy-gold-light"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          className="cosmic-input mt-2"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="cosmic-input mt-2"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>
                      <div className="flex space-x-4">
                        <Button onClick={handleSaveProfile} className="btn-primary">
                          Save Changes
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({ name: user.name, email: user.email });
                          }}
                          className="text-white hover:text-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-400">Full Name</Label>
                        <p className="text-white text-lg">{user.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Email Address</Label>
                        <p className="text-white text-lg">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Account Type</Label>
                        <div className="mt-2">
                          {user.isPremium ? (
                            <Badge className="bg-galaxy-gold text-galaxy-dark font-semibold">
                              <Crown className="w-4 h-4 mr-1" />
                              Premium Member
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Standard Member
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="galaxy-card">
                <CardHeader>
                  <CardTitle className="text-white">Shopping Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Order updates</span>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Promotional emails</span>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">New product alerts</span>
                        <Badge variant="outline" className="bg-galaxy-gold/20 text-galaxy-gold border-galaxy-gold/30">
                          Premium Only
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Favorite Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-galaxy-purple/20 text-white border-galaxy-purple-light/30">
                        Gaming
                      </Badge>
                      <Badge variant="outline" className="bg-galaxy-purple/20 text-white border-galaxy-purple-light/30">
                        Electronics
                      </Badge>
                      <Badge variant="outline" className="bg-galaxy-purple/20 text-white border-galaxy-purple-light/30">
                        Audio
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="galaxy-card">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Password</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Last changed: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <Button className="btn-secondary">
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Account Security</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Two-factor authentication</span>
                        <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                          Disabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Login notifications</span>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Enabled
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Account Actions</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="bg-galaxy-purple/20 border-galaxy-purple-light/30 text-white hover:bg-galaxy-purple/40">
                        Download Account Data
                      </Button>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
