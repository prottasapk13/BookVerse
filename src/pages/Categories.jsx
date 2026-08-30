import { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/public-categories"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    window.location.href = `/books?category=${encodeURIComponent(
      category
    )}`;
  };

  if (loading) {
    return (
      <section className="container py-5">
        <h2 className="text-center mb-4">
          Browse Categories
        </h2>

        <p className="text-center">
          Loading categories...
        </p>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h2 className="text-center mb-4">
        Browse Categories
      </h2>

      <div className="row g-3">
        {categories.map((category) => (
          <div
            className="col-6 col-md-4 col-lg-3"
            key={category}
          >
            <button
              type="button"
              className="card h-100 shadow-sm w-100 border-0"
              onClick={() =>
                handleCategoryClick(category)
              }
              style={{
                cursor: "pointer",
              }}
            >
              <div className="card-body text-center">
                <h5 className="card-title mb-0">
                  {category}
                </h5>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;