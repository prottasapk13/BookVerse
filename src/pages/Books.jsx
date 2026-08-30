import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  // Read category from URL
  useEffect(() => {
    const urlCategory = searchParams.get("category");

    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory("All");
    }
  }, [searchParams]);

  // Load books
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load books");
        }

        return response.json();
      })
      .then((data) => {
        console.log("BOOKS FROM API:", data);
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("BOOK ERROR:", err);
        setError("Unable to load books");
        setLoading(false);
      });
  }, []);

  // Create category list
  const categories = [
    "All",
    ...new Set(
      books
        .map((book) => book.category)
        .filter(Boolean)
    ),
  ];

  // Filter books
  const filteredBooks = books.filter((book) => {
    const title = String(book.title || "").toLowerCase();
    const author = String(book.author || "").toLowerCase();
    const bookCategory = String(book.category || "");

    const searchValue = search.toLowerCase();

    const matchesSearch =
      title.includes(searchValue) ||
      author.includes(searchValue);

    const matchesCategory =
      category === "All" ||
      bookCategory.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading books...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <h1 className="text-center mb-5">
        📚 All Books
      </h1>

      {/* Search + Category */}
      <div className="row justify-content-center mb-5">

        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-3">
          <select
            className="form-select form-select-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Books */}
      <div className="row">

        {filteredBooks.length === 0 ? (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              No books found.
            </div>
          </div>
        ) : (
          filteredBooks.map((book) => (
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

                <div className="card-body d-flex flex-column">

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

                  <span className="badge bg-secondary mb-3 align-self-start">
                    {book.category || "Other"}
                  </span>

                  <h5 className="text-primary mb-3">
                    ৳{book.price ?? 0}
                  </h5>

                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => addToCart(book)}
                  >
                    🛒 Add to Cart
                  </button>

                </div>
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Books;