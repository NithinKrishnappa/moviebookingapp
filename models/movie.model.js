const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  theatre: {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  show_timing: {
    type: Date,
    required: true,
  },
  available_seats: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
});

const movieSchema = new mongoose.Schema({
  movieid: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  published: {
    type: Boolean,
    required: true,
  },
  released: {
    type: Boolean,
    required: true,
  },
  poster_url: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/[^\s]+$/, // Validates URL format
  },
  release_date: {
    type: Date,
    required: true,
  },
  publish_date: {
    type: Date,
    required: true,
  },
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist', // References the Artist model
      required: true,
    },
  ],
  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre', // References the Genre model
      required: true,
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  critic_rating: {
    type: Number,
    required: true,
  },
  trailer_url: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/[^\s]+$/, // Validates URL format
  },
  wiki_url: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/[^\s]+$/, // Validates URL format
  },
  story_line: {
    type: String,
    required: true,
  },
  shows: {
    type: [showSchema],
    required: true,
  },
});

module.exports = mongoose.model('Movie', movieSchema);