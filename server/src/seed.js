const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server root folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Contact = require('./models/Contact');
const connectDB = require('./config/db');

const dummyData = {
  "users": [
    {
      "_id": "661a001a11aa22bb33cc4401",
      "name": "Virat Sharma",
      "email": "virat@example.com",
      "password": "Virat@123",
      "avatar": "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      "_id": "661a001a11aa22bb33cc4402",
      "name": "Ananya Rao",
      "email": "ananya@example.com",
      "password": "Ananya@123",
      "avatar": "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ],

  "contacts": [
    {
      "user": "661a001a11aa22bb33cc4401",
      "name": "Rahul Mehta",
      "phone": "9876543210",
      "email": "rahul.mehta@gmail.com",
      "company": "Infosys",
      "address": "Bangalore, Karnataka",
      "tags": ["Work", "Developer"],
      "favorite": true,
      "profileImage": "https://randomuser.me/api/portraits/men/11.jpg"
    },
    {
      "user": "661a001a11aa22bb33cc4401",
      "name": "Sneha Kapoor",
      "phone": "9123456780",
      "email": "sneha.kapoor@gmail.com",
      "company": "TCS",
      "address": "Hyderabad, Telangana",
      "tags": ["Friend"],
      "favorite": false,
      "profileImage": "https://randomuser.me/api/portraits/women/21.jpg"
    },
    {
      "user": "661a001a11aa22bb33cc4401",
      "name": "Arjun Reddy",
      "phone": "9988776655",
      "email": "arjun.reddy@wipro.com",
      "company": "Wipro",
      "address": "Chennai, Tamil Nadu",
      "tags": ["Work", "Manager"],
      "favorite": true,
      "profileImage": "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      "user": "661a001a11aa22bb33cc4401",
      "name": "Meera Joshi",
      "phone": "9765432109",
      "email": "meera.joshi@gmail.com",
      "company": "Amazon",
      "address": "Mumbai, Maharashtra",
      "tags": ["HR", "Work"],
      "favorite": true,
      "profileImage": "https://randomuser.me/api/portraits/women/48.jpg"
    },

    {
      "user": "661a001a11aa22bb33cc4402",
      "name": "Aisha Khan",
      "phone": "9090909090",
      "email": "aisha.khan@gmail.com",
      "company": "Google",
      "address": "Noida, Uttar Pradesh",
      "tags": ["Designer", "Friend"],
      "favorite": true,
      "profileImage": "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      "user": "661a001a11aa22bb33cc4402",
      "name": "Nikhil Patil",
      "phone": "9556677889",
      "email": "nikhil.patil@meta.com",
      "company": "Meta",
      "address": "Bangalore, Karnataka",
      "tags": ["Tech"],
      "favorite": false,
      "profileImage": "https://randomuser.me/api/portraits/men/63.jpg"
    },
    {
      "user": "661a001a11aa22bb33cc4402",
      "name": "Divya Iyer",
      "phone": "9445566778",
      "email": "divya.iyer@gmail.com",
      "company": "Adobe",
      "address": "Coimbatore, Tamil Nadu",
      "tags": ["Marketing"],
      "favorite": true,
      "profileImage": "https://randomuser.me/api/portraits/women/56.jpg"
    },
    {
      "user": "661a001a11aa22bb33cc4402",
      "name": "Rohit Das",
      "phone": "9871234560",
      "email": "rohit.das@flipkart.com",
      "company": "Flipkart",
      "address": "Delhi, India",
      "tags": ["Team"],
      "favorite": false,
      "profileImage": "https://randomuser.me/api/portraits/men/29.jpg"
    }
  ]
};

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Clearing old instances matching seed emails...');
    const userEmails = dummyData.users.map(u => u.email);
    const userIds = dummyData.users.map(u => u._id);

    // Delete existing contacts belonging to these user ids
    await Contact.deleteMany({ user: { $in: userIds } });
    // Delete existing users
    await User.deleteMany({ email: { $in: userEmails } });

    console.log('Inserting seed users...');
    for (const u of dummyData.users) {
      // Create user using document instantiation so pre-save password-hashing hook triggers
      const newUser = new User(u);
      await newUser.save();
    }
    console.log('Seed users successfully created.');

    console.log('Inserting seed contacts...');
    await Contact.insertMany(dummyData.contacts);
    console.log('Seed contacts successfully created.');

    console.log('Database Seeding Successful.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedDB();
