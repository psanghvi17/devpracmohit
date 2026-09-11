import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useShop();
  const subtotal = cart.reduce((s, i) => s + i.lineTotal, 0);

  if (!cart.length) {
    return (
      <div className="page">
        <h1>Your cart</h1>
        <p className="muted">Cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your cart</h1>
      <div className="cart-layout">
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.productId} className="cart-row">
              <img src={item.image} alt="" />
              <div className="cart-info">
                <Link to={`/product/${item.productId}`}>
                  <strong>{item.name}</strong>
                </Link>
                <p className="muted">${item.price.toFixed(2)} each</p>
                <div className="cart-controls">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-line">${item.lineTotal.toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <aside className="summary-panel">
          <h2>Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="muted tiny">Shipping & tax calculated at billing.</p>
          <Link to="/billing" className="btn btn-primary btn-block">
            Proceed to billing
          </Link>
        </aside>
      </div>
    </div>
  );
}
