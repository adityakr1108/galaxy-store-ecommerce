
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { database, Coupon } from '@/lib/database';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Ticket } from 'lucide-react';

const AdminCouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'shipping',
    value: 0,
    description: '',
    isActive: true,
    expiresAt: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    const allCoupons = database.getCoupons();
    setCoupons(allCoupons);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      description: '',
      isActive: true,
      expiresAt: ''
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.description || formData.value < 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if coupon code already exists (only for new coupons)
    if (!editingCoupon && database.getCouponByCode(formData.code)) {
      toast({
        title: "Error",
        description: "Coupon code already exists",
        variant: "destructive",
      });
      return;
    }

    const couponData: Coupon = {
      ...formData,
      expiresAt: formData.expiresAt || undefined
    };

    if (editingCoupon) {
      // For editing, we need to update the existing coupon
      const allCoupons = database.getCoupons();
      const updatedCoupons = allCoupons.map(c => 
        c.code === editingCoupon.code ? couponData : c
      );
      database['setCouponsData'](updatedCoupons);
      toast({ title: "Coupon updated successfully!" });
    } else {
      database.createCoupon(couponData);
      toast({ title: "Coupon created successfully!" });
    }

    resetForm();
    loadCoupons();
  };

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt || ''
    });
    setShowForm(true);
  };

  const deleteCoupon = (code: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      const allCoupons = database.getCoupons();
      const updatedCoupons = allCoupons.filter(c => c.code !== code);
      database['setCouponsData'](updatedCoupons);
      toast({ title: "Coupon deleted successfully!" });
      loadCoupons();
    }
  };

  const toggleCouponStatus = (code: string) => {
    const allCoupons = database.getCoupons();
    const updatedCoupons = allCoupons.map(c => 
      c.code === code ? { ...c, isActive: !c.isActive } : c
    );
    database['setCouponsData'](updatedCoupons);
    toast({ title: "Coupon status updated!" });
    loadCoupons();
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Coupon <span className="text-gradient">Management</span>
          </h1>
          <p className="text-gray-400">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Coupon Form */}
      {showForm && (
        <Card className="galaxy-card">
          <CardHeader>
            <CardTitle className="text-white">
              {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Coupon Code *</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="cosmic-input"
                    placeholder="SAVE10"
                    required
                    disabled={!!editingCoupon}
                  />
                </div>
                <div>
                  <Label className="text-white">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="cosmic-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="galaxy-card">
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">
                    Value * {formData.type === 'percentage' ? '(%)' : formData.type === 'fixed' ? '($)' : ''}
                  </Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                    className="cosmic-input"
                    min="0"
                    max={formData.type === 'percentage' ? 100 : undefined}
                    required
                    disabled={formData.type === 'shipping'}
                  />
                </div>
                <div>
                  <Label className="text-white">Expires At (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    className="cosmic-input"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Description *</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="cosmic-input"
                  placeholder="10% off on your order"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label className="text-white">Active</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="btn-primary">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <Card key={coupon.code} className="galaxy-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-galaxy-gold" />
                  <h3 className="text-white font-bold text-lg">{coupon.code}</h3>
                </div>
                <div className="flex space-x-1">
                  {coupon.isActive ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-500">Inactive</Badge>
                  )}
                  {isExpired(coupon) && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </div>
              </div>

              <p className="text-gray-400 mb-4">{coupon.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{coupon.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Value:</span>
                  <span className="text-galaxy-gold font-bold">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : 
                     coupon.type === 'fixed' ? `$${coupon.value}` : 
                     'Free Shipping'}
                  </span>
                </div>
                {coupon.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-white">
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editCoupon(coupon)}
                  className="flex-1 bg-galaxy-purple/20 text-white hover:bg-galaxy-purple/40"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleCouponStatus(coupon.code)}
                  className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/40"
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteCoupon(coupon.code)}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/40"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coupons.length === 0 && (
        <Card className="galaxy-card">
          <CardContent className="p-8 text-center">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No coupons created yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCouponManagement;
