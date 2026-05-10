import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search') || '';
  const categoryParam = params.get('category') || 'All';
  const [category, setCategory] = useState(categoryParam);
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    setSearch(searchParam);
    setCategory(categoryParam);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        setProducts(data);
      } catch (err) {
        toast.error('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (p) => {
    addToCart(p);
    toast.success(`${p.name} added to cart!`);
  };

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-center py-16 px-4 mb-6">
        <h1 className="text-4xl font-bold mb-2">Welcome to E-Shop</h1>
        <p className="text-white text-lg opacity-90">Best deals on top products</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${category === c ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Products */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {search ? `Results for "${search}"` : 'Featured Products'}
        </h2>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
              <Link to={`/product/${p._id}`}>
                <div className="h-44 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
                    : <span className="text-5xl">📦</span>}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-sm">★★★★☆</span>
                    <span className="text-xs text-gray-400">(128)</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">₹{p.price}</p>
                  <p className="text-xs text-green-600 font-semibold">In Stock</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button onClick={() => handleAddToCart(p)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold py-1.5 rounded-full transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;