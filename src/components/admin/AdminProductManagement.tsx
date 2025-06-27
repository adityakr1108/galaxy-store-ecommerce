import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { database, Product } from '@/lib/database';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package, Search, Download, Database } from 'lucide-react';

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    imageUrl: '',
    images: [''],
    stock: 50,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ['']
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const loadProducts = () => {
    const allProducts = database.getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      imageUrl: '',
      images: [''],
      stock: 50,
      isPremiumExclusive: false,
      isTrending: false,
      tags: ['']
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      tags: formData.tags.filter(tag => tag.trim() !== ''),
    };

    if (editingProduct) {
      database.updateProduct(editingProduct.id, productData);
      toast({ title: "Product updated successfully!" });
    } else {
      database.createProduct(productData);
      toast({ title: "Product created successfully!" });
    }

    resetForm();
    loadProducts();
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      imageUrl: product.imageUrl,
      images: product.images.length ? product.images : [''],
      stock: product.stock,
      isPremiumExclusive: product.isPremiumExclusive,
      isTrending: product.isTrending,
      tags: product.tags.length ? product.tags : ['']
    });
    setShowForm(true);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      database.deleteProduct(id);
      toast({ title: "Product deleted successfully!" });
      loadProducts();
    }
  };

  const bulkUpdateStock = () => {
    products.forEach(product => {
      database.updateProduct(product.id, { stock: 50, inStock: true });
    });
    toast({ title: "All product stock updated to 50!" });
    loadProducts();
  };

  const exportToCSV = () => {
    const csvData = database.exportToCSV('products');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Products exported to CSV successfully!" });
  };

  const syncToSQLite = () => {
    database.exportToSQLite();
    toast({ title: "Data synced to SQLite successfully!" });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Product <span className="text-gradient">Management</span>
          </h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={exportToCSV} variant="outline" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/40">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={syncToSQLite} variant="outline" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/40">
            <Database className="w-4 h-4 mr-2" />
            Sync SQLite
          </Button>
          <Button onClick={bulkUpdateStock} variant="outline" className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/40">
            <Package className="w-4 h-4 mr-2" />
            Bulk Update Stock
          </Button>
          <Button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="admin-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products by name, category, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Form */}
      {showForm && (
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {editingProduct ? (
                <><Edit className="w-5 h-5 mr-2" />Edit Product</>
              ) : (
                <><Plus className="w-5 h-5 mr-2" />Add New Product</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="modern-input"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="modern-input"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="modern-input">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="admin-card border-border/50">
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                      <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                      <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
                      <SelectItem value="Books & Stationery">Books & Stationery</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Wearables">Wearables</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Brand *</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="modern-input"
                    placeholder="Enter brand name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Stock Quantity *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="modern-input"
                    placeholder="50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Main Image URL *</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="modern-input"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Description *</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="modern-input w-full h-24 resize-none"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Product Flags */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.isPremiumExclusive}
                    onCheckedChange={(checked) => setFormData({...formData, isPremiumExclusive: checked})}
                  />
                  <Label className="text-white font-medium">Premium Exclusive</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.isTrending}
                    onCheckedChange={(checked) => setFormData({...formData, isTrending: checked})}
                  />
                  <Label className="text-white font-medium">Trending Product</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/40">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="admin-card hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 space-y-4">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {product.isPremiumExclusive && (
                    <Badge className="bg-premium-gold text-black text-xs">Premium</Badge>
                  )}
                  {product.isTrending && (
                    <Badge className="bg-red-500 text-white text-xs">Trending</Badge>
                  )}
                  {product.stock <= 0 && (
                    <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                  )}
                  {product.stock > 0 && product.stock <= 10 && (
                    <Badge className="bg-orange-500 text-white text-xs">Low Stock</Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Pricing and Stock */}
              <div className="flex justify-between items-center">
                <span className="text-theme-green font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
                <div className="text-right">
                  <div className="text-gray-400 text-xs">Stock</div>
                  <div className={`font-semibold ${product.stock <= 10 ? 'text-orange-400' : 'text-gray-300'}`}>
                    {product.stock}
                  </div>
                </div>
              </div>

              {/* Category and Brand */}
              <div className="flex justify-between items-center text-xs">
                <Badge variant="secondary" className="bg-card text-gray-300">
                  {product.category}
                </Badge>
                <span className="text-gray-500">{product.brand}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editProduct(product)}
                  className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border-blue-500/40"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/40 border-red-500/40"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="admin-card">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminProductManagement;
