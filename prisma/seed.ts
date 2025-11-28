import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth/password'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clean up existing data
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.wishlist.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()

    // Create Users
    const adminPassword = await hashPassword('admin123')
    const userPassword = await hashPassword('user123')

    const admin = await prisma.user.create({
        data: {
            email: 'admin@readymart.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    })

    const user1 = await prisma.user.create({
        data: {
            email: 'john@example.com',
            password: userPassword,
            name: 'John Doe',
            role: 'USER',
            emailVerified: new Date(),
        },
    })

    const user2 = await prisma.user.create({
        data: {
            email: 'jane@example.com',
            password: userPassword,
            name: 'Jane Smith',
            role: 'USER',
            emailVerified: new Date(),
        },
    })

    // Create Categories
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'Men', slug: 'men', description: 'Men\'s Fashion' } }),
        prisma.category.create({ data: { name: 'Women', slug: 'women', description: 'Women\'s Fashion' } }),
        prisma.category.create({ data: { name: 'Kids', slug: 'kids', description: 'Kids\' Fashion' } }),
        prisma.category.create({ data: { name: 'Accessories', slug: 'accessories', description: 'Accessories & Gadgets' } }),
        prisma.category.create({ data: { name: 'Footwear', slug: 'footwear', description: 'Shoes & Sneakers' } }),
        prisma.category.create({ data: { name: 'Sports', slug: 'sports', description: 'Sportswear & Gear' } }),
        prisma.category.create({ data: { name: 'Electronics', slug: 'electronics', description: 'Gadgets & Tech' } }),
        prisma.category.create({ data: { name: 'Home', slug: 'home', description: 'Home & Living' } }),
    ])

    // Create Brands
    const brands = await Promise.all([
        prisma.brand.create({ data: { name: 'Nike', slug: 'nike', logo: '/brands/nike.png' } }),
        prisma.brand.create({ data: { name: 'Adidas', slug: 'adidas', logo: '/brands/adidas.png' } }),
        prisma.brand.create({ data: { name: 'Zara', slug: 'zara', logo: '/brands/zara.png' } }),
        prisma.brand.create({ data: { name: 'H&M', slug: 'h-and-m', logo: '/brands/hm.png' } }),
        prisma.brand.create({ data: { name: 'Puma', slug: 'puma', logo: '/brands/puma.png' } }),
        prisma.brand.create({ data: { name: 'Gucci', slug: 'gucci', logo: '/brands/gucci.png' } }),
        prisma.brand.create({ data: { name: 'Apple', slug: 'apple', logo: '/brands/apple.png' } }),
        prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.png' } }),
        prisma.brand.create({ data: { name: 'Sony', slug: 'sony', logo: '/brands/sony.png' } }),
        prisma.brand.create({ data: { name: 'Levi\'s', slug: 'levis', logo: '/brands/levis.png' } }),
    ])

    // Helper to get random item
    const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    // Create Products (30 items)
    const productData = [
        // Men
        { name: 'Classic White T-Shirt', price: 29.99, category: 'Men', brand: 'H&M' },
        { name: 'Slim Fit Jeans', price: 59.99, category: 'Men', brand: 'Levi\'s' },
        { name: 'Leather Jacket', price: 199.99, category: 'Men', brand: 'Zara' },
        { name: 'Running Shoes', price: 89.99, category: 'Men', brand: 'Nike' },
        { name: 'Casual Hoodie', price: 49.99, category: 'Men', brand: 'Adidas' },

        // Women
        { name: 'Floral Summer Dress', price: 45.99, category: 'Women', brand: 'H&M' },
        { name: 'High Heels', price: 79.99, category: 'Women', brand: 'Gucci' },
        { name: 'Designer Handbag', price: 299.99, category: 'Women', brand: 'Gucci' },
        { name: 'Yoga Leggings', price: 39.99, category: 'Women', brand: 'Puma' },
        { name: 'Denim Jacket', price: 69.99, category: 'Women', brand: 'Levi\'s' },

        // Kids
        { name: 'Kids Graphic Tee', price: 19.99, category: 'Kids', brand: 'H&M' },
        { name: 'School Backpack', price: 34.99, category: 'Kids', brand: 'Nike' },
        { name: 'Sneakers for Kids', price: 49.99, category: 'Kids', brand: 'Adidas' },
        { name: 'Winter Coat', price: 59.99, category: 'Kids', brand: 'Zara' },

        // Accessories
        { name: 'Classic Watch', price: 129.99, category: 'Accessories', brand: 'Fossil' }, // Brand might be missing, fallback to random
        { name: 'Sunglasses', price: 89.99, category: 'Accessories', brand: 'Ray-Ban' },
        { name: 'Leather Belt', price: 29.99, category: 'Accessories', brand: 'Levi\'s' },
        { name: 'Cap', price: 24.99, category: 'Accessories', brand: 'Nike' },

        // Electronics
        { name: 'Wireless Headphones', price: 199.99, category: 'Electronics', brand: 'Sony' },
        { name: 'Smart Watch', price: 299.99, category: 'Electronics', brand: 'Apple' },
        { name: 'Bluetooth Speaker', price: 79.99, category: 'Electronics', brand: 'JBL' },
        { name: 'Smartphone Case', price: 19.99, category: 'Electronics', brand: 'Samsung' },

        // Sports
        { name: 'Soccer Ball', price: 29.99, category: 'Sports', brand: 'Adidas' },
        { name: 'Tennis Racket', price: 149.99, category: 'Sports', brand: 'Wilson' },
        { name: 'Gym Bag', price: 44.99, category: 'Sports', brand: 'Nike' },

        // Footwear
        { name: 'Air Max Sneakers', price: 129.99, category: 'Footwear', brand: 'Nike' },
        { name: 'Ultraboost', price: 159.99, category: 'Footwear', brand: 'Adidas' },
        { name: 'Classic Loafers', price: 89.99, category: 'Footwear', brand: 'Gucci' },
    ]

    const products = []

    for (const p of productData) {
        const category = categories.find(c => c.name === p.category) || random(categories)
        const brand = brands.find(b => b.name === p.brand) || random(brands)

        const product = await prisma.product.create({
            data: {
                name: p.name,
                slug: p.name.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(7),
                description: `This is a premium quality ${p.name} from ${brand.name}. Perfect for your lifestyle.`,
                price: p.price,
                salePrice: Math.random() > 0.7 ? p.price * 0.8 : null, // 30% chance of sale
                stock: Math.floor(Math.random() * 50) + 5,
                categoryId: category.id,
                brandId: brand.id,
                images: [
                    `https://source.unsplash.com/random/800x800/?${p.category.toLowerCase()},${p.name.split(' ')[0].toLowerCase()}`,
                    `https://source.unsplash.com/random/800x800/?fashion,${p.category.toLowerCase()}`,
                ],
                isArchived: false,
                isFeatured: Math.random() > 0.8,
            },
        })
        products.push(product)
    }

    // Create Reviews
    for (const product of products) {
        // 50% chance a product has reviews
        if (Math.random() > 0.5) {
            const numReviews = Math.floor(Math.random() * 5) + 1
            for (let i = 0; i < numReviews; i++) {
                await prisma.review.create({
                    data: {
                        productId: product.id,
                        userId: Math.random() > 0.5 ? user1.id : user2.id,
                        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars mostly
                        comment: 'Great product! Really loved the quality and fast shipping.',
                    },
                })
            }
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
