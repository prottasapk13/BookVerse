import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://bookverse-backend-hy7j.onrender.com/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data);
      } catch (error) {
        console.error("ORDERS ERROR:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading your orders...</h3>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <a
          href="/login"
          className="btn btn-primary"
        >
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* Page Title */}
      <div className="mb-4">
        <h1>📦 My Orders</h1>
        <p className="text-muted">
          View your order history and order status.
        </p>
      </div>

      {/* No Orders */}
      {orders.length === 0 ? (
        <div className="text-center py-5">

          <div className="alert alert-info">
            You have not placed any orders yet.
          </div>

          <a
            href="/books"
            className="btn btn-primary"
          >
            Browse Books
          </a>

        </div>
      ) : (

        /* Orders */
        orders.map((order) => (
          <div
            className="card shadow-sm mb-4"
            key={order._id}
          >

            {/* Order Header */}
            <div className="card-header">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <strong>
                    Order #
                    {order._id
                      .slice(-6)
                      .toUpperCase()}
                  </strong>

                  <div className="text-muted small">
                    Placed on{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>

                <span
                  className={`badge ${
                    order.status === "Delivered"
                      ? "bg-success"
                      : order.status === "Cancelled"
                      ? "bg-danger"
                      : order.status === "Shipped"
                      ? "bg-primary"
                      : "bg-warning text-dark"
                  }`}
                >
                  {order.status}
                </span>

              </div>

            </div>

            {/* Order Body */}
            <div className="card-body">

              <h5 className="mb-3">
                Order Items
              </h5>

              {order.items.map((item, index) => (
                <div
                  className="row align-items-center border-bottom py-3"
                  key={index}
                >

                  {/* Book Name */}
                  <div className="col-md-6">
                    <strong>
                      {item.title}
                    </strong>

                    <div className="text-muted small">
                      Price: ৳{item.price}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-md-3">
                    <span>
                      Quantity:{" "}
                      {item.quantity}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="col-md-3 text-md-end">
                    <strong>
                      ৳
                      {item.price *
                        item.quantity}
                    </strong>
                  </div>

                </div>
              ))}

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center mt-4">

                <strong>
                  Total Amount
                </strong>

                <strong className="text-primary fs-5">
                  ৳{order.totalAmount}
                </strong>

              </div>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default Orders;
