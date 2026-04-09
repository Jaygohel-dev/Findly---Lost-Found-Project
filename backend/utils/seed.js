const path = require('path');
// This ensures the .env file is loaded from the root directory relative to this script
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Item = require('../models/item.model');
const logger = require('./logger');

const seed = async () => {
  const uri = process.env.MONGO_URI;

  // Validate the Connection String before attempting to connect
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    throw new Error('Invalid MONGO_URI. Please check your .env file and ensure it starts with "mongodb://" or "mongodb+srv://"');
  }

  try {
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB — Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    logger.info('Existing data cleared.');

    // Hash passwords for seed users
    const hashedAdmin = await bcrypt.hash('Admin@123', 12);
    const hashedUser  = await bcrypt.hash('User@1234', 12);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@findly.com',
      password: hashedAdmin,
      role: 'admin',
      phone: '+91 99999 00000',
      city: 'Ahmedabad',
    });

    // Create Users
    const users = await User.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@demo.com', password: hashedUser, city: 'Ahmedabad', phone: '+91 98765 43210' },
      { name: 'Priya Patel',  email: 'priya@demo.com', password: hashedUser, city: 'Surat',     phone: '+91 87654 32100' },
      { name: 'Arjun Mehta',  email: 'arjun@demo.com', password: hashedUser, city: 'Vadodara',  phone: '+91 76543 21000' },
    ]);

    // Create Items
    await Item.insertMany([
      { 
        type: 'lost', 
        title: 'Black Leather Wallet', 
        description: 'Lost near Maninagar Bus Stand. Contains Aadhaar and ₹800 cash.', 
        category: 'wallet', 
        color: 'Black', 
        brand: 'Woodland', 
        reward: '₹500 reward', 
        location: { address: 'Maninagar Bus Stand, Ahmedabad', lat: 23.0059, lng: 72.6012 }, 
        date: new Date('2024-06-10'), 
        owner: users[0]._id, 
        status: 'active' 
      },
      { 
        type: 'found', 
        title: 'Samsung Galaxy S21', 
        description: 'Found near Ahmedabad Railway Station platform 2. Screen cracked.', 
        category: 'electronics', 
        color: 'Black', 
        brand: 'Samsung', 
        location: { address: 'Ahmedabad Railway Station, Platform 2', lat: 23.0258, lng: 72.6021 }, 
        date: new Date('2024-06-11'), 
        owner: users[1]._id, 
        status: 'active' 
      },
      { 
        type: 'lost', 
        title: 'Honda City Car Keys', 
        description: 'Lost keys with a blue Eiffel Tower keychain.', 
        category: 'keys', 
        color: 'Silver', 
        brand: 'Honda', 
        reward: '₹1000 reward', 
        location: { address: 'Iscon Cross Road, Ahmedabad', lat: 23.0303, lng: 72.5053 }, 
        date: new Date('2024-06-09'), 
        owner: users[0]._id, 
        status: 'matched' 
      },
      { 
        type: 'found', 
        title: 'Blue Backpack with Laptop', 
        description: 'Found near CEPT University gate. Contains a laptop and books.', 
        category: 'bag', 
        color: 'Blue', 
        location: { address: 'CEPT University, Navrangpura, Ahmedabad' }, 
        date: new Date('2024-06-12'), 
        owner: users[1]._id, 
        status: 'active' 
      }
    ]);

    logger.info('✅ Database seeded successfully!');
    logger.info('─────────────────────────────────────');
    logger.info('  Admin : admin@findly.com  / Admin@123');
    logger.info('  User  : rahul@demo.com    / User@1234');
    logger.info('─────────────────────────────────────');

  } catch (err) {
    logger.error(`Seeding failed: ${err.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seed();