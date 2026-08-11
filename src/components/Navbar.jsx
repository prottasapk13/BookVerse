import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          📚 BookVerse
        </Link>

        <div className="ms-auto">

          <Link className="btn btn-outline-light me-2" to="/">
            Home
          </Link>

          <Link className="btn btn-outline-light me-2" to="/books">
            Books
          </Link>

          <Link className="btn btn-outline-light me-2" to="/categories">
            Categories
          </Link>

          <Link className="btn btn-outline-light me-2" to="/cart">
           Cart
          </Link>
  

          <Link className="btn btn-warning" to="/login">
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;