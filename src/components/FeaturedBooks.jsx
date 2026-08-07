function FeaturedBooks() {
  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Featured Books</h2>

      <div className="row">

        <div className="col-md-4">
          <div className="card shadow-sm">
            <img
              src="https://picsum.photos/300/400?random=1"
              className="card-img-top"
              alt="Book"
            />

            <div className="card-body">
              <h5 className="card-title">Atomic Habits</h5>

              <p className="card-text">
                Learn how small habits create big changes.
              </p>

              <button className="btn btn-primary">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <img
              src="https://picsum.photos/300/400?random=2"
              className="card-img-top"
              alt="Book"
            />

            <div className="card-body">
              <h5 className="card-title">Clean Code</h5>

              <p className="card-text">
                A guide to writing better software.
              </p>

              <button className="btn btn-primary">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <img
              src="https://picsum.photos/300/400?random=3"
              className="card-img-top"
              alt="Book"
            />

            <div className="card-body">
              <h5 className="card-title">The Alchemist</h5>

              <p className="card-text">
                A timeless story about dreams and destiny.
              </p>

              <button className="btn btn-primary">
                View Details
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturedBooks;