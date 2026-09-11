import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  async function handleAdd(e) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    await addToCart(product.id, 1);
  }

  async function handleWish(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    await toggleWishlist(product.id);
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-body">
        <p className="product-cat">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="rating">★ {product.rating}</span>
        </div>
        <div className="product-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd}>
            Add to cart
          </button>
          <button
            type="button"
            className={`btn btn-ghost btn-sm ${isWishlisted(product.id) ? "wish-on" : ""}`}
            onClick={handleWish}
            aria-label="Toggle wishlist"
          >
            {isWishlisted(product.id) ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </div>
    </article>
  );
}
