function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <a className="navbar-brand fw-bold" href="#">
          📚 BookVerse
        </a>

        <div className="ms-auto">

          <a className="btn btn-outline-light me-2" href="#">
            Home
          </a>

          <a className="btn btn-outline-light me-2" href="#">
            Books
          </a>

          <a className="btn btn-outline-light me-2" href="#">
            Categories
          </a>

          <a className="btn btn-warning" href="#">
            Login
          </a>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;