function Categories() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Book Categories</h1>

      <div className="row">

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h4>Fiction</h4>
              <p>Explore stories, novels, and imaginative worlds.</p>
              <button className="btn btn-primary">
                View Books
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h4>Technology</h4>
              <p>Books about programming, software, and technology.</p>
              <button className="btn btn-primary">
                View Books
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h4>Self Development</h4>
              <p>Improve your habits, skills, and personal growth.</p>
              <button className="btn btn-primary">
                View Books
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Categories;