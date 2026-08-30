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

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);
      setMessage("");

      const response = await fetch(
        "https://bookverse-backend-hy7j.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              book: item._id,
              title: item.title,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to place order"
        );
        return;
      }

      clearCart();

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">

        <h1 className="mb-4">
          🛒 Shopping Cart
        </h1>

        <div className="alert alert-info">
          Your cart is currently empty.
        </div>

        <Link
          to="/books"
          className="btn btn-primary"
        >
          Browse Books
        </Link>

      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1>
          🛒 Shopping Cart
        </h1>

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

                    <h5>
                      {item.title}
                    </h5>

                    <p className="text-muted mb-1">
                      {item.author}
                    </p>

                    <strong>
                      ৳{item.price}
                    </strong>

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
                      ৳
                      {(item.price || 0) *
                        item.quantity}
                    </strong>

                  </div>

                  <div className="col-md-1">

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        removeFromCart(item._id)
                      }
                    >
                      ×
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* ORDER SUMMARY */}

        <div className="col-md-4">

          <div className="card shadow-sm">

            <div className="card-body">

              <h4 className="mb-4">
                Order Summary
              </h4>

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Items
                </span>

                <span>
                  {cart.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}
                </span>

              </div>

              <hr />

              <div className="d-flex justify-content-between">

                <strong>
                  Total
                </strong>

                <strong className="text-primary">
                  ৳{total}
                </strong>

              </div>

              <button
                className="btn btn-success w-100 mt-4"
                onClick={handleCheckout}
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Proceed to Checkout"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;
