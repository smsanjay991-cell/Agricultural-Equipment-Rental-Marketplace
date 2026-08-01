const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Equipment category is required'],
      enum: ['Tractor', 'Harvester', 'Tiller', 'Seeder', 'Sprayer', 'Attachment', 'Other']
    },
    description: {
      type: String,
      required: [true, 'Equipment description is required']
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rental rate is required'],
      min: [0, 'Daily rate cannot be negative']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    horsepower: {
      type: Number,
      default: 0
    },
    fuelType: {
      type: String,
      default: 'Diesel'
    },
    isDriverAvailable: {
      type: Boolean,
      default: false
    },
    driverRatePerDay: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    images: [
      {
        type: String
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
