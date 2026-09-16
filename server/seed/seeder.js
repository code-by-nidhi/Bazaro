const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');

const { categoriesData, generateProducts, bannersData, couponsData } = require('./seedData');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bazaro');
    console.log('[Seeder MongoDB Connected]');
  } catch (err) {
    console.error(`[Seeder DB Error]: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Banner.deleteMany();

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'Bazaro Executive Admin',
      email: 'admin@bazaro.com',
      password: 'Admin@123456',
      phone: '+91 9876543210',
      role: 'admin',
      avatar: { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
      addresses: [
        {
          fullName: 'Bazaro HQ',
          phone: '+91 9876543210',
          addressLine: 'Suite 404, Tech Park, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          landmark: 'Near Metro Station',
          isDefault: true,
        },
      ],
    });

    const standardUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@bazaro.com',
      password: 'User@123456',
      phone: '+91 9123456789',
      role: 'user',
      avatar: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
      addresses: [
        {
          fullName: 'Alex Johnson',
          phone: '+91 9123456789',
          addressLine: 'Flat 302, Green Valley Apartments, HSR Layout',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560102',
          landmark: 'Opposite BDA Complex',
          isDefault: true,
        },
      ],
    });

    console.log('Seeding Categories & Subcategories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('Seeding Products dataset...');
    const productsRaw = generateProducts(categoryMap);
    const productsToInsert = productsRaw.map((p) => {
      const categoryId = categoryMap[p.categorySlug];
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const price = p.price;
      const discountPrice = p.discountPrice || price;
      const discountPercentage = price > discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

      return {
        ...p,
        category: categoryId,
        slug,
        discountPrice,
        discountPercentage,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${createdProducts.length} Products!`);

    console.log('Seeding Banners and Coupons...');
    await Banner.insertMany(bannersData);
    await Coupon.insertMany(couponsData);

    console.log('Seeding Sample Verified Reviews...');
    // Look products up by SKU so reordering the dataset cannot mismatch a review.
    const bySku = (sku) => createdProducts.find((p) => p.sku === sku);
    const sampleProduct1 = bySku('MEN-SHIRT-01');
    const sampleProduct2 = bySku('WMN-DRES-09');

    await Review.create({
      user: standardUser._id,
      product: sampleProduct1._id,
      rating: 5,
      comment: 'Exceptional quality! The oxford cotton is thick without being stiff and the tailored fit is spot on. Fast shipping too.',
    });

    await Review.create({
      user: standardUser._id,
      product: sampleProduct2._id,
      rating: 5,
      comment: 'The midi dress drapes beautifully and the hidden pockets are a lovely touch. True to size.',
    });

    console.log('----------------------------------------------------');
    console.log('SUCCESS: Database successfully populated with realistic data!');
    console.log('Admin Email   : admin@bazaro.com');
    console.log('Admin Password: Admin@123456');
    console.log('User Email    : user@bazaro.com');
    console.log('User Password : User@123456');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Banner.deleteMany();

    console.log('[Seeder]: All database data destroyed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
