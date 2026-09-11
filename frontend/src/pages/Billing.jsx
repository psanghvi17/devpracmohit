import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useShop } from "../context/ShopContext";

const emptyShipping = {
  fullName: "",
  address: "",
  city: "",
  zip: "",
  country: "United States",
};

export default function Billing() {
  const { cart, setCart } = useShop();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState(emptyShipping);
  const [payment, setPayment] = useState({ method: "card", cardNumber: "" });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cart.length) return;
    api
      .previewOrder(appliedCoupon || undefined)
      .then(setPreview)
      .catch((err) => setError(err.message));
  }, [cart, appliedCoupon]);

  async function applyCoupon(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api.previewOrder(couponCode);
      setPreview(data);
      setAppliedCoupon(couponCode.trim().toUpperCase());
    } catch (err) {
      setError(err.message);
    }
  }

  async function placeOrder(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await api.placeOrder({
        shipping,
        payment,
        couponCode: appliedCoupon || undefined,
      });
      setCart([]);
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!cart.length) {
    return (
      <div className="page">
        <h1>Billing</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Billing & checkout</h1>
      <p className="muted">
        Coupons: <code>SAVE10</code>, <code>FLAT20</code>, <code>WELCOME</code>
      </p>
      {error && <p className="error">{error}</p>}

      <form className="billing-layout" onSubmit={placeOrder}>
        <div className="billing-forms">
          <fieldset>
            <legend>Shipping</legend>
            <label>
              Full name
              <input
                required
                value={shipping.fullName}
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
              />
            </label>
            <label>
              Address
              <input
                required
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              />
            </label>
            <div className="row-2">
              <label>
                City
                <input
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                />
              </label>
              <label>
                ZIP
                <input
                  required
                  value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                />
              </label>
            </div>
            <label>
              Country
              <input
                required
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            <label className="radio">
              <input
                type="radio"
                name="method"
                checked={payment.method === "card"}
                onChange={() => setPayment({ ...payment, method: "card" })}
              />
              Credit / Debit card
            </label>
            <label className="radio">
              <input
                type="radio"
                name="method"
                checked={payment.method === "cod"}
                onChange={() => setPayment({ ...payment, method: "cod", cardNumber: "" })}
              />
              Cash on delivery
            </label>
            {payment.method === "card" && (
              <label>
                Card number (demo — any 12+ digits)
                <input
                  required
                  inputMode="numeric"
                  placeholder="4242424242424242"
                  value={payment.cardNumber}
                  onChange={(e) =>
                    setPayment({ ...payment, cardNumber: e.target.value.replace(/\D/g, "") })
                  }
                />
              </label>
            )}
          </fieldset>

          <fieldset>
            <legend>Coupon</legend>
            <div className="coupon-row">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
              />
              <button type="button" className="btn btn-ghost" onClick={applyCoupon}>
                Apply
              </button>
            </div>
          </fieldset>
        </div>

        <aside className="summary-panel sticky">
          <h2>Order total</h2>
          {preview ? (
            <>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${preview.pricing.subtotal.toFixed(2)}</span>
              </div>
              {preview.pricing.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount {preview.coupon?.code}</span>
                  <span>−${preview.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {preview.pricing.shipping === 0
                    ? "Free"
                    : `$${preview.pricing.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${preview.pricing.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${preview.pricing.total.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <p className="muted">Calculating…</p>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Placing order…" : "Place order"}
          </button>
          <Link to="/cart" className="back-link">
            ← Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
