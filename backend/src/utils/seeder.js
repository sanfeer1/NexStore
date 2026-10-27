import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'High-performance laptops, tablets, and computing gear.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Immersive noise-cancelling headphones and studio monitors.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Wearables',
    slug: 'wearables',
    description: 'Next-gen smartwatches, health trackers, and smart rings.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Ergonomic running shoes, sneakers, and lifestyle footwear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Ambient lighting, smart hubs, and automated lifestyle devices.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Leather backpacks, minimalist wallets, and desk essentials.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
  },
];

const products = [
  {
    title: 'AeroSound Pro Wireless ANC Headphones',
    description: 'Experience studio-grade acoustic clarity with active hybrid noise cancellation, 40-hour battery life, and plush memory foam earcups.',
    price: 19999,
    discountPrice: 15999,
    stock: 25,
    category: 'Audio',
    brand: 'AeroSound',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    ],
    featured: true,
    isNewArrival: false,
    ratings: 4.8,
    numReviews: 42,
    tags: ['anc', 'wireless', 'bluetooth', 'premium'],
  },
  {
    title: 'Veloce Ultra Ergonomic Running Sneakers',
    description: 'Engineered with responsive carbon-infused foam midsoles and breathable mesh for maximum stride efficiency and all-day comfort.',
    price: 12999,
    discountPrice: 9999,
    stock: 40,
    category: 'Footwear',
    brand: 'Veloce',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    ],
    featured: true,
    isNewArrival: true,
    ratings: 4.9,
    numReviews: 35,
    tags: ['running', 'sports', 'sneakers'],
  },
  {
    title: 'Chronos Horizon AMOLED Smartwatch',
    description: 'Precision titanium casing with always-on AMOLED display, heart-rate tracking, SpO2 monitoring, and 14-day extended battery endurance.',
    price: 24999,
    discountPrice: 19999,
    stock: 18,
    category: 'Wearables',
    brand: 'Chronos',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    ],
    featured: true,
    isNewArrival: false,
    ratings: 4.7,
    numReviews: 28,
    tags: ['smartwatch', 'amoled', 'fitness'],
  },
  {
    title: 'Lumina Arc Ambient Smart Lamp',
    description: 'Minimalist curved desk lamp with customizable warm-to-cool white spectrum, RGB ambient gradients, and touch-sensitive dimming.',
    price: 6999,
    discountPrice: 5499,
    stock: 30,
    category: 'Smart Home',
    brand: 'Lumina',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    ],
    featured: false,
    isNewArrival: true,
    ratings: 4.6,
    numReviews: 19,
    tags: ['lighting', 'desk', 'smart-home'],
  },
  {
    title: 'Nomad Crafted Full-Grain Leather Backpack',
    description: 'Handcrafted premium leather backpack with dedicated 16-inch padded laptop sleeve, water-resistant lining, and brass hardware.',
    price: 14999,
    discountPrice: 11999,
    stock: 12,
    category: 'Accessories',
    brand: 'Nomad',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    ],
    featured: true,
    isNewArrival: false,
    ratings: 4.9,
    numReviews: 54,
    tags: ['backpack', 'leather', 'travel'],
  },
  {
    title: 'MacBook Air Space Grey Mockup Station',
    description: 'Ultra-thin, featherlight laptop with crystal-clear Retina display, all-day battery life, and silent fanless cooling.',
    price: 89999,
    discountPrice: 79999,
    stock: 8,
    category: 'Electronics',
    brand: 'Apex',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ],
    featured: true,
    isNewArrival: true,
    ratings: 5.0,
    numReviews: 16,
    tags: ['laptop', 'computing', 'ultrabook'],
  },
  {
    title: 'Pulse Studio Wireless Desktop Speaker',
    description: '360-degree room-filling acoustic soundstage with dual subwoofers, Bluetooth 5.3, and sculpted aluminum acoustic grill.',
    price: 10999,
    discountPrice: 8999,
    stock: 22,
    category: 'Audio',
    brand: 'AeroSound',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    ],
    featured: false,
    isNewArrival: true,
    ratings: 4.5,
    numReviews: 21,
    tags: ['speaker', 'audio', 'bluetooth'],
  },
  {
    title: 'Artisan Minimalist Bifold Wallet',
    description: 'Slimline RFID-blocking genuine leather wallet with easy-access pull-tab, quick card slots, and banknote divider.',
    price: 3999,
    discountPrice: 2999,
    stock: 65,
    category: 'Accessories',
    brand: 'Nomad',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    ],
    featured: false,
    isNewArrival: false,
    ratings: 4.6,
    numReviews: 33,
    tags: ['wallet', 'leather', 'rfid'],
  },
];

export const seedData = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    mongoUri = mongoUri.replace(/(\.mongodb\.net|\.com|\.net|\.org|\d+)\/\/+([a-zA-Z0-9_-]+)/g, '$1/$2');
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to database');

    // Clear existing records
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Seed default admin and customer users
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: 'admin@example.com',
      password: 'admin123Password!',
      role: 'admin',
      addresses: [
        {
          street: '100 Silicon Boulevard',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    const customerUser = await User.create({
      name: 'Sanfeer Demo Customer',
      email: 'customer@example.com',
      password: 'customer123Password!',
      role: 'customer',
      addresses: [
        {
          street: '42 MG Road',
          city: 'Kochi',
          state: 'Kerala',
          postalCode: '682001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    console.log(`[Seeder] Created Admin: ${adminUser.email} and Customer: ${customerUser.email}`);

    // Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`[Seeder] Seeded ${createdCategories.length} categories`);

    // Attach sample reviews to some products
    const productsWithReviews = products.map((prod) => ({
      ...prod,
      reviews: [
        {
          user: customerUser._id,
          name: customerUser.name,
          rating: 5,
          comment: 'Outstanding quality and very fast shipping! Exceeded expectations.',
          createdAt: new Date(),
        },
      ],
    }));

    const createdProducts = await Product.insertMany(productsWithReviews);
    console.log(`[Seeder] Seeded ${createdProducts.length} products`);

    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1]?.endsWith('seeder.js')) {
  seedData();
}
