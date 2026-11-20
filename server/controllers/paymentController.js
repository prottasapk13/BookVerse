
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Book = require("../models/Book");

const AAMARPAY_BASE_URL =
  process.env.AAMARPAY_BASE_URL || "https://sandbox.aamarpay.com";

const AAMARPAY_PAYMENT_URL = `${AAMARPAY_BASE_URL}/jsonpost.php`;

const AAMARPAY_VERIFY_URL = `${AAMARPAY_BASE_URL}/api/v1/trxcheck/request.php`;

// Verify payment directly with aamarPay.
const validateTransaction = async (transactionId, order) => {
  const params = new URLSearchParams({
    request_id: transactionId,
    store_id: process.env.AAMARPAY_STORE_ID,
    signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
    type: "json",
  });

  const response = await fetch(`${AAMARPAY_VERIFY_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Could not contact aamarPay verification service.");
  }

  const result = await response.json();

  const validStatus =
    String(result.status_code) === "2" &&
    String(result.pay_status).toLowerCase() === "successful";

  const matchingTransaction = result.mer_txnid === order.transactionId;

  const paidAmount = Number(result.amount_bdt || result.amount);
  const matchingAmount =
    Number.isFinite(paidAmount) &&
    paidAmount.toFixed(2) === Number(order.totalAmount).toFixed(2);

  const matchingCurrency =
    (result.currency || result.currency_merchant) === "BDT";

  const matchingStore =
    result.store_id === process.env.AAMARPAY_STORE_ID;

  if (
    !validStatus ||
    !matchingTransaction ||
    !matchingAmount ||
    !matchingCurrency ||
    !matchingStore
  ) {
    throw new Error("Payment verification failed.");
  }

  return result;
};

// Mark order as paid and reduce stock only once.
const completePaidOrder = async (orderId) => {
  const session = await mongoose.startSession();

  try {
    let completedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw new Error("Order not found.");
      }

      if (order.paymentStatus === "Paid") {
        completedOrder = order;
        return;
      }

      if (order.paymentStatus !== "Unpaid") {
        throw new Error("This order is not awaiting payment.");
      }

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
          throw new Error(`Not enough stock for ${item.title}.`);
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

// Initiate aamarPay payment.
const initiatePayment = async (req, res) => {
  let order;

  try {
    const { items, phone, address, city, postcode } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
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
      !process.env.AAMARPAY_STORE_ID ||
      !process.env.AAMARPAY_SIGNATURE_KEY
    ) {
      return res.status(500).json({
        message: "aamarPay credentials are missing.",
      });
    }

    const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");

    if (!backendUrl || !frontendUrl) {
      return res.status(500).json({
        message: "Backend or frontend URL is missing.",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.book)) {
        return res.status(400).json({ message: "Invalid book ID." });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid book quantity." });
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

    // Create unpaid order.
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

    // Prepare aamarPay JSON request.
    const paymentData = {
      store_id: process.env.AAMARPAY_STORE_ID,
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
      tran_id: transactionId,
      amount: totalAmount.toFixed(2),
      currency: "BDT",
      desc: "BookVerse Book Order",
      cus_name: req.user.name || "BookVerse Customer",
      cus_email: req.user.email || "customer@example.com",
      cus_phone: phone.trim(),
      cus_add1: address.trim(),
      cus_city: city.trim(),
      cus_postcode: postcode.trim(),
      cus_country: "Bangladesh",
      success_url: `${backendUrl}/api/payment/success`,
      fail_url: `${backendUrl}/api/payment/fail`,
      cancel_url: `${backendUrl}/api/payment/cancel`,
      type: "json",
    };

    const response = await fetch(AAMARPAY_PAYMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (
      !response.ok ||
      String(result.result).toLowerCase() !== "true" ||
      !result.payment_url
    ) {
      console.error("aamarPay initiation response:", result);

      order.paymentStatus = "Failed";
      await order.save();

      return res.status(502).json({
        message: "Could not create a payment session.",
        details: result.message || result.error || "Please try again.",
      });
    }

    return res.status(200).json({
      message: "Payment session created.",
      paymentUrl: result.payment_url,
      orderId: order._id,
    });
  } catch (error) {
    console.error("aamarPay initiation error:", error);

    if (order && order.paymentStatus === "Unpaid") {
      order.paymentStatus = "Failed";
      await order.save().catch(console.error);
    }

    return res.status(500).json({
      message: error.message || "Payment initiation failed.",
    });
  }
};

// Handle successful payment callback.
const paymentSuccess = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL;

  try {
    const transactionId = req.body.mer_txnid;

    if (!transactionId) {
      return res.redirect(`${frontendUrl}/payment/failed`);
    }

    const order = await Order.findOne({
      transactionId,
    });

    if (!order) {
      return res.redirect(`${frontendUrl}/payment/failed`);
    }

    await validateTransaction(transactionId, order);
    await completePaidOrder(order._id);

    return res.redirect(
      `${frontendUrl}/payment/success?orderId=${order._id}`
    );
  } catch (error) {
    console.error("aamarPay success verification error:", error);
    return res.redirect(`${frontendUrl}/payment/failed`);
  }
};

// Handle failed payment.
const paymentFail = async (req, res) => {
  try {
    const transactionId = req.body.mer_txnid;

    if (transactionId) {
      await Order.updateOne(
        {
          transactionId,
          paymentStatus: "Unpaid",
        },
        {
          $set: { paymentStatus: "Failed" },
        }
      );
    }
  } catch (error) {
    console.error("aamarPay failure callback error:", error);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
};

// Handle cancelled payment.
const paymentCancel = async (req, res) => {
  try {
    const transactionId = req.body.mer_txnid;

    if (transactionId) {
      await Order.updateOne(
        {
          transactionId,
          paymentStatus: "Unpaid",
        },
        {
          $set: { paymentStatus: "Failed" },
        }
      );
    }
  } catch (error) {
    console.error("aamarPay cancellation callback error:", error);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled`);
};

// Optional notification handler.
const paymentIPN = async (req, res) => {
  try {
    const transactionId = req.body.mer_txnid;

    if (!transactionId) {
      return res.status(400).send("Missing transaction ID.");
    }

    const order = await Order.findOne({ transactionId });

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    await validateTransaction(transactionId, order);
    await completePaidOrder(order._id);

    return res.status(200).send("Payment verified.");
  } catch (error) {
    console.error("aamarPay notification error:", error);
    return res.status(400).send("Payment could not be verified.");
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};
