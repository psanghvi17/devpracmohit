import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useShop();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Shoply
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Shop</NavLink>
          {user && (
            <>
              <NavLink to="/wishlist">Wishlist ({wishlist.length})</NavLink>
              <NavLink to="/orders">Orders</NavLink>
            </>
          )}
        </nav>
        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="user-chip">{user.name.split(" ")[0]}</span>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
