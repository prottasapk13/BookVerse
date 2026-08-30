const express = require("express");
const router = express.Router();

const User = require("../models/User");

// =====================================================
// PUBLIC CATEGORIES
// =====================================================

router.get("/public-categories", (req, res) => {
  res.json([
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Biography",
  ]);
});

// =====================================================
// GET ALL USERS
// =====================================================

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;