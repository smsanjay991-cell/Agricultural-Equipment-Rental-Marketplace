const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌾 AgriRent Backend API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log("✅ SERVER IS LISTENING...");
});

