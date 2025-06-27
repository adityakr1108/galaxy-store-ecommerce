
import { database } from './database';
import { productData } from './productData';

export const initializeProducts = () => {
  const existingProducts = database.getProducts();
  
  // Only add products if we have fewer than 30 products
  if (existingProducts.length < 30) {
    console.log('Initializing products database with diverse product catalog...');
    
    productData.forEach(product => {
      database.createProduct(product);
    });
    
    console.log(`✅ Added ${productData.length} products to the database`);
  }
};
