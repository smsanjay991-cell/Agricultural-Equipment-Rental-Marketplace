const mongoose = require('mongoose');
const dns = require('dns');

// Configure Node.js internal c-ares DNS resolver to use Google and Cloudflare DNS
// This resolves querySrv ECONNREFUSED issues on Jio Hotspot / local router DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrirent');
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
