import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading orders…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your orders</h1>
      {error && <p className="error">{error}</p>}
      {!orders.length ? (
        <p className="muted">
          No orders yet. <Link to="/">Start shopping</Link>
        </p>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`} className="order-card">
                <div>
                  <strong>{o.id}</strong>
                  <p className="muted">
                    {new Date(o.createdAt).toLocaleString()} · {o.items.length} item(s)
                  </p>
                </div>
                <div className="order-right">
                  <span className="status">{o.status}</span>
                  <span className="price">${o.pricing.total.toFixed(2)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
