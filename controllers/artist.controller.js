const Artist = require('../models/artist.model');

// Fetch all artists
exports.findAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json({artists:artists});
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving artists', error });
  }
};
