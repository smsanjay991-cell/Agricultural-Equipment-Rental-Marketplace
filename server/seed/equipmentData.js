const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Category = require('../models/Category');
const connectDB = require('../config/db');

const sampleEquipment = [
  {
    name: 'John Deere 5050D 50HP Tractor',
    category: 'Tractor',
    description: 'Heavy duty 50HP tractor with power steering, oil immersed brakes, and dual clutch. Ideal for tilling, ploughing, and heavy haulage.',
    dailyRate: 1500,
    location: 'Ludhiana, Punjab',
    horsepower: 50,
    fuelType: 'Diesel',
    isDriverAvailable: true,
    driverRatePerDay: 400,
    images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Kubota Harvester DC-68G-HK',
    category: 'Harvester',
    description: 'High capacity paddy & wheat combine harvester with 68HP engine. Ensures minimum grain loss and clean harvesting in wet fields.',
    dailyRate: 3500,
    location: 'Karnal, Haryana',
    horsepower: 68,
    fuelType: 'Diesel',
    isDriverAvailable: true,
    driverRatePerDay: 500,
    images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Mahindra Rotary Tiller (Rotavator 6 feet)',
    category: 'Tiller',
    description: 'Heavy duty 6 feet rotavator for fine seedbed preparation. Reduces fuel consumption and soil compaction.',
    dailyRate: 800,
    location: 'Nashik, Maharashtra',
    horsepower: 45,
    fuelType: 'N/A',
    isDriverAvailable: false,
    driverRatePerDay: 0,
    images: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Fieldking Pneumatic Precision Seeder',
    category: 'Seeder',
    description: 'Automatic pneumatic planter for corn, cotton, and soybean precision sowing with exact seed spacing.',
    dailyRate: 1200,
    location: 'Indore, Madhya Pradesh',
    horsepower: 35,
    fuelType: 'N/A',
    isDriverAvailable: true,
    driverRatePerDay: 300,
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'ASPEE 500L Tractor Mounted Boom Sprayer',
    category: 'Sprayer',
    description: '500-liter capacity boom sprayer with 12m spray width for rapid pesticide and liquid fertilizer application.',
    dailyRate: 950,
    location: 'Guntur, Andhra Pradesh',
    horsepower: 40,
    fuelType: 'Diesel',
    isDriverAvailable: true,
    driverRatePerDay: 350,
    images: ['https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80']
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding initial categories into MySQL...');
    const categories = ['Tractor', 'Harvester', 'Tiller', 'Seeder', 'Sprayer', 'Attachment', 'Other'];
    for (const cat of categories) {
      await Category.create(cat, `${cat} equipment category`);
    }

    console.log('Clearing old equipment data from MySQL...');
    await Equipment.deleteMany();

    // Ensure demo owner user exists
    let owner = await User.findByEmail('owner@agrirent.com');
    if (!owner) {
      owner = await User.create({
        name: 'Ram Singh (Fleet Owner)',
        email: 'owner@agrirent.com',
        password: 'password123',
        phone: '+91 98765 43210',
        role: 'owner',
        location: 'Ludhiana, Punjab'
      });
    }

    // Ensure demo farmer user exists
    let farmer = await User.findByEmail('farmer@agrirent.com');
    if (!farmer) {
      await User.create({
        name: 'Kisan Kumar (Farmer)',
        email: 'farmer@agrirent.com',
        password: 'password123',
        phone: '+91 91234 56789',
        role: 'farmer',
        location: 'Amritsar, Punjab'
      });
    }

    // Ensure demo admin user exists
    let admin = await User.findByEmail('admin@agrirent.com');
    if (!admin) {
      await User.create({
        name: 'System Admin',
        email: 'admin@agrirent.com',
        password: 'password123',
        phone: '+91 99999 88888',
        role: 'admin',
        location: 'Chandigarh, UT'
      });
    }

    const equipmentWithOwner = sampleEquipment.map(item => ({
      ...item,
      owner: owner._id || owner.id
    }));

    await Equipment.insertMany(equipmentWithOwner);
    console.log('🌱 Sample Equipment & Users Seeded Successfully into MySQL!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error Seeding Data: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = sampleEquipment;
