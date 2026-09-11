import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (q.trim()) params.q = q.trim();
    if (category !== "All") params.category = category;
    api
      .products(params)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [q, category]);

  return (
    <div className="page">
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <p className="brand-mark">Shoply</p>
          <h1>Everyday essentials, curated with care.</h1>
          <p className="lede">
            Browse audio, bags, home goods, and more — then save favorites or checkout in minutes.
          </p>
        </div>
        <div className="shop-hero-visual" aria-hidden="true" />
      </section>

      <section className="shop-toolbar">
        <input
          type="search"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search"
        />
        <div className="filters">
          <button
            type="button"
            className={category === "All" ? "chip active" : "chip"}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={category === c ? "chip active" : "chip"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="muted">No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
