const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  artistid: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  wiki_url: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/[^\s]+$/, // Validates URL format
  },
  profile_url: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/[^\s]+$/, // Validates URL format
  },
  movies: {
    type: [mongoose.Schema.Types.ObjectId], // Array of movie IDs
    ref: 'Movie', // Reference to Movie model
    default: [],
  },
});

module.exports = mongoose.model('Artist', artistSchema);