const express = require("express");
const { authRequired } = require("../middleware/auth");
const store = require("../store");

const router = express.Router();

router.use(authRequired);

router.get("/", (req, res) => {
  res.json(store.getCart(req.user.id));
});

router.post("/items", (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: "productId is required" });

  const cart = store.getCart(req.user.id);
  const existing = cart.find((i) => i.productId === productId);
  const nextQty = (existing?.quantity || 0) + Number(quantity);
  const result = store.setCartItem(req.user.id, productId, nextQty);
  if (result.error) return res.status(result.status).json({ message: result.error });
  res.json(result.cart);
});

router.put("/items/:productId", (req, res) => {
  const quantity = Number(req.body.quantity);
  if (Number.isNaN(quantity)) {
    return res.status(400).json({ message: "quantity is required" });
  }
  const result = store.setCartItem(req.user.id, req.params.productId, quantity);
  if (result.error) return res.status(result.status).json({ message: result.error });
  res.json(result.cart);
});

router.delete("/items/:productId", (req, res) => {
  const result = store.setCartItem(req.user.id, req.params.productId, 0);
  if (result.error) return res.status(result.status).json({ message: result.error });
  res.json(result.cart);
});

module.exports = router;
