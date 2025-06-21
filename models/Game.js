const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platforms: [{
    type: String,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'Other'],
    required: true
  }],
  genre: [{
    type: String,
    required: true
  }],
  developer: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: false
  },
  screenshots: [{
    type: String
  }],
  systemRequirements: {
    minimum: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    },
    recommended: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    }
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
GameSchema.index({ title: 1 });
GameSchema.index({ rating: 1 });
GameSchema.index({ "price.amount": 1 });

module.exports = mongoose.model('Game', GameSchema);