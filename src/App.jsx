
import { Routes, Route, Link, useSearchParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Books from "./pages/Books";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container text-center py-5">
      <h2 className="text-success mb-3">Payment Successful!</h2>
      <p>Your payment has been verified successfully.</p>

      {orderId && (
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
      )}

      <Link to="/orders" className="btn btn-primary mt-3">
        View My Orders
      </Link>
    </div>
  );
}

function PaymentFailed() {
  return (
    <div className="container text-center py-5">
      <h2 className="text-danger mb-3">Payment Failed</h2>
      <p>Your payment could not be completed.</p>

      <Link to="/cart" className="btn btn-primary mt-3">
        Return to Cart
      </Link>
    </div>
  );
}

function PaymentCancelled() {
  return (
    <div className="container text-center py-5">
      <h2 className="text-warning mb-3">Payment Cancelled</h2>
      <p>You cancelled the payment process.</p>

      <Link to="/cart" className="btn btn-primary mt-3">
        Return to Cart
      </Link>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Payment result pages */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
