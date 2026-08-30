const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Book = require("../models/Book");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// PLACE ORDER
// POST /api/orders
// ===============================

router.post("/", protect, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items } = req.body;

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    session.startTransaction();

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Validate item
      if (!item.book) {
        await session.abortTransaction();

        return res.status(400).json({
          message: "Invalid book in order",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        await session.abortTransaction();

        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      // Find book
      const book = await Book.findById(item.book).session(session);

      if (!book) {
        await session.abortTransaction();

        return res.status(404).json({
          message: `Book not found: ${item.title || "Unknown book"}`,
        });
      }

      // Check stock
      if (book.stock <= 0) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `${book.title} is out of stock`,
        });
      }

      if (quantity > book.stock) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `Not enough stock for ${book.title}. Available stock: ${book.stock}`,
        });
      }

      // Add item to order
      orderItems.push({
        book: book._id,
        title: book.title,
        price: book.price,
        quantity,
      });

      totalAmount += book.price * quantity;

      // Decrease stock
      book.stock -= quantity;

      await book.save({ session });
    }

    // Create order
    const order = await Order.create(
      [
        {
          user: req.user.id,
          items: orderItems,
          totalAmount,
          status: "Pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("PLACE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

// ===============================
// GET MY ORDERS
// GET /api/orders/my-orders
// ===============================

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("MY ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ===============================
// GET ALL ORDERS - ADMIN
// GET /api/orders
// ===============================

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE ORDER STATUS - ADMIN
// PUT /api/orders/:id
// ===============================

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
});

module.exports = router;