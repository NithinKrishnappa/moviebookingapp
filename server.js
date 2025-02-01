const express = require('express');
const cors = require('cors')

const artistRoutes = require('./routes/artist.routes');
const genreRoutes = require('./routes/genre.routes');
const movieRoutes = require('./routes/movie.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const mongoose = require("mongoose");
const { mongoURI } = require("./config/db.config"); // Import dbConfig

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Cannot connect to the database!", err);
    process.exit(1); // Exit the process with an error code
  });


app.get("/", (req, res) => {
  res.json({ message: "Welcome to Upgrad Movie booking application development." });
});

app.use('/api', artistRoutes);
app.use('/api', genreRoutes);
app.use('/api', movieRoutes);
app.use('/api', userRoutes);

// app.get('/movies',(req,res)=>{
//     res.send("All Movies Data in JSON format from Mongo DB");
// })

// app.get('/genres',(req,res)=>{
//     res.send("All Genres Data in JSON format from Mongo DB");
// })

// app.get('/artists',(req,res)=>{
//     res.send("All Artists Data in JSON format from Mongo DB");
// })


const PORT = 8085;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});