import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        "https://bookverse-backend-hy7j.onrender.com/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      setFormData({
        name: data.user.name,
        email: data.user.email,
      });

      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);
      setError("Unable to connect to the server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm text-center">
              <div className="card-body p-5">
                <h2 className="mb-3">👤 My Profile</h2>

                <p className="text-muted mb-4">
                  Please login to view your profile.
                </p>

                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm">

            <div className="card-header bg-dark text-white text-center py-4">
              <div
                className="rounded-circle bg-light text-dark d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "35px",
                }}
              >
                👤
              </div>

              <h2 className="mb-0">My Profile</h2>
            </div>

            <div className="card-body p-4">

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleUpdate}>

                  <div className="mb-4">
                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success"
                    >
                      💾 Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditing(false);

                        setFormData({
                          name: user.name,
                          email: user.email,
                        });

                        setMessage("");
                        setError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="form-label text-muted">
                      Full Name
                    </label>

                    <div className="form-control bg-light">
                      {user.name}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted">
                      Email Address
                    </label>

                    <div className="form-control bg-light">
                      {user.email}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted">
                      Account Type
                    </label>

                    <div>
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
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex flex-wrap gap-2">

                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setEditing(true);
                        setMessage("");
                        setError("");
                      }}
                    >
                      ✏️ Edit Profile
                    </button>

                    <Link
                      to="/orders"
                      className="btn btn-primary"
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/books"
                      className="btn btn-outline-primary"
                    >
                      📚 Browse Books
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="btn btn-outline-warning"
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}

                    <button
                      className="btn btn-outline-danger ms-md-auto"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>

                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
