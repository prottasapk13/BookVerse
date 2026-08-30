const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).send("BookVerse API is running!");
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "SERVER START ERROR:",
      error.message
    );

    process.exit(1);
  }
};

startServer();