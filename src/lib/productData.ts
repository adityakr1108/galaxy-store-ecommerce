
import { Product } from './database';

export const productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'inStock' | 'specifications'>[] = [
  // Electronics
  {
    name: "MacBook Pro 16-inch",
    description: "Professional laptop with M2 Pro chip, 16GB RAM, and 512GB SSD. Perfect for developers and content creators.",
    price: 2499.99,
    category: "Electronics",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop"
    ],
    stock: 45,
    isPremiumExclusive: true,
    isTrending: true,
    tags: ["laptop", "professional", "apple", "macbook"]
  },
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.",
    price: 1199.99,
    category: "Electronics",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop"],
    stock: 78,
    isPremiumExclusive: false,
    isTrending: true,
    tags: ["smartphone", "iphone", "mobile", "apple"]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and 1TB storage.",
    price: 1399.99,
    category: "Electronics",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop"],
    stock: 62,
    isPremiumExclusive: true,
    isTrending: false,
    tags: ["smartphone", "android", "samsung", "premium"]
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-portable laptop with Intel Core i7, 16GB RAM, and stunning InfinityEdge display.",
    price: 1299.99,
    category: "Electronics",
    brand: "Dell",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop"],
    stock: 34,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["laptop", "ultrabook", "dell", "portable"]
  },
  {
    name: "iPad Pro 12.9-inch",
    description: "Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.",
    price: 1099.99,
    category: "Electronics",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop"],
    stock: 41,
    isPremiumExclusive: true,
    isTrending: false,
    tags: ["tablet", "ipad", "apple", "creative"]
  },

  // Gaming
  {
    name: "PlayStation 5",
    description: "Next-gen gaming console with 4K gaming, ray tracing, and ultra-fast SSD.",
    price: 499.99,
    category: "Gaming",
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop"],
    stock: 23,
    isPremiumExclusive: false,
    isTrending: true,
    tags: ["console", "gaming", "playstation", "sony"]
  },
  {
    name: "Xbox Series X",
    description: "Microsoft's most powerful console with 4K gaming and Quick Resume technology.",
    price: 499.99,
    category: "Gaming",
    brand: "Microsoft",
    imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop"],
    stock: 18,
    isPremiumExclusive: false,
    isTrending: true,
    tags: ["console", "gaming", "xbox", "microsoft"]
  },
  {
    name: "Nintendo Switch OLED",
    description: "Portable gaming console with vibrant OLED screen and versatile play modes.",
    price: 349.99,
    category: "Gaming",
    brand: "Nintendo",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
    stock: 67,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["console", "portable", "nintendo", "switch"]
  },
  {
    name: "Razer DeathAdder V3",
    description: "Professional gaming mouse with 30,000 DPI sensor and ergonomic design.",
    price: 89.99,
    category: "Gaming",
    brand: "Razer",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop"],
    stock: 94,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["mouse", "gaming", "razer", "peripheral"]
  },
  {
    name: "SteelSeries Arctis 7P",
    description: "Wireless gaming headset with lossless 2.4GHz connection and 24-hour battery.",
    price: 149.99,
    category: "Gaming",
    brand: "SteelSeries",
    imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop"],
    stock: 56,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["headset", "gaming", "wireless", "steelseries"]
  },

  // Fashion
  {
    name: "Nike Air Jordan 1 Retro",
    description: "Iconic basketball sneakers with premium leather and classic colorway.",
    price: 170.00,
    category: "Fashion",
    brand: "Nike",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"],
    stock: 89,
    isPremiumExclusive: false,
    isTrending: true,
    tags: ["sneakers", "basketball", "nike", "jordan"]
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans with authentic fit and premium denim construction.",
    price: 89.50,
    category: "Fashion",
    brand: "Levi's",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop"],
    stock: 73,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["jeans", "denim", "levis", "classic"]
  },
  {
    name: "Patagonia Better Sweater",
    description: "Eco-friendly fleece jacket made from recycled polyester with classic fit.",
    price: 99.00,
    category: "Fashion",
    brand: "Patagonia",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop"],
    stock: 45,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["fleece", "jacket", "patagonia", "eco-friendly"]
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Timeless aviator sunglasses with gold frame and green crystal lenses.",
    price: 154.00,
    category: "Fashion",
    brand: "Ray-Ban",
    imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=600&fit=crop"],
    stock: 67,
    isPremiumExclusive: true,
    isTrending: false,
    tags: ["sunglasses", "aviator", "rayban", "classic"]
  },

  // Books & Stationery
  {
    name: "Moleskine Classic Notebook",
    description: "Premium hardcover notebook with dotted pages and elastic closure.",
    price: 22.95,
    category: "Books & Stationery",
    brand: "Moleskine",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop"],
    stock: 156,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["notebook", "journal", "moleskine", "writing"]
  },
  {
    name: "Kindle Paperwhite",
    description: "Waterproof e-reader with 6.8-inch display and adjustable warm light.",
    price: 139.99,
    category: "Books & Stationery",
    brand: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop"],
    stock: 82,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["ereader", "kindle", "books", "amazon"]
  },
  {
    name: "Parker Jotter Ballpoint Pen",
    description: "Classic ballpoint pen with stainless steel finish and reliable ink flow.",
    price: 12.00,
    category: "Books & Stationery",
    brand: "Parker",
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&h=600&fit=crop"],
    stock: 234,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["pen", "writing", "parker", "office"]
  },

  // Home & Kitchen
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-functional pressure cooker with 7 cooking functions and smart programming.",
    price: 79.95,
    category: "Home & Kitchen",
    brand: "Instant Pot",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"],
    stock: 47,
    isPremiumExclusive: false,
    isTrending: true,
    tags: ["kitchen", "pressure-cooker", "instant-pot", "cooking"]
  },
  {
    name: "Dyson V15 Detect",
    description: "Cordless vacuum with laser dust detection and powerful suction technology.",
    price: 749.99,
    category: "Home & Kitchen",
    brand: "Dyson",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"],
    stock: 28,
    isPremiumExclusive: true,
    isTrending: false,
    tags: ["vacuum", "cordless", "dyson", "cleaning"]
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Professional 5-quart stand mixer with 10 speeds and multiple attachments.",
    price: 379.99,
    category: "Home & Kitchen",
    brand: "KitchenAid",
    imageUrl: "https://images.unsplash.com/photo-1556909918-f9e25c989e0f?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1556909918-f9e25c989e0f?w=800&h=600&fit=crop"],
    stock: 33,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["mixer", "baking", "kitchenaid", "appliance"]
  },

  // Audio
  {
    name: "Sony WH-1000XM5",
    description: "Premium noise-canceling headphones with 30-hour battery and crystal-clear calls.",
    price: 399.99,
    category: "Audio",
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop"],
    stock: 54,
    isPremiumExclusive: true,
    isTrending: true,
    tags: ["headphones", "noise-canceling", "sony", "premium"]
  },
  {
    name: "Apple AirPods Pro 2",
    description: "Wireless earbuds with active noise cancellation and spatial audio.",
    price: 249.99,
    category: "Audio",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=600&fit=crop"],
    stock: 91,
    isPremiumExclusive: false,
    isTrending: true,
    tags: ["earbuds", "wireless", "apple", "airpods"]
  },
  {
    name: "Bose SoundLink Revolve+",
    description: "Portable Bluetooth speaker with 360-degree sound and 16-hour battery.",
    price: 329.95,
    category: "Audio",
    brand: "Bose",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop"],
    stock: 42,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["speaker", "bluetooth", "portable", "bose"]
  },

  // Wearables
  {
    name: "Apple Watch Series 9",
    description: "Advanced smartwatch with health monitoring, GPS, and all-day battery life.",
    price: 429.99,
    category: "Wearables",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=600&fit=crop"],
    stock: 65,
    isPremiumExclusive: true,
    isTrending: true,
    tags: ["smartwatch", "fitness", "apple", "health"]
  },
  {
    name: "Fitbit Charge 5",
    description: "Advanced fitness tracker with built-in GPS and stress management tools.",
    price: 179.95,
    category: "Wearables",
    brand: "Fitbit",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop"],
    stock: 78,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["fitness-tracker", "health", "fitbit", "wearable"]
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "Smart fitness companion with comprehensive health tracking and long battery life.",
    price: 329.99,
    category: "Wearables",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop"],
    stock: 51,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["smartwatch", "samsung", "android", "fitness"]
  },

  // Sports & Fitness
  {
    name: "Peloton Bike+",
    description: "Premium indoor cycling bike with rotating HD touchscreen and live classes.",
    price: 2495.00,
    category: "Sports & Fitness",
    brand: "Peloton",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"],
    stock: 12,
    isPremiumExclusive: true,
    isTrending: false,
    tags: ["exercise-bike", "fitness", "peloton", "premium"]
  },
  {
    name: "Bowflex SelectTech Dumbbells",
    description: "Adjustable dumbbells with weight range from 5 to 52.5 lbs each.",
    price: 549.00,
    category: "Sports & Fitness",
    brand: "Bowflex",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"],
    stock: 26,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["dumbbells", "weights", "bowflex", "home-gym"]
  },
  {
    name: "Nike Training Mat",
    description: "Premium yoga and exercise mat with non-slip surface and carrying strap.",
    price: 35.00,
    category: "Sports & Fitness",
    brand: "Nike",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop"],
    stock: 148,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["yoga-mat", "exercise", "nike", "fitness"]
  },

  // Beauty & Personal Care
  {
    name: "Dyson Airwrap Multi-Styler",
    description: "Hair styling tool that uses air to curl, wave, smooth, and dry without extreme heat.",
    price: 599.99,
    category: "Beauty & Personal Care",
    brand: "Dyson",
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&h=600&fit=crop"],
    stock: 19,
    isPremiumExclusive: true,
    isTrending: true,
    tags: ["hair-styling", "beauty", "dyson", "premium"]
  },
  {
    name: "Olaplex Hair Perfector No. 3",
    description: "At-home hair treatment that reduces breakage and strengthens hair bonds.",
    price: 28.00,
    category: "Beauty & Personal Care",
    brand: "Olaplex",
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop"],
    stock: 97,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["hair-care", "treatment", "olaplex", "beauty"]
  },
  {
    name: "Philips Sonicare DiamondClean",
    description: "Electric toothbrush with 5 cleaning modes and premium charging glass.",
    price: 219.99,
    category: "Beauty & Personal Care",
    brand: "Philips",
    imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&h=600&fit=crop"],
    stock: 58,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["toothbrush", "dental-care", "philips", "electric"]
  },

  // Furniture
  {
    name: "Herman Miller Aeron Chair",
    description: "Ergonomic office chair with breathable mesh and adjustable lumbar support.",
    price: 1395.00,
    category: "Furniture",
    brand: "Herman Miller",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"],
    stock: 15,
    isPremiumExclusive: true,
    isTrending: false,
    tags: ["office-chair", "ergonomic", "herman-miller", "furniture"]
  },
  {
    name: "IKEA Karlby Countertop",
    description: "Solid wood countertop perfect for kitchen islands or desk setups.",
    price: 179.00,
    category: "Furniture",
    brand: "IKEA",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"],
    stock: 43,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["countertop", "desk", "ikea", "furniture"]
  },
  {
    name: "West Elm Mid-Century Sofa",
    description: "Modern 3-seater sofa with velvet upholstery and solid wood legs.",
    price: 1299.00,
    category: "Furniture",
    brand: "West Elm",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"],
    stock: 21,
    isPremiumExclusive: false,
    isTrending: false,
    tags: ["sofa", "mid-century", "west-elm", "furniture"]
  }
];
