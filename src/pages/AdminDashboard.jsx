import { useEffect, useState } from "react";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // =====================================================
  // FETCH BOOKS
  // =====================================================

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "https://bookverse-backend-hy7j.onrender.com/api/books"
      );

      const data = await response.json();

      if (response.ok) {
        setBooks(data);
      } else {
        setMessage(data.message || "Failed to load books");
      }
    } catch (error) {
      console.error("FETCH BOOKS ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://bookverse-backend-hy7j.onrender.com/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setMessage(
          data.message || "Failed to load orders"
        );
      }
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
    }
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://bookverse-backend-hy7j.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setMessage(
          data.message || "Failed to load users"
        );
      }
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await fetchBooks();
      await fetchOrders();
      await fetchUsers();

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // ADD / UPDATE BOOK
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `https://bookverse-backend-hy7j.onrender.com/api/books/${editingId}`
        : "https://bookverse-backend-hy7j.onrender.com/api/books";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          image: formData.image,
          stock: Number(formData.stock || 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Book operation failed"
        );
        return;
      }

      setMessage(
        editingId
          ? "Book updated successfully!"
          : "Book added successfully!"
      );

      resetForm();
      await fetchBooks();
    } catch (error) {
      console.error("BOOK SAVE ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =====================================================
  // EDIT BOOK
  // =====================================================

  const handleEdit = (book) => {
    setEditingId(book._id);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      price: book.price ?? "",
      category: book.category || "",
      image: book.image || "",
      stock: book.stock ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE BOOK
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://bookverse-backend-hy7j.onrender.com/api/books/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to delete book"
        );
        return;
      }

      setMessage("Book deleted successfully!");

      await fetchBooks();
    } catch (error) {
      console.error("DELETE BOOK ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleOrderStatus = async (id, status) => {
    try {
      const response = await fetch(
        `https://bookverse-backend-hy7j.onrender.com/api/orders/${id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update order"
        );
        return;
      }

      setMessage("Order status updated!");

      await fetchOrders();
    } catch (error) {
      console.error("ORDER UPDATE ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =====================================================
  // UPDATE USER ROLE
  // =====================================================

  const handleUserRole = async (id, role) => {
    try {
      const response = await fetch(
        `https://bookverse-backend-hy7j.onrender.com/api/admin/users/${id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update user"
        );
        return;
      }

      setMessage("User role updated successfully!");

      await fetchUsers();
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://bookverse-backend-hy7j.onrender.com/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to delete user"
        );
        return;
      }

      setMessage("User deleted successfully!");

      await fetchUsers();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading Admin Dashboard...</h3>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="container py-5">

      <h1 className="text-center mb-4">
        Admin Dashboard
      </h1>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      {/* =================================================
          ADD / EDIT BOOK
      ================================================= */}

      <div className="card shadow-sm mb-5">
        <div className="card-body">

          <h3 className="mb-4">
            {editingId ? "Edit Book" : "Add New Book"}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* TITLE */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* AUTHOR */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PRICE */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              {/* STOCK */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* CATEGORY */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* IMAGE URL */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  className="form-control"
                  placeholder="https://example.com/book.jpg"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}

              <div className="col-12 mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
            >
              {editingId ? "Update Book" : "Add Book"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </form>

        </div>
      </div>

      {/* =================================================
          MANAGE BOOKS
      ================================================= */}

      <div className="card shadow-sm mb-5">
        <div className="card-body">

          <h3 className="mb-4">
            Manage Books
          </h3>

          {books.length === 0 ? (
            <p>No books available.</p>
          ) : (
            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {books.map((book) => (
                    <tr key={book._id}>

                      <td>
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            style={{
                              width: "60px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "No image"
                        )}
                      </td>

                      <td>{book.title}</td>

                      <td>{book.author}</td>

                      <td>৳{book.price}</td>

                      <td>{book.category}</td>

                      <td>{book.stock ?? 0}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(book._id)
                          }
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

      {/* =================================================
          MANAGE USERS
      ================================================= */}

      <div className="card shadow-sm mb-5">
        <div className="card-body">

          <h3 className="mb-4">
            Manage Users
          </h3>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (
                    <tr key={user._id}>

                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`badge ${
                            user.role === "admin"
                              ? "bg-danger"
                              : "bg-primary"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Administrator"
                            : "Customer"}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td>

                        <select
                          className="form-select form-select-sm d-inline-block me-2"
                          style={{ width: "140px" }}
                          value={user.role}
                          onChange={(e) =>
                            handleUserRole(
                              user._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="customer">
                            Customer
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>

                        <button
                          className="btn btn-danger btn-sm mt-2 mt-md-0"
                          onClick={() =>
                            handleDeleteUser(user._id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

      {/* =================================================
          MANAGE ORDERS
      ================================================= */}

      <div className="card shadow-sm">

        <div className="card-body">

          <h3 className="mb-4">
            Manage Orders
          </h3>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr key={order._id}>

                      <td>
                        {order._id}
                      </td>

                      <td>
                        {order.user?.name}
                        <br />
                        <small>
                          {order.user?.email}
                        </small>
                      </td>

                      <td>
                        ৳{order.totalAmount}
                      </td>

                      <td>
                        {order.status}
                      </td>

                      <td>

                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatus(
                              order._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
