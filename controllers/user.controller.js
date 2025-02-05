const User = require('../models/user.model');
const Movie = require('../models/movie.model');
const uuidTokenGenerator = require("uuid-token-generator");
const { v4: uuidv4 } = require('uuid');
const b2a = require("b2a");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Change this in production

// Sign Up (Create a user)
exports.signUp = async (req, res) => {
  try {
    const { email, first_name, last_name, contact, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const userid = (await User.find()).length + 1;
    const newUser = new User({
      userid: userid, // Generate a unique user ID
      email,
      first_name,
      last_name,
      username:first_name + " " + last_name,
      contact,
      password,
      role: role || 'user', // Default role is 'user'
      isLoggedIn: false,
      uuid: '',
      accesstoken: '',
      coupens: [],
      bookingRequests: [],
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
};

// Login (Authenticate user)
exports.login = async (req, res) => {


  try {
    let authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Basic ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    // Decode Base64 credentials
    const credentials = Buffer.from(authorization.split(" ")[1], "base64").toString("utf-8");
    const [email, password] = credentials.split(":");

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Verify password using bcrypt
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const uuid = uuidv4();
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, uuid },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Update user login status
    user.isLoggedIn = true;
    user.uuid = uuid;
    await user.save();

    res.setHeader("access-token", jwtToken);
    return res.status(200).json({
      message: "Login successful",
      id: uuid,
      "access-token": jwtToken,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }

  // try {
  //   let authorization = req.headers.authorization;
  //   let userdetail = b2a.atob(authorization.split(" ")[1]);
  //   const email = userdetail.split(":")[0];
  //   const password = userdetail.split(":")[1];

  //   const user = await User.findOne({ email: email });
  //   if (!user) {
  //     return res.status(400).json({ message: "Invalid email or password" });
  //   }

  //   if (user.password !== password) {
  //     return res.status(400).json({ message: "Invalid email or password" });
  //   }
  //   const uuid = uuidv4();
  //   const tokgen = new uuidTokenGenerator(256, uuidTokenGenerator.BASE62);
  //   const token = tokgen.generate();

  //   const encodedUsername = b2a.btoa(user.username);
  //   const encodedPassword = b2a.btoa(password);

  //   // Generate JWT token
  //   const jwtToken = jwt.sign(
  //     {
  //       id: user._id,
  //       email: user.email,
  //       uuid,
  //       encodedUsername,
  //       encodedPassword,
  //     },
  //     secretKey
  //   );

  //   // Update user login status
  //   user.isLoggedIn = true;
  //   user.uuid = uuid;
  //   user.accesstoken = token;
  //   await user.save();
  //   res.setHeader("access-token", jwtToken);
  //   return res.status(200).json({
  //     message: "Login successful",
  //     id: uuid,
  //     "access-token": jwtToken,
  //   });
  //   // const { email, password } = req.body;

  //   // // Find user by email
  //   // const user = await User.findOne({ email });
  //   // if (!user) {
  //   //   return res.status(400).json({ message: 'Invalid credentials' });
  //   // }

  //   // // Compare passwords
  //   // if (user.password !== password) {
  //   //   return res.status(400).json({ message: 'Invalid Password' });
  //   // }

  //   // // Generate access token
  //   // const token = jwt.sign({ userid: user.userid, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  //   // // Update user session details
  //   // user.isLoggedIn = true;
  //   // user.uuid = uuidv4();
  //   // user.accesstoken = token;
  //   // await user.save();

  //   // res.status(200).json({ message: 'Login successful', token, user });
  // } catch (error) {
  //   res.status(500).json({ message: 'Error logging in', error });
  // }
};

// Logout (Remove session details)
exports.logout = async (req, res) => {
  try {
    const { userid } = req.body;

    // Find the user
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Reset login session
    user.isLoggedIn = false;
    user.uuid = '';
    user.accesstoken = '';
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
}

// Get Coupon Code
exports.getCouponCode = async (req, res) => {
  try {
    let authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    await jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return;
      }
      const email = decoded.email;
      const coupons = await User.findOne(
        { email: email },
        { coupens: 1, _id: 0 }
      );
      let coupen = coupons.coupens.filter(
        (coupen) => coupen.id === parseInt(req.query.code)
      );
      if (coupen.length === 0) {
        return res.status(400).json({ error: "Not a valid Coupon" });
      }
      res.status(200).json({ discountValue: coupen[0].discountValue });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Getting Coupons", error: error.message });
  }
    // try {
    //   const { userid } = req.query;
  
    //   if (!userid) {
    //     return res.status(400).json({ message: 'User ID is required' });
    //   }
  
    //   const user = await User.findOne({ userid });
  
    //   if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }
  
    //   return res.status(200).json({ coupons: user.coupens });
    // } catch (error) {
    //   return res.status(500).json({ message: 'Internal server error', error: error.message });
    // }
  };
  
  // Book Show
  exports.bookShow = async (req, res) => {
    try {
      let authorization = req.headers.authorization;
      const token = authorization.split(" ")[1];
      await jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err);
          return;
        }
        const email = decoded.email;
        let user = await User.findOne({ email: email });
        const { bookingRequest } = req.body;
        const shows = await Movie.findOne(
          {
            "shows.id": bookingRequest.show_id,
          },
          { shows: 1 }
        );
  
        let show = shows.shows.filter(
          (show) => show.id == bookingRequest.show_id
        );
        if (show.length == 0) {
          return res.status(400).json({ error: "Invalid Show ID" });
        }
        bookingRequest.reference_number = user.bookingRequests.length + 1;
        user.bookingRequests.push(bookingRequest);
        await user.save();
  
        show[0].available_seats =
          show[0].available_seats - bookingRequest.tickets[0];
        await shows.save();
        res
          .status(201)
          .json({ reference_number: bookingRequest.reference_number });
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error Booking Tickets", error: error.message });
    }
    // try {
    //   const { userid, show_id, tickets, coupon_code } = req.body;
  
    //   if (!userid || !show_id || !tickets) {
    //     return res.status(400).json({ message: 'User ID, Show ID, and Tickets are required' });
    //   }
  
    //   const user = await User.findOne({ userid });
  
    //   if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }
  
    //   const reference_number = Math.floor(Math.random() * 100000); // Generate a random reference number
  
    //   const newBooking = {
    //     reference_number,
    //     coupon_code: coupon_code || null,
    //     show_id,
    //     tickets
    //   };
  
    //   user.bookingRequests.push(newBooking);
    //   await user.save();
  
    //   return res.status(201).json({
    //     message: 'Booking successful',
    //     booking: newBooking
    //   });
    // } catch (error) {
    //   return res.status(500).json({ message: 'Internal server error', error: error.message });
    // }
  };