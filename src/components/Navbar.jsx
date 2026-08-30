import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [user, setUser] = useState(null);

  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("authChange", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          📚 BookVerse
        </Link>

        <div className="ms-auto d-flex align-items-center">

          <Link className="btn btn-outline-light me-2" to="/">
            Home
          </Link>

          <Link className="btn btn-outline-light me-2" to="/books">
            Books
          </Link>

          <Link className="btn btn-outline-light me-2" to="/cart">
            🛒 Cart
            {cartCount > 0 && (
              <span className="badge bg-danger ms-1">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                className="btn btn-outline-light me-2"
                to="/profile"
              >
                👤 Profile
              </Link>

              {user.role === "admin" && (
                <Link
                  className="btn btn-outline-warning me-2"
                  to="/admin"
                >
                  ⚙️ Admin
                </Link>
              )}

              <span className="text-white me-3">
                Hi, {user.name}
              </span>

              <button
                className="btn btn-warning"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-outline-light me-2"
                to="/register"
              >
                Register
              </Link>

              <Link
                className="btn btn-warning"
                to="/login"
              >
                Login
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
