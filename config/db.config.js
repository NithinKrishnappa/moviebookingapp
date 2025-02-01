const dbConfig = {
    mongoURI: "mongodb://localhost:27017/moviesdb", // Replace with your MongoDB URL
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };
  
  module.exports = dbConfig;