const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    price: "$15",
    image: "https://picsum.photos/300/400?random=4",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    price: "$25",
    image: "https://picsum.photos/300/400?random=5",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    price: "$12",
    image: "https://picsum.photos/300/400?random=6",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Technology",
    price: "$30",
    image: "https://picsum.photos/300/400?random=7",
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Self Development",
    price: "$18",
    image: "https://picsum.photos/300/400?random=8",
  },
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    category: "Fiction",
    price: "$20",
    image: "https://picsum.photos/300/400?random=9",
  },
];

function Books() {
  return (
    <div className="container py-5">

      <h1 className="text-center mb-5">
        Our Book Collection
      </h1>

      <div className="row">

        {books.map((book) => (
          <div className="col-md-4 mb-4" key={book.title}>

            <div className="card shadow-sm h-100">

              <img
                src={book.image}
                className="card-img-top"
                alt={book.title}
              />

              <div className="card-body">

                <h5 className="card-title">
                  {book.title}
                </h5>

                <p className="card-text mb-1">
                  <strong>Author:</strong> {book.author}
                </p>

                <p className="card-text mb-1">
                  <strong>Category:</strong> {book.category}
                </p>

                <p className="fw-bold text-primary">
                  {book.price}
                </p>

                <button className="btn btn-primary">
                  View Details
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Books;