const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌾 AgriRent Backend API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
