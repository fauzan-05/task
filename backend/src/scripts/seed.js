const { connectDatabase, disconnectDatabase } = require('../config/database');
const { Product } = require('../models/Product');
const { User } = require('../models/User');

const sampleProducts = [
  {
    name: 'Reusable drinkware for a greener lifestyle.',
    description:
      'Double-walled vacuum insulated eco-friendly flask crafted from food-grade stainless steel with non-toxic powder coating and leakproof bamboo lid. Keeps beverages cold for 24h and hot for 12h.',
    category: 'Drinkware',
    price: 43.85,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=85&auto=format&fit=crop',
    stock: 45,
    badge: 'Promotion',
    colors: ['#8ecae6', '#a7c957', '#2a9d8f'],
    rating: 4.9,
    reviewsCount: 128,
    isBestseller: true
  },
  {
    name: 'Non-toxic cookware for sustainable cooking.',
    description:
      'Mineral-based ceramic non-stick Dutch ovens and saucepans. Free of PTFE, PFOA, lead, and cadmium. Designed for induction, gas, and electric stovetops with stay-cool cast stainless handles.',
    category: 'Cookware',
    price: 78.35,
    image: 'https://images.unsplash.com/photo-1584990347449-3995817c936a?w=800&q=85&auto=format&fit=crop',
    stock: 28,
    badge: 'New',
    colors: ['#606c38', '#bc6c25', '#dda15e'],
    rating: 4.8,
    reviewsCount: 94,
    isBestseller: true
  },
  {
    name: 'Kettle & Toaster eco-friendly meals.',
    description:
      'Energy-efficient rapid-boil electric kettle paired with a natural bamboo trim base and matte sage green finish. Automatic shut-off and ultra-quiet heating element for peaceful mornings.',
    category: 'Appliances',
    price: 143.65,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=85&auto=format&fit=crop',
    stock: 20,
    badge: 'Customer Favorite',
    colors: ['#d4a373', '#faedcd', '#606c38'],
    rating: 5.0,
    reviewsCount: 210,
    isBestseller: true
  },
  {
    name: 'Bamboo Made Utensil Holder',
    description:
      'Heavy ceramic crock in warm mustard glaze with 6 handcrafted organic bamboo cooking utensils including spatulas, slotted spoons, and salad tossers. Naturally antimicrobial.',
    category: 'Tableware',
    price: 26.27,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=85&auto=format&fit=crop',
    stock: 60,
    badge: 'New',
    colors: ['#606c38', '#a7c957', '#e9c46a'],
    rating: 4.9,
    reviewsCount: 86,
    isBestseller: true
  },
  {
    name: 'EcoSteam Multi-Cooker Hotpot with Gold Knob',
    description:
      'A multi-purpose electric steam cooker with ceramic non-stick inner basin, precise temperature knob, and glass viewing lid. Perfect for soups, dumplings, hotpots, and slow braising.',
    category: 'Appliances',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=85&auto=format&fit=crop',
    stock: 15,
    badge: 'New Arrival',
    colors: ['#1b4332', '#d8f3dc', '#b7e4c7'],
    rating: 4.9,
    reviewsCount: 42,
    isBestseller: true
  },
  {
    name: 'Pastel Ceramic Smart Rice Pot Trio',
    description:
      'Low-GI healthy fuzzy-logic rice cookers with ceramic-coated alloy pot. Encircled by fresh herbs and rustic wooden tones, offering 8 smart presets for grains, congee, and quinoa.',
    category: 'Appliances',
    price: 129.50,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=85&auto=format&fit=crop',
    stock: 22,
    badge: 'Best Seller',
    colors: ['#74c69d', '#fdf0d5', '#f4a261'],
    rating: 4.9,
    reviewsCount: 164,
    isBestseller: true
  },
  {
    name: 'Sustainable Pure Scent Wax & Jar',
    description:
      'Hand-poured pure soy and coconut wax candle infused with wild eucalyptus, sweet orange, and pine botanical oils in a reusable terracotta ceramic vessel with cedar wood wick.',
    category: 'Living',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=85&auto=format&fit=crop',
    stock: 35,
    badge: 'Handmade',
    colors: ['#bc6c25', '#dda15e', '#606c38'],
    rating: 4.8,
    reviewsCount: 57,
    isBestseller: false
  },
  {
    name: 'Grain Slice Round Acacia Serving Tray',
    description:
      'Sustainably harvested solid acacia wood serving board with natural raw edge, finished in food-safe cold-pressed walnut oil. Perfect for cheese boards, appetizers, and tea serving.',
    category: 'Tableware',
    price: 48.50,
    image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&q=85&auto=format&fit=crop',
    stock: 30,
    badge: 'Eco-Friendly',
    colors: ['#8c531b', '#d4a373'],
    rating: 4.9,
    reviewsCount: 73,
    isBestseller: false
  },
  {
    name: 'Olive Pot Minimalist Ceramic Casserole',
    description:
      'High-fired stoneware ceramic oven-to-table casserole dish in signature olive tone. Retains gentle thermal heat for even baking and tender results.',
    category: 'Cookware',
    price: 62.00,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=85&auto=format&fit=crop',
    stock: 18,
    badge: 'Popular',
    colors: ['#606c38', '#283618', '#fefae0'],
    rating: 4.9,
    reviewsCount: 89,
    isBestseller: true
  },
  {
    name: 'EveryDay Ceramic Artisan Cup Set',
    description:
      'Set of 2 handcrafted ceramic mugs with comfortable organic thumb indents and rich terracotta speckled glazes. Dishwasher and microwave safe.',
    category: 'Drinkware',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=85&auto=format&fit=crop',
    stock: 40,
    badge: 'Crafted',
    colors: ['#bc6c25', '#dda15e', '#606c38'],
    rating: 4.9,
    reviewsCount: 112,
    isBestseller: false
  },
  {
    name: 'Organic Cotton & Linen Culinary Apron',
    description:
      '100% GOTS certified organic linen apron with cross-back adjustable straps and spacious utility pockets in olive sage tone. Preshrunk and durable for everyday cooking.',
    category: 'Living',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=85&auto=format&fit=crop',
    stock: 25,
    badge: 'Organic',
    colors: ['#606c38', '#d4a373', '#283618'],
    rating: 4.8,
    reviewsCount: 45,
    isBestseller: false
  },
  {
    name: 'Airtight Glass & Bamboo Food Canister Set',
    description:
      'Set of 4 ultra-clear borosilicate glass food storage jars with silicone-sealed natural bamboo lids. Keeps pasta, grains, coffee, and spices crisp and organized.',
    category: 'Tableware',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=85&auto=format&fit=crop',
    stock: 50,
    badge: 'Best Seller',
    colors: ['#d4a373', '#606c38'],
    rating: 5.0,
    reviewsCount: 310,
    isBestseller: true
  }
];

const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 No products found in database. Auto-seeding initial Homedine catalog...');
      const inserted = await Product.insertMany(sampleProducts);
      console.log(`✅ Auto-seeded ${inserted.length} eco kitchenware products.`);
    } else {
      console.log(`ℹ️ Database already has ${count} products.`);
    }

    const demoEmail = 'demo@example.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Jane Cooper',
        email: demoEmail,
        password: 'Password123!',
        role: 'user'
      });
      console.log(`✅ Created demo user: ${demoEmail} (Password: Password123!)`);
    }

    // Super User Admin
    const superAdminEmail = 'admin@gmail.com';
    let superAdmin = await User.findOne({ email: superAdminEmail });
    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log(`✅ Created Super User: ${superAdminEmail} (Password: admin123, Role: admin)`);
    } else {
      superAdmin.role = 'admin';
      superAdmin.password = 'admin123';
      await superAdmin.save();
      console.log(`✅ Updated Super User: ${superAdminEmail} (Role: admin)`);
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err);
  }
};

const runSeedScript = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDatabase();

    console.log('Clearing existing product catalog...');
    await Product.deleteMany({});

    console.log('Seeding Homedine eco kitchenware products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} Homedine eco products.`);

    const demoEmail = 'demo@example.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Jane Cooper',
        email: demoEmail,
        password: 'Password123!',
        role: 'user'
      });
      console.log(`✅ Created demo user: ${demoEmail} (Password: Password123!)`);
    }

    const superAdminEmail = 'admin@gmail.com';
    let superAdmin = await User.findOne({ email: superAdminEmail });
    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log(`✅ Created Super User: ${superAdminEmail} (Password: admin123)`);
    } else {
      superAdmin.role = 'admin';
      superAdmin.password = 'admin123';
      await superAdmin.save();
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

if (require.main === module) {
  runSeedScript();
}

module.exports = { sampleProducts, seedDatabase };

