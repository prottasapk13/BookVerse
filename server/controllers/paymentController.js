
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Book = require("../models/Book");

// SSLCOMMERZ sandbox validation endpoint
const VALIDATION_URL =
  "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

// Verify a transaction directly with SSLCOMMERZ
const validateTransaction = async (valId, order) => {
  if (!valId) {
    throw new Error("Payment validation ID is missing.");
  }

  const params = new URLSearchParams({
    val_id: valId,
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    format: "json",
  });

  const response = await fetch(`${VALIDATION_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Could not contact the payment validation service.");
  }

  const result = await response.json();

  const validStatus = ["VALID", "VALIDATED"].includes(result.status);
  const matchingTransaction = result.tran_id === order.transactionId;
  const matchingAmount =
    Number(result.amount).toFixed(2) === Number(order.totalAmount).toFixed(2);
  const matchingCurrency = result.currency === "BDT";

  if (
    !validStatus ||
    !matchingTransaction ||
    !matchingAmount ||
    !matchingCurrency
  ) {
    throw new Error("Payment verification failed.");
  }

  return result;
};

// Mark an order as paid and reduce its book stock.
// This function is safe to call more than once for the same transaction.
const completePaidOrder = async (orderId) => {
  const session = await mongoose.startSession();

  try {
    let completedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw new Error("Order not found.");
      }

      // Prevent duplicate callbacks from reducing stock again.
      if (order.paymentStatus === "Paid") {
        completedOrder = order;
        return;
      }

      if (order.paymentStatus !== "Unpaid") {
        throw new Error("This order is not awaiting payment.");
      }

      // Reduce stock only after payment has been verified.
      for (const item of order.items) {
        const stockUpdate = await Book.updateOne(
          {
            _id: item.book,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `Not enough stock available for ${item.title}.`
          );
        }
      }

      order.paymentStatus = "Paid";
      order.status = "Pending";

      await order.save({ session });

      completedOrder = order;
    });

    return completedOrder;
  } finally {
    await session.endSession();
  }
};

// Create a payment session
const initiatePayment = async (req, res) => {
  let order;

  try {
    const { items, phone, address, city, postcode } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    if (!phone || !/^[0-9]{11}$/.test(phone.trim())) {
      return res.status(400).json({
        message: "Please provide a valid 11-digit phone number.",
      });
    }

    if (!address?.trim() || !city?.trim() || !postcode?.trim()) {
      return res.status(400).json({
        message: "Please provide your complete delivery address.",
      });
    }

    if (
      !process.env.SSLCOMMERZ_STORE_ID ||
      !process.env.SSLCOMMERZ_STORE_PASSWORD
    ) {
      return res.status(500).json({
        message: "Payment gateway credentials are missing.",
      });
    }

    const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");

    if (!backendUrl || !frontendUrl) {
      return res.status(500).json({
        message: "Backend or frontend URL is missing from environment settings.",
      });
    }

    // Calculate the total using prices from the database.
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.book)) {
        return res.status(400).json({
          message: "Invalid book ID.",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Invalid book quantity.",
        });
      }

      const book = await Book.findById(item.book);

      if (!book) {
        return res.status(404).json({
          message: "A book in your cart could not be found.",
        });
      }

      if (book.stock < quantity) {
        return res.status(400).json({
          message: `${book.title} does not have enough stock.`,
        });
      }

      const price = Number(book.price);

      orderItems.push({
        book: book._id,
        title: book.title,
        price,
        quantity,
      });

      totalAmount += price * quantity;
    }

    totalAmount = Number(totalAmount.toFixed(2));

    if (totalAmount < 10 || totalAmount > 500000) {
      return res.status(400).json({
        message: "Payment amount must be between 10 and 500000 BDT.",
      });
    }

    // Create an unpaid order first.
    order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      status: "Pending",
      paymentStatus: "Unpaid",
      deliveryAddress: {
        address: address.trim(),
        city: city.trim(),
        postcode: postcode.trim(),
        phone: phone.trim(),
      },
    });

    const transactionId = `BV${order._id}`;

    order.transactionId = transactionId;
    await order.save();

    // Send payment information to SSLCOMMERZ.
    const paymentData = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: totalAmount.toFixed(2),
      currency: "BDT",
      tran_id: transactionId,

      success_url: `${backendUrl}/api/payment/success`,
      fail_url: `${backendUrl}/api/payment/fail`,
      cancel_url: `${backendUrl}/api/payment/cancel`,
      ipn_url: `${backendUrl}/api/payment/ipn`,

      cus_name: req.user.name || "BookVerse Customer",
      cus_email: req.user.email || "customer@example.com",
      cus_add1: address.trim(),
      cus_city: city.trim(),
      cus_postcode: postcode.trim(),
      cus_country: "Bangladesh",
      cus_phone: phone.trim(),

      shipping_method: "NO",
      product_name: "BookVerse Books",
      product_category: "Books",
      product_profile: "general",
    });

    const response = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: paymentData,
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      result.status !== "SUCCESS" ||
      !result.GatewayPageURL
    ) {
      order.paymentStatus = "Failed";
      await order.save();

      return res.status(502).json({
        message: "Could not create a payment session.",
        details: result.failedreason || "Please try again.",
      });
    }

    return res.status(200).json({
      message: "Payment session created.",
      paymentUrl: result.GatewayPageURL,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    // If an order was created but payment setup failed, mark it failed.
    if (order && order.paymentStatus === "Unpaid") {
      order.paymentStatus = "Failed";
      await order.save().catch((saveError) => {
        console.error("Could not update failed order:", saveError);
      });
    }

    return res.status(500).json({
      message: error.message || "Payment initiation failed.",
    });
  }
};

// Handle successful payment callback
const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;

    if (!tran_id || !val_id) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed`
      );
    }

    const order = await Order.findOne({
      transactionId: tran_id,
    });

    if (!order) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed`
      );
    }

    await validateTransaction(val_id, order);
    await completePaidOrder(order._id);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`
    );
  } catch (error) {
    console.error("Payment success verification error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/failed`
    );
  }
};

// Handle failed payment callback
const paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      await Order.updateOne(
        {
          transactionId: tran_id,
          paymentStatus: "Unpaid",
        },
        {
          $set: { paymentStatus: "Failed" },
        }
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/failed`
    );
  } catch (error) {
    console.error("Payment failure callback error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/failed`
    );
  }
};

// Handle cancelled payment callback
const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      await Order.updateOne(
        {
          transactionId: tran_id,
          paymentStatus: "Unpaid",
        },
        {
          $set: { paymentStatus: "Failed" },
        }
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/cancelled`
    );
  } catch (error) {
    console.error("Payment cancellation callback error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/cancelled`
    );
  }
};

// Handle SSLCOMMERZ Instant Payment Notification
const paymentIPN = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;

    if (!tran_id || !val_id) {
      return res.status(400).send("Missing transaction information.");
    }

    const order = await Order.findOne({
      transactionId: tran_id,
    });

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    await validateTransaction(val_id, order);
    await completePaidOrder(order._id);

    return res.status(200).send("Payment notification processed.");
  } catch (error) {
    console.error("Payment IPN error:", error);

    return res.status(400).send("Payment notification could not be verified.");
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};
