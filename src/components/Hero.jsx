function Hero({ searchTerm, setSearchTerm }) {
  return (
    <section className="container text-center py-5">

      <h1 className="display-4 fw-bold">
        Discover Your Next Favorite Book
      </h1>

      <p className="lead mt-3">
        Browse thousands of books from different categories and find the perfect read for you.
      </p>

      <div className="row justify-content-center mt-4">
        <div className="col-md-7">
          <div className="input-group input-group-lg">

            <input
              type="text"
              className="form-control"
              placeholder="Search books by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="btn btn-primary">
              Search
            </button>

          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg mt-4">
        Explore Books
      </button>

    </section>
  );
}

export default Hero;