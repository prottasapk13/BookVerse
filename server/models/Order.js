
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Customer who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Ordered books
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // Total order amount
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order delivery status
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Failed"],
      default: "Unpaid",
    },

    // SSLCOMMERZ transaction ID
    transactionId: {
      type: String,
      default: null,
    },

    // Customer delivery information
    deliveryAddress: {
      address: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      postcode: {
        type: String,
        trim: true,
      },

      phone: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
