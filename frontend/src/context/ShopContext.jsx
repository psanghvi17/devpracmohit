import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      return;
    }
    const [c, w] = await Promise.all([api.getCart(), api.getWishlist()]);
    setCart(c);
    setWishlist(w);
  }, [user]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  async function addToCart(productId, quantity = 1) {
    const next = await api.addToCart(productId, quantity);
    setCart(next);
  }

  async function updateQty(productId, quantity) {
    const next = await api.updateCartItem(productId, quantity);
    setCart(next);
  }

  async function removeFromCart(productId) {
    const next = await api.removeFromCart(productId);
    setCart(next);
  }

  async function toggleWishlist(productId) {
    const next = await api.toggleWishlist(productId);
    setWishlist(next);
  }

  function isWishlisted(productId) {
    return wishlist.some((p) => p.id === productId);
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        addToCart,
        updateQty,
        removeFromCart,
        toggleWishlist,
        isWishlisted,
        refresh,
        setCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
