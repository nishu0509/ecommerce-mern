import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    };
    fetch();
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm text-gray-500 mb-4">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt; {product.category} &gt; {product.name}
        </p>
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-80 h-80 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {product.image
              ? <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
              : <span className="text-8xl">📦</span>}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-400 text-lg">★★★★☆</span>
              <span className="text-blue-500 text-sm hover:underline cursor-pointer">128 ratings</span>
            </div>
            <hr className="my-3" />
            <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            <hr className="my-3" />
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-sm mt-3"><span className="font-semibold">Category:</span> {product.category}</p>
            <p className="text-sm mt-1"><span className="font-semibold">Availability:</span> <span className="text-green-600 font-semibold">In Stock ({product.stock} left)</span></p>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd}
                className={`flex-1 py-3 rounded-full font-semibold text-black transition ${added ? 'bg-green-400' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
                {added ? '✅ Added!' : 'Add to Cart'}
              </button>
              <button onClick={handleAdd}
                className="flex-1 py-3 rounded-full font-semibold bg-orange-400 hover:bg-orange-500 text-black transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;