const mongoose = require('mongoose');
const User = require('./models/User');
const Contact = require('./models/Contact');

const checkLocal = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/phonebook');
    console.log(`Connected to Local MongoDB: ${conn.connection.host}`);
    
    const users = await User.find({});
    console.log('LOCAL USERS:', users.map(u => ({ id: u._id, name: u.name, email: u.email })));
    
    const contacts = await Contact.find({});
    console.log('LOCAL CONTACTS:', contacts.map(c => ({ id: c._id, name: c.name, user: c.user })));
    
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to local DB:', error.message);
    process.exit(1);
  }
};

checkLocal();
