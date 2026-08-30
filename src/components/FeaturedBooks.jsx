import { useEffect, useState } from "react";

function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://bookverse-backend-hy7j.onrender.com/api/books"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        setBooks(data);
      } catch (error) {
        console.error("FEATURED BOOKS ERROR:", error);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const title = book.title || "";
    const author = book.author || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      author.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section className="container my-5">

      <h2 className="text-center mb-4">
        Featured Books
      </h2>

      {/* Search */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-7">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search books by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">

        {filteredBooks.length === 0 ? (
          <div className="text-center">
            <p>No books found.</p>
          </div>
        ) : (
          filteredBooks.slice(0, 3).map((book) => (
            <div
              className="col-md-4 mb-4"
              key={book._id}
            >
              <div className="card h-100 shadow-sm">

                <img
                  src={
                    book.image ||
                    "https://picsum.photos/300/400"
                  }
                  className="card-img-top"
                  alt={book.title || "Book"}
                  style={{
                    height: "350px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">

                  <h5 className="card-title">
                    {book.title || "Untitled Book"}
                  </h5>

                  <p className="text-muted">
                    by {book.author || "Unknown Author"}
                  </p>

                  <p className="card-text">
                    {book.description ||
                      "No description available."}
                  </p>

                  <p className="fw-bold text-primary">
                    ৳{book.price ?? 0}
                  </p>

                  <button className="btn btn-primary">
                    View Details
                  </button>

                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </section>
  );
}

export default FeaturedBooks;
