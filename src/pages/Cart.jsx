
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!/^[0-9]{11}$/.test(phone)) {
      setMessage("Please enter a valid 11-digit phone number.");
      return;
    }

    try {
      setPlacingOrder(true);
      setMessage("");

      const response = await fetch(
        "https://bookverse-backend-hy7j.onrender.com/api/payment/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              book: item._id,
              quantity: item.quantity,
            })),
            phone,
            address,
            city,
            postcode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Payment initiation failed.");
        return;
      }

      if (!data.paymentUrl) {
        setMessage("Payment gateway URL was not received.");
        return;
      }

      // Redirect customer to SSLCOMMERZ
      window.location.href = data.paymentUrl;

    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      setMessage("Unable to connect to the server.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="mb-4">🛒 Shopping Cart</h1>

        <div className="alert alert-info">
          Your cart is currently empty.
        </div>

        <Link to="/books" className="btn btn-primary">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🛒 Shopping Cart</h1>

        <button
          className="btn btn-outline-danger"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div
              className="card mb-3 shadow-sm"
              key={item._id}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={
                        item.image ||
                        "https://picsum.photos/100/130"
                      }
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{
                        height: "120px",
                        width: "90px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <h5>{item.title}</h5>

                    <p className="text-muted mb-1">
                      {item.author}
                    </p>

                    <strong>৳{item.price}</strong>
                  </div>

                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span className="input-group-text">
                        {item.quantity}
                      </span>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <strong>
                      ৳{(item.price || 0) * item.quantity}
                    </strong>
                  </div>

                  <div className="col-md-1">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY AND CHECKOUT */}

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between mb-3">
                <span>Items</span>

                <span>
                  {cart.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>

                <strong className="text-primary">
                  ৳{total}
                </strong>
              </div>

              <hr />

              <h5 className="mb-3">
                Delivery Information
              </h5>

              <form onSubmit={handleCheckout}>
                <div className="mb-3">
                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{11}"
                    maxLength="11"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Street Address
                  </label>

                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="House, road, area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Postcode
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 mt-3"
                  disabled={placingOrder}
                >
                  {placingOrder
                    ? "Connecting to Payment..."
                    : "Pay with SSLCOMMERZ"}
                </button>
              </form>

              <p className="text-muted small mt-3 mb-0">
                You will be redirected to the secure payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
