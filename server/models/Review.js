const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating must be between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
