const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  genreid: {
    type: Number,
    required: true,
    unique: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
});

module.exports = mongoose.model('Genre', genreSchema);