const express = require("express");
const { authRequired } = require("../middleware/auth");
const store = require("../store");

const router = express.Router();

router.use(authRequired);

router.get("/", (req, res) => {
  res.json(store.getWishlist(req.user.id));
});

router.post("/:productId", (req, res) => {
  const result = store.toggleWishlist(req.user.id, req.params.productId);
  if (result.error) return res.status(result.status).json({ message: result.error });
  res.json(result.wishlist);
});

module.exports = router;
