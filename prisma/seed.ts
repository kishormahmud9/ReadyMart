import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Clear existing data (in correct order to avoid foreign key constraints)
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.review.deleteMany()
    await prisma.wishlist.deleteMany()
    await prisma.productAttribute.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()
    await prisma.address.deleteMany()
    await prisma.banner.deleteMany()
    await prisma.coupon.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.user.deleteMany()
    console.log('🗑️  Cleared existing data')

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@readymart.com',
            password: hashedPassword,
            name: 'Admin User',
            role: Role.ADMIN,
            emailVerified: new Date(),
        },
    })
    console.log('✅ Admin user created:', adminUser.email)

    // Create test user
    const testUserPassword = await bcrypt.hash('Test123!', 10)
    const testUser = await prisma.user.create({
        data: {
            email: 'user@test.com',
            password: testUserPassword,
            name: 'Test User',
            role: Role.USER,
            emailVerified: new Date(),
        },
    })
    console.log('✅ Test user created:', testUser.email)

    // Create Categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Men',
                slug: 'men',
                description: 'Fashion and accessories for men',
                image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Women',
                slug: 'women',
                description: 'Fashion and accessories for women',
                image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Kids',
                slug: 'kids',
                description: 'Clothing and accessories for children',
                image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Accessories',
                slug: 'accessories',
                description: 'Bags, watches, jewelry and more',
                image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Latest gadgets and electronics',
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Sports',
                slug: 'sports',
                description: 'Sports equipment and activewear',
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Home & Living',
                slug: 'home-living',
                description: 'Home decor and living essentials',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Beauty',
                slug: 'beauty',
                description: 'Beauty and personal care products',
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
            },
        }),
    ])
    console.log(`✅ Created ${categories.length} categories`)

    // Create Brands
    const brands = await Promise.all([
        prisma.brand.create({ data: { name: 'Nike', slug: 'nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' } }),
        prisma.brand.create({ data: { name: 'Adidas', slug: 'adidas', logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200' } }),
        prisma.brand.create({ data: { name: 'Zara', slug: 'zara' } }),
        prisma.brand.create({ data: { name: 'H&M', slug: 'hm' } }),
        prisma.brand.create({ data: { name: 'Apple', slug: 'apple' } }),
        prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } }),
        prisma.brand.create({ data: { name: 'Puma', slug: 'puma' } }),
        prisma.brand.create({ data: { name: 'Levi\'s', slug: 'levis' } }),
        prisma.brand.create({ data: { name: 'Ray-Ban', slug: 'rayban' } }),
        prisma.brand.create({ data: { name: 'Fossil', slug: 'fossil' } }),
        prisma.brand.create({ data: { name: 'Logitech', slug: 'logitech' } }),
        prisma.brand.create({ data: { name: 'Generic', slug: 'generic' } }),
    ])
    console.log(`✅ Created ${brands.length} brands`)

    // Helper function to get category and brand by slug
    const getCat = (slug: string) => categories.find(c => c.slug === slug)!
    const getBrand = (slug: string) => brands.find(b => b.slug === slug)!

    // Create Products
    const productData = [
        // Men's Fashion
        {
            name: 'Classic Denim Jacket',
            slug: 'classic-denim-jacket',
            description: 'Timeless denim jacket with classic fit. Perfect for casual outings and layering.',
            price: 79.99,
            salePrice: 59.99,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
            categoryId: getCat('men').id,
            brandId: getBrand('levis').id,
            isFeatured: true,
            attributes: [
                { name: 'Size', value: 'M' },
                { name: 'Size', value: 'L' },
                { name: 'Size', value: 'XL' },
                { name: 'Color', value: 'Blue' },
            ],
        },
        {
            name: 'Premium Cotton T-Shirt',
            slug: 'premium-cotton-tshirt',
            description: '100% premium cotton t-shirt. Comfortable and breathable for everyday wear.',
            price: 24.99,
            stock: 120,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
            categoryId: getCat('men').id,
            brandId: getBrand('hm').id,
            attributes: [
                { name: 'Size', value: 'S' },
                { name: 'Size', value: 'M' },
                { name: 'Size', value: 'L' },
                { name: 'Color', value: 'White' },
                { name: 'Color', value: 'Black' },
            ],
        },
        {
            name: 'Slim Fit Chinos',
            slug: 'slim-fit-chinos',
            description: 'Modern slim fit chinos with stretch fabric. Perfect for work or weekend.',
            price: 49.99,
            stock: 68,
            images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
            categoryId: getCat('men').id,
            brandId: getBrand('zara').id,
            isFeatured: true,
            attributes: [
                { name: 'Size', value: '30' },
                { name: 'Size', value: '32' },
                { name: 'Size', value: '34' },
                { name: 'Color', value: 'Beige' },
                { name: 'Color', value: 'Navy' },
            ],
        },
        {
            name: 'Leather Oxford Shoes',
            slug: 'leather-oxford-shoes',
            description: 'Classic leather oxford shoes. Handcrafted with premium leather.',
            price: 129.99,
            salePrice: 99.99,
            stock: 32,
            images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800'],
            categoryId: getCat('men').id,
            brandId: getBrand('fossil').id,
            attributes: [
                { name: 'Size', value: '9' },
                { name: 'Size', value: '10' },
                { name: 'Size', value: '11' },
                { name: 'Color', value: 'Brown' },
            ],
        },
        {
            name: 'Casual Blazer',
            slug: 'casual-blazer',
            description: 'Smart casual blazer for modern gentleman. Perfect for office or events.',
            price: 149.99,
            stock: 28,
            images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'],
            categoryId: getCat('men').id,
            brandId: getBrand('zara').id,
            attributes: [
                { name: 'Size', value: 'M' },
                { name: 'Size', value: 'L' },
                { name: 'Color', value: 'Navy' },
                { name: 'Color', value: 'Charcoal' },
            ],
        },

        // Women's Fashion
        {
            name: 'Floral Summer Dress',
            slug: 'floral-summer-dress',
            description: 'Beautiful floral print summer dress. Lightweight and breezy for warm weather.',
            price: 59.99,
            salePrice: 39.99,
            stock: 55,
            images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
            categoryId: getCat('women').id,
            brandId: getBrand('hm').id,
            isFeatured: true,
            attributes: [
                { name: 'Size', value: 'S' },
                { name: 'Size', value: 'M' },
                { name: 'Size', value: 'L' },
                { name: 'Color', value: 'Floral Pink' },
            ],
        },
        {
            name: 'Elegant Evening Gown',
            slug: 'elegant-evening-gown',
            description: 'Stunning evening gown for special occasions. Flattering silhouette with elegant draping.',
            price: 199.99,
            stock: 18,
            images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'],
            categoryId: getCat('women').id,
            brandId: getBrand('zara').id,
            isFeatured: true,
            attributes: [
                { name: 'Size', value: 'S' },
                { name: 'Size', value: 'M' },
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'Navy' },
            ],
        },
        {
            name: 'High-Waist Jeans',
            slug: 'high-waist-jeans',
            description: 'Trendy high-waist jeans with stretch denim. Comfortable and stylish.',
            price: 69.99,
            stock: 75,
            images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
            categoryId: getCat('women').id,
            brandId: getBrand('levis').id,
            attributes: [
                { name: 'Size', value: '26' },
                { name: 'Size', value: '28' },
                { name: 'Size', value: '30' },
                { name: 'Color', value: 'Dark Blue' },
            ],
        },
        {
            name: 'Silk Blouse',
            slug: 'silk-blouse',
            description: 'Luxurious silk blouse with elegant draping. Perfect for office or evenings.',
            price: 89.99,
            stock: 42,
            images: ['https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800'],
            categoryId: getCat('women').id,
            brandId: getBrand('zara').id,
            attributes: [
                { name: 'Size', value: 'S' },
                { name: 'Size', value: 'M' },
                { name: 'Color', value: 'Ivory' },
                { name: 'Color', value: 'Black' },
            ],
        },
        {
            name: 'Knit Cardigan',
            slug: 'knit-cardigan',
            description: 'Cozy knit cardigan for layering. Soft and comfortable.',
            price: 54.99,
            stock: 63,
            images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
            categoryId: getCat('women').id,
            brandId: getBrand('hm').id,
            attributes: [
                { name: 'Size', value: 'S' },
                { name: 'Size', value: 'M' },
                { name: 'Size', value: 'L' },
                { name: 'Color', value: 'Beige' },
                { name: 'Color', value: 'Gray' },
            ],
        },

        // Kids
        {
            name: 'Kids Cotton T-Shirt Pack',
            slug: 'kids-cotton-tshirt-pack',
            description: 'Set of 3 colorful cotton t-shirts. Soft and perfect for playtime.',
            price: 24.99,
            salePrice: 19.99,
            stock: 95,
            images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800'],
            categoryId: getCat('kids').id,
            brandId: getBrand('hm').id,
            isFeatured: true,
            attributes: [
                { name: 'Size', value: '4-6Y' },
                { name: 'Size', value: '7-9Y' },
                { name: 'Color', value: 'Multi' },
            ],
        },
        {
            name: 'Kids Denim Shorts',
            slug: 'kids-denim-shorts',
            description: 'Comfortable denim shorts for active kids. Durable and stylish.',
            price: 29.99,
            stock: 72,
            images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'],
            categoryId: getCat('kids').id,
            brandId: getBrand('levis').id,
            attributes: [
                { name: 'Size', value: '4-6Y' },
                { name: 'Size', value: '7-9Y' },
                { name: 'Size', value: '10-12Y' },
                { name: 'Color', value: 'Blue' },
            ],
        },
        {
            name: 'Kids Sneakers',
            slug: 'kids-sneakers',
            description: 'Comfortable sneakers for everyday wear. Lightweight with cushioned sole.',
            price: 44.99,
            stock: 88,
            images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800'],
            categoryId: getCat('kids').id,
            brandId: getBrand('nike').id,
            attributes: [
                { name: 'Size', value: '11' },
                { name: 'Size', value: '12' },
                { name: 'Size', value: '13' },
                { name: 'Color', value: 'White' },
                { name: 'Color', value: 'Black' },
            ],
        },

        // Accessories
        {
            name: 'Leather Crossbody Bag',
            slug: 'leather-crossbody-bag',
            description: 'Premium leather crossbody bag. Compact yet spacious with adjustable strap.',
            price: 119.99,
            salePrice: 89.99,
            stock: 36,
            images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'],
            categoryId: getCat('accessories').id,
            brandId: getBrand('fossil').id,
            isFeatured: true,
            attributes: [
                { name: 'Color', value: 'Brown' },
                { name: 'Color', value: 'Black' },
            ],
        },
        {
            name: 'Classic Aviator Sunglasses',
            slug: 'classic-aviator-sunglasses',
            description: 'Timeless aviator sunglasses with UV protection. Premium metal frame.',
            price: 159.99,
            stock: 54,
            images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'],
            categoryId: getCat('accessories').id,
            brandId: getBrand('rayban').id,
            isFeatured: true,
            attributes: [
                { name: 'Color', value: 'Gold/Green' },
                { name: 'Color', value: 'Silver/Gray' },
            ],
        },
        {
            name: 'Leather Watch',
            slug: 'leather-watch',
            description: 'Elegant leather strap watch. Minimalist design with precision movement.',
            price: 179.99,
            salePrice: 139.99,
            stock: 29,
            images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
            categoryId: getCat('accessories').id,
            brandId: getBrand('fossil').id,
            attributes: [
                { name: 'Color', value: 'Brown Leather' },
                { name: 'Color', value: 'Black Leather' },
            ],
        },
        {
            name: 'Canvas Backpack',
            slug: 'canvas-backpack',
            description: 'Durable canvas backpack for everyday use. Multiple compartments.',
            price: 64.99,
            stock: 67,
            images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
            categoryId: getCat('accessories').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Color', value: 'Navy' },
                { name: 'Color', value: 'Gray' },
                { name: 'Color', value: 'Olive' },
            ],
        },
        {
            name: 'Wallet',
            slug: 'leather-wallet',
            description: 'Slim leather wallet with RFID protection. Multiple card slots.',
            price: 39.99,
            stock: 110,
            images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800'],
            categoryId: getCat('accessories').id,
            brandId: getBrand('fossil').id,
            attributes: [
                { name: 'Color', value: 'Brown' },
                { name: 'Color', value: 'Black' },
            ],
        },

        // Electronics
        {
            name: 'Wireless Headphones',
            slug: 'wireless-headphones',
            description: 'Premium wireless headphones with active noise cancellation. 30-hour battery life.',
            price: 299.99,
            salePrice: 249.99,
            stock: 42,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
            categoryId: getCat('electronics').id,
            brandId: getBrand('samsung').id,
            isFeatured: true,
            attributes: [
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'White' },
            ],
        },
        {
            name: 'Smartphone',
            slug: 'flagship-smartphone',
            description: 'Latest flagship smartphone with advanced camera system and 5G.',
            price: 899.99,
            stock: 28,
            images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
            categoryId: getCat('electronics').id,
            brandId: getBrand('samsung').id,
            attributes: [
                { name: 'Storage', value: '128GB' },
                { name: 'Storage', value: '256GB' },
                { name: 'Color', value: 'Black' },
            ],
        },
        {
            name: 'Wireless Mouse',
            slug: 'wireless-mouse',
            description: 'Ergonomic wireless mouse with precision tracking. Long battery life.',
            price: 34.99,
            stock: 156,
            images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
            categoryId: getCat('electronics').id,
            brandId: getBrand('logitech').id,
            attributes: [
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'White' },
            ],
        },
        {
            name: 'Bluetooth Speaker',
            slug: 'bluetooth-speaker',
            description: 'Portable Bluetooth speaker with 360° sound. Waterproof design.',
            price: 79.99,
            stock: 73,
            images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
            categoryId: getCat('electronics').id,
            brandId: getBrand('generic').id,
            isFeatured: true,
            attributes: [
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'Blue' },
                { name: 'Color', value: 'Red' },
            ],
        },

        // Sports
        {
            name: 'Running Shoes',
            slug: 'running-shoes',
            description: 'High-performance running shoes with responsive cushioning.',
            price: 129.99,
            salePrice: 99.99,
            stock: 64,
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
            categoryId: getCat('sports').id,
            brandId: getBrand('nike').id,
            isFeatured: true,
            attributes: [
                { name: 'Size', value: '9' },
                { name: 'Size', value: '10' },
                { name: 'Size', value: '11' },
                { name: 'Color', value: 'Black/White' },
            ],
        },
        {
            name: 'Yoga Mat',
            slug: 'yoga-mat',
            description: 'Non-slip yoga mat with extra cushioning. Perfect for all fitness levels.',
            price: 34.99,
            stock: 92,
            images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
            categoryId: getCat('sports').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Color', value: 'Purple' },
                { name: 'Color', value: 'Blue' },
                { name: 'Color', value: 'Pink' },
            ],
        },
        {
            name: 'Gym Bag',
            slug: 'gym-bag',
            description: 'Spacious gym bag with separate shoe compartment. Durable and water-resistant.',
            price: 49.99,
            stock: 58,
            images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
            categoryId: getCat('sports').id,
            brandId: getBrand('adidas').id,
            attributes: [
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'Navy' },
            ],
        },
        {
            name: 'Sports Watch',
            slug: 'sports-watch',
            description: 'GPS sports watch with heart rate monitor. Track all your activities.',
            price: 249.99,
            stock: 31,
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
            categoryId: getCat('sports').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'Blue' },
            ],
        },
        {
            name: 'Resistance Bands Set',
            slug: 'resistance-bands-set',
            description: 'Set of 5 resistance bands for full-body workouts. Includes carrying bag.',
            price: 24.99,
            stock: 125,
            images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800'],
            categoryId: getCat('sports').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Resistance', value: 'Light-Heavy' },
            ],
        },

        // Home & Living
        {
            name: 'Decorative Throw Pillows',
            slug: 'decorative-throw-pillows',
            description: 'Set of 2 decorative throw pillows. Soft velvet fabric with geometric pattern.',
            price: 39.99,
            stock: 78,
            images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800'],
            categoryId: getCat('home-living').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Color', value: 'Navy/Gold' },
                { name: 'Color', value: 'Gray/Silver' },
            ],
        },
        {
            name: 'Scented Candles Set',
            slug: 'scented-candles-set',
            description: 'Set of 3 luxury scented candles. Lavender, vanilla, and ocean breeze.',
            price: 44.99,
            stock: 103,
            images: ['https://images.unsplash.com/photo-1602874801006-c2f1d87b6fd6?w=800'],
            categoryId: getCat('home-living').id,
            brandId: getBrand('generic').id,
            isFeatured: true,
            attributes: [
                { name: 'Scent', value: 'Mixed' },
            ],
        },
        {
            name: 'Wall Art Canvas',
            slug: 'wall-art-canvas',
            description: 'Modern abstract wall art canvas. Gallery-quality print.',
            price: 89.99,
            stock: 47,
            images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'],
            categoryId: getCat('home-living').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Size', value: '24x36"' },
                { name: 'Size', value: '30x40"' },
            ],
        },
        {
            name: 'Table Lamp',
            slug: 'modern-table-lamp',
            description: 'Modern minimalist table lamp. Adjustable brightness.',
            price: 59.99,
            stock: 66,
            images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
            categoryId: getCat('home-living').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Color', value: 'White' },
                { name: 'Color', value: 'Black' },
            ],
        },

        // Beauty
        {
            name: 'Skincare Set',
            slug: 'skincare-set',
            description: 'Complete skincare routine set. Cleanser, toner, serum, and moisturizer.',
            price: 79.99,
            salePrice: 59.99,
            stock: 84,
            images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'],
            categoryId: getCat('beauty').id,
            brandId: getBrand('generic').id,
            isFeatured: true,
            attributes: [
                { name: 'Type', value: 'For All Skin Types' },
            ],
        },
        {
            name: 'Makeup Brush Set',
            slug: 'makeup-brush-set',
            description: 'Professional makeup brush set with 12 essential brushes. Soft bristles.',
            price: 49.99,
            stock: 72,
            images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'],
            categoryId: getCat('beauty').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Pieces', value: '12' },
            ],
        },
        {
            name: 'Hair Dryer',
            slug: 'professional-hair-dryer',
            description: 'Professional ionic hair dryer. Multiple heat and speed settings.',
            price: 89.99,
            stock: 43,
            images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'],
            categoryId: getCat('beauty').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Color', value: 'Black' },
                { name: 'Color', value: 'Rose Gold' },
            ],
        },
        {
            name: 'Perfume',
            slug: 'luxury-perfume',
            description: 'Luxury eau de parfum with floral and woody notes. Long-lasting fragrance.',
            price: 129.99,
            stock: 56,
            images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'],
            categoryId: getCat('beauty').id,
            brandId: getBrand('generic').id,
            attributes: [
                { name: 'Size', value: '50ml' },
                { name: 'Size', value: '100ml' },
            ],
        },
    ]

    const products = []
    for (const pd of productData) {
        const { attributes, ...productInfo } = pd
        const product = await prisma.product.create({
            data: {
                ...productInfo,
                attributes: {
                    create: attributes,
                },
            },
        })
        products.push(product)
    }
    console.log(`✅ Created ${products.length} products`)

    // Create Banners
    const banners = await Promise.all([
        prisma.banner.create({
            data: {
                title: 'Summer Sale 2024',
                subtitle: 'Up to 50% off on selected items',
                image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
                link: '/shop?category=sale',
                isActive: true,
            },
        }),
        prisma.banner.create({
            data: {
                title: 'New Arrivals',
                subtitle: 'Check out our latest collection',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
                link: '/shop',
                isActive: true,
            },
        }),
        prisma.banner.create({
            data: {
                title: 'Free Shipping',
                subtitle: 'On orders over $100',
                image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
                link: '/shop',
                isActive: true,
            },
        }),
    ])
    console.log(`✅ Created ${banners.length} banners`)

    // Create Coupons
    const coupons = await Promise.all([
        prisma.coupon.create({
            data: {
                code: 'WELCOME10',
                discount: 10,
                type: 'PERCENTAGE',
                expiryDate: new Date('2025-12-31'),
                isActive: true,
            },
        }),
        prisma.coupon.create({
            data: {
                code: 'SAVE20',
                discount: 20,
                type: 'FIXED',
                expiryDate: new Date('2025-12-31'),
                isActive: true,
            },
        }),
    ])
    console.log(`✅ Created ${coupons.length} coupons`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📝 Login credentials:')
    console.log('Admin: admin@readymart.com / Admin123!')
    console.log('User: user@test.com / Test123!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
