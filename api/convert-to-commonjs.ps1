$files = @(
    "models/Product.js",
    "models/Order.js", 
    "models/Coupon.js",
    "models/Cart.js",
    "models/Wishlist.js",
    "models/ShippingLocation.js",
    "models/PromoBanner.js",
    "middleware/auth.js",
    "routes/products.js",
    "routes/cart.js", 
    "routes/orders.js",
    "routes/users.js",
    "routes/coupons.js",
    "routes/wishlist.js",
    "routes/admin.js"
)

foreach ($file in $files) {
    $path = "c:/Users/AdityaKumarMAQSoftwa/Desktop/capstone/E-Commerce/api/$file"
    Write-Host "Converting $file..."
    
    # Read the file
    $content = Get-Content $path -Raw
    
    # Convert ES6 imports to CommonJS requires
    $content = $content -replace "import\s+(\w+)\s+from\s+'([^']+)';", 'const $1 = require(''$2'');'
    $content = $content -replace "import\s+\{\s*([^}]+)\s*\}\s+from\s+'([^']+)';", 'const { $1 } = require(''$2'');'
    
    # Convert ES6 export to CommonJS module.exports
    $content = $content -replace "export default (\w+);", 'module.exports = $1;'
    $content = $content -replace "export default ([^;]+);", 'module.exports = $1;'
    
    # Write the file back
    Set-Content $path $content -NoNewline
    
    Write-Host "✅ Converted $file"
}

Write-Host "All files converted to CommonJS!"