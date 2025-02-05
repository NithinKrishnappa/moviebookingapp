const Movie = require('../models/movie.model');

exports.findAllMovies = async(req,res) =>{
    try{
        let filter = {};
        if (req.query.status) {
          const status = req.query.status.toUpperCase();
          if (status === 'PUBLISHED') {
            filter.published = true;
          } else if (status === 'RELEASED') {
            filter.released = true;
          }
        }
        if(req.query.title) filter.title = new RegExp(req.query.title, 'i');
        if(req.query.genres) filter.genres = { $in: req.query.genres.split(',') };
        if (req.query.artists) {
        filter['artists.first_name'] = { $in: req.query.artists.split(',') };
    }
    if (req.query.start_date && req.query.end_date) {
      filter.release_date = {
        $gte: new Date(req.query.start_date),
        $lte: new Date(req.query.end_date),
      };
    }

    const movies = await Movie.find(filter).populate('artists genres');
    res.status(200).json({movies:movies});
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving movies', error });
  }
};

// Fetch details of a movie by ID

exports.findOne = async (req, res) => {
    try {
        const movieId = req.params.movieId; // Extract movieId from URL params
        const movie = await Movie.findOne({ movieid: movieId }).populate(
          'artists genres'
        );

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving movie", error: error.message });
    }
};
// 

// Fetch show details of a specific movie by ID
exports.findShows = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findOne({ movieid: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie.shows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving shows', error });
  }
};

