import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useShop();

  return (
    <div className="page">
      <h1>Wishlist</h1>
      <p className="muted">Save products you love and add them to cart later.</p>
      {!wishlist.length ? (
        <p className="muted">
          Nothing saved yet. <Link to="/">Browse the shop</Link>
        </p>
      ) : (
        <div className="product-grid">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
