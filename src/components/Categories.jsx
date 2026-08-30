import { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://bookverse-backend-hy7j.onrender.com/api/admin/public-categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="container py-5">
      <h2 className="text-center mb-4">Browse Categories</h2>

      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <div className="row g-3">
          {categories.map((category) => (
            <div className="col-6 col-md-4 col-lg-3" key={category}>
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title">{category}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Categories;

