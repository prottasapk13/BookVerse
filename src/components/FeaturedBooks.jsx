const books = [
  {
    title: "Atomic Habits",
    description: "Learn how small habits create big changes.",
    image: "https://picsum.photos/300/400?random=1",
  },
  {
    title: "Clean Code",
    description: "A guide to writing better software.",
    image: "https://picsum.photos/300/400?random=2",
  },
  {
    title: "The Alchemist",
    description: "A timeless story about dreams and destiny.",
    image: "https://picsum.photos/300/400?random=3",
  },
];

function FeaturedBooks({ searchTerm }) {

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="container my-5">

      <h2 className="text-center mb-4">
        Featured Books
      </h2>

      <div className="row">

        {filteredBooks.map((book) => (
          <div className="col-md-4 mb-4" key={book.title}>

            <div className="card shadow-sm">

              <img
                src={book.image}
                className="card-img-top"
                alt={book.title}
              />

              <div className="card-body">

                <h5 className="card-title">
                  {book.title}
                </h5>

                <p className="card-text">
                  {book.description}
                </p>

                <button className="btn btn-primary">
                  View Details
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center text-muted">
          No books found.
        </p>
      )}

    </section>
  );
}

export default FeaturedBooks;