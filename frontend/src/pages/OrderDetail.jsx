import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { api } from "../api";

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to="/orders">Back to orders</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      {location.state?.justPlaced && (
        <p className="success banner">Order placed successfully. Thank you!</p>
      )}
      <Link to="/orders" className="back-link">
        ← All orders
      </Link>
      <h1>Order {order.id}</h1>
      <p className="muted">
        {new Date(order.createdAt).toLocaleString()} · Status:{" "}
        <span className="status">{order.status}</span>
      </p>

      <div className="order-detail-grid">
        <section>
          <h2>Items</h2>
          <ul className="cart-list">
            {order.items.map((item) => (
              <li key={item.productId} className="cart-row">
                <img src={item.image} alt="" />
                <div className="cart-info">
                  <strong>{item.name}</strong>
                  <p className="muted">
                    Qty {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="cart-line">${item.lineTotal.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </section>
        <aside className="summary-panel">
          <h2>Delivery</h2>
          <p>
            {order.shipping.fullName}
            <br />
            {order.shipping.address}
            <br />
            {order.shipping.city}, {order.shipping.zip}
            <br />
            {order.shipping.country}
          </p>
          <h2>Payment</h2>
          <p className="muted">
            {order.payment.method === "card"
              ? `Card ending ${order.payment.last4}`
              : "Cash on delivery"}
          </p>
          <h2>Totals</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${order.pricing.subtotal.toFixed(2)}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>−${order.pricing.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>${order.pricing.shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${order.pricing.tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${order.pricing.total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
