const express = require("express");
const { authRequired } = require("../middleware/auth");
const store = require("../store");

const router = express.Router();

router.use(authRequired);

router.post("/preview", (req, res) => {
  const cart = store.getCart(req.user.id);
  if (!cart.length) return res.status(400).json({ message: "Cart is empty" });

  const subtotal = +cart.reduce((s, i) => s + i.lineTotal, 0).toFixed(2);
  const couponResult = store.applyCoupon(subtotal, req.body.couponCode);
  if (couponResult.error) {
    return res.status(couponResult.status).json({ message: couponResult.error });
  }

  const shipping = subtotal >= 100 ? 0 : 8.99;
  const tax = +((subtotal - couponResult.discount) * 0.08).toFixed(2);
  const total = +(subtotal - couponResult.discount + shipping + tax).toFixed(2);

  res.json({
    items: cart,
    pricing: {
      subtotal,
      discount: couponResult.discount,
      shipping,
      tax,
      total,
    },
    coupon: couponResult.coupon,
  });
});

router.post("/", (req, res) => {
  const { shipping, payment, couponCode } = req.body;

  if (!shipping?.fullName || !shipping?.address || !shipping?.city || !shipping?.zip) {
    return res.status(400).json({ message: "Complete shipping details are required" });
  }
  if (!payment?.method) {
    return res.status(400).json({ message: "Payment method is required" });
  }
  if (payment.method === "card" && (!payment.cardNumber || String(payment.cardNumber).length < 12)) {
    return res.status(400).json({ message: "Valid card number is required" });
  }

  const result = store.createOrder(req.user.id, { shipping, payment, couponCode });
  if (result.error) return res.status(result.status).json({ message: result.error });
  res.status(201).json(result.order);
});

router.get("/", (req, res) => {
  res.json(store.getOrdersForUser(req.user.id));
});

router.get("/:id", (req, res) => {
  const order = store.getOrder(req.user.id, req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;
