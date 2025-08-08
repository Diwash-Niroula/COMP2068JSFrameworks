// Defines the structure for plant data in MongoDB

const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    trim: true
  },
  wateringFrequency: {
    type: String,
    trim: true
  },
  sunlight: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Plant', PlantSchema);
