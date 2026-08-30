const express = require("express");
const Book = require("../models/Book");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET ALL BOOKS
// GET /api/books
// Public
// =====================================================

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

// =====================================================
// GET ONE BOOK
// GET /api/books/:id
// Public
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

// =====================================================
// ADD BOOK
// POST /api/books
// ADMIN ONLY
// =====================================================

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    if (
      !title ||
      !author ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        message: "Please provide all required book information",
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      category,
      image,
      stock,
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("ADD BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE BOOK
// PUT /api/books/:id
// ADMIN ONLY
// =====================================================

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    if (
      !title ||
      !author ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        message: "Please provide all required book information",
      });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        description,
        price,
        category,
        image,
        stock,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
});

// =====================================================
// DELETE BOOK
// DELETE /api/books/:id
// ADMIN ONLY
// =====================================================

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
});

module.exports = router;