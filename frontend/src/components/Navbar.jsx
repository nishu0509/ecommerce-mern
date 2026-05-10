import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-white mr-4">🛒 E-Shop</Link>

        {/* Search Bar */}
        <div className="flex flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/?search=${search}`)}
            className="flex-1 px-4 py-2 text-black rounded-l-lg focus:outline-none bg-white border-0"
          />
          <button
            onClick={() => navigate(`/?search=${search}`)}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-r-lg text-black font-bold"
          >
            🔍
          </button>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-6 ml-4 text-sm">
          {user ? (
            <>
              <div className="text-center cursor-pointer hover:text-yellow-400" onClick={handleLogout}>
                <p className="text-xs text-gray-300">Hello, {user.name}</p>
                <p className="font-bold">Sign Out</p>
              </div>
              <Link to="/orders" className="text-center hover:text-yellow-400">
                <p className="text-xs text-gray-300">Returns &</p>
                <p className="font-bold">Orders</p>
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-center hover:text-yellow-400">
                  <p className="text-xs text-gray-300">Manage</p>
                  <p className="font-bold text-yellow-400">Admin</p>
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="text-center hover:text-yellow-400">
              <p className="text-xs text-gray-300">Hello, Sign in</p>
              <p className="font-bold">Account</p>
            </Link>
          )}
          <Link to="/cart" className="text-center hover:text-yellow-400 relative">
            <p className="text-3xl">🛒</p>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 text-white px-4 py-1.5 flex gap-6 text-sm">
        <Link to="/" className="hover:text-yellow-400">All Products</Link>
        <Link to="/?category=Electronics" className="hover:text-yellow-400">Electronics</Link>
        <Link to="/?category=Clothing" className="hover:text-yellow-400">Clothing</Link>
        <Link to="/?category=Books" className="hover:text-yellow-400">Books</Link>
        {user && <Link to="/profile" className="hover:text-yellow-400">My Account</Link>}
      </div>
    </div>
  );
};

export default Navbar;