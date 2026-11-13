
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} = require("../controllers/paymentController");

router.post("/initiate", protect, initiatePayment);

// SSLCOMMERZ callbacks
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);

module.exports = router;
