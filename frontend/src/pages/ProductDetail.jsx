import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .product(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleAdd() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await addToCart(product.id, qty);
      setMsg("Added to cart");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleWish() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    await toggleWishlist(product.id);
  }

  if (error && !product) {
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to="/">Back to shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back to shop
      </Link>
      <div className="detail">
        <div className="detail-media">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <p className="product-cat">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="product-meta">
            <span className="price">${product.price.toFixed(2)}</span>
            <span className="rating">★ {product.rating}</span>
            <span className="muted">{product.stock} in stock</span>
          </div>
          <p className="lede">{product.description}</p>
          {error && <p className="error">{error}</p>}
          {msg && <p className="success">{msg}</p>}
          <div className="detail-actions">
            <label className="qty">
              Qty
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={busy}
            >
              {busy ? "Adding…" : "Add to cart"}
            </button>
            <button
              type="button"
              className={`btn btn-ghost ${isWishlisted(product.id) ? "wish-on" : ""}`}
              onClick={handleWish}
            >
              {isWishlisted(product.id) ? "♥ In wishlist" : "♡ Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
