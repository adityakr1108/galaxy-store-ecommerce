
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { database, Product } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, ChevronDown, Star } from 'lucide-react';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [showInStock, setShowInStock] = useState(false);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Get unique categories and brands
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  useEffect(() => {
    const allProducts = database.getProducts();
    setProducts(allProducts);
    
    // Initialize price range based on actual products
    if (allProducts.length > 0) {
      const maxPrice = Math.max(...allProducts.map(p => p.price));
      setPriceRange([0, Math.ceil(maxPrice)]);
    }

    // Load wishlist
    if (user) {
      const userWishlist = database.getWishlist(user.id);
      setWishlist(userWishlist.map(item => item.productId));
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Stock filter
    if (showInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(product => product.isPremiumExclusive);
    }

    // Trending filter
    if (showTrendingOnly) {
      filtered = filtered.filter(product => product.isTrending);
    }

    // Hide premium products for non-premium users
    if (!user?.isPremium) {
      filtered = filtered.filter(product => !product.isPremiumExclusive);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'stock':
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, minRating, showInStock, showPremiumOnly, showTrendingOnly, sortBy, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleAddToWishlist = (productId: string) => {
    if (!user) return;

    if (wishlist.includes(productId)) {
      database.removeFromWishlist(user.id, productId);
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      database.addToWishlist(user.id, productId);
      setWishlist(prev => [...prev, productId]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange([0, Math.max(...products.map(p => p.price))]);
    setMinRating(0);
    setShowInStock(false);
    setShowPremiumOnly(false);
    setShowTrendingOnly(false);
    setSortBy('name');
    setSearchParams({});
  };

  const handleInStockChange = (checked: boolean | "indeterminate") => {
    setShowInStock(checked === true);
  };

  const handlePremiumOnlyChange = (checked: boolean | "indeterminate") => {
    setShowPremiumOnly(checked === true);
  };

  const handleTrendingOnlyChange = (checked: boolean | "indeterminate") => {
    setShowTrendingOnly(checked === true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Cosmic <span className="text-gradient">Store</span>
        </h1>
        <p className="text-gray-400">
          Discover premium technology from across the galaxy
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <Card className="galaxy-card sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-galaxy-gold">
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label className="text-white mb-2 block">Search</Label>
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="cosmic-input flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="btn-primary">
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              {/* Category */}
              <div>
                <Label className="text-white mb-2 block">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="cosmic-input">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="galaxy-card border-galaxy-purple-light/20">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div>
                <Label className="text-white mb-2 block">Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="cosmic-input">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="galaxy-card border-galaxy-purple-light/20">
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-white mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={Math.max(...products.map(p => p.price))}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <Label className="text-white mb-2 block">Minimum Rating</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`p-1 rounded ${
                        minRating >= rating ? 'text-galaxy-gold' : 'text-gray-400'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showInStock}
                    onCheckedChange={handleInStockChange}
                  />
                  <Label htmlFor="in-stock" className="text-white">
                    In Stock Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending-only"
                    checked={showTrendingOnly}
                    onCheckedChange={handleTrendingOnlyChange}
                  />
                  <Label htmlFor="trending-only" className="text-white">
                   Trending Only
                  </Label>
                </div>

                {user?.isPremium && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="premium-only"
                      checked={showPremiumOnly}
                      onCheckedChange={handlePremiumOnlyChange}
                    />
                    <Label htmlFor="premium-only" className="text-galaxy-gold">
                      {/* <Star className="w-4 h-4 inline mr-1" /> */}
                      Premium Only
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <p className="text-gray-400">
                Showing {filteredProducts.length} of {products.filter(p => !p.isPremiumExclusive || user?.isPremium).length} products
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Label className="text-white">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="cosmic-input w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="galaxy-card border-galaxy-purple-light/20">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="stock">Stock Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={wishlist.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={resetFilters} className="btn-primary">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
