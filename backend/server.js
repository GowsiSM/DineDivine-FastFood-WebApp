const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema - email is now required
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", UserSchema);

// Register Route - now expects username, email, and password
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Registration request received:", { username, email, password: password ? '[HIDDEN]' : undefined });

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Username, email, and password are required" 
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      const conflictField = existingUser.username === username ? "Username" : "Email";
      console.log(`${conflictField} already exists:`, existingUser.username === username ? username : email);
      return res.status(409).json({ 
        success: false,
        error: `${conflictField} already exists` 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User registered successfully:", username);
    res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      username: newUser.username,
      email: newUser.email
    });
  } catch (err) {
    console.error("Error during registration:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "An error occurred during registration" 
    });
  }
});

// Login Route - can login with either username or email
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Login request received:", { username });

  try {
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Username/email and password are required" 
      });
    }

    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials for user:", username);
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Login successful for user:", username);
    res.json({ 
      success: true,
      token,
      username: user.username,
      email: user.email,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ 
      success: false,
      error: "An error occurred during login" 
    });
  }
});

// Protected route example
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ error: "Forbidden - invalid token" });
    }
    req.user = user;
    next();
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});