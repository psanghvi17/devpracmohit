const express = require("express");
const store = require("../store");

const router = express.Router();

router.get("/", (req, res) => {
  const { q, category } = req.query;
  res.json(store.getProducts({ q, category }));
});

router.get("/categories", (_req, res) => {
  res.json(store.getCategories());
});

router.get("/:id", (req, res) => {
  const product = store.getProduct(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

module.exports = router;
