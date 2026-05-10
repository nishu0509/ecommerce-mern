import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) navigate('/');
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await axios.get('/products');
    setProducts(data);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploading(true);
      const { data } = await axios.post('/upload', formData);
      setImage(data.imageUrl);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const finalImage = image || imageUrl;
    try {
      await axios.post('/products', { name, description, price, category, stock, image: finalImage });
      toast.success('Product added!');
      setName(''); setDescription(''); setPrice(''); setCategory(''); setStock(''); setImage(''); setImageUrl('');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/products/${id}`);
    toast.success('Product deleted!');
    fetchProducts();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Product</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Price (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div className="border border-gray-300 rounded-lg p-3">
              <p className="text-sm text-gray-500 mb-2">Upload Image</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
              {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
              {image && <img src={image} alt="preview" className="mt-2 h-20 rounded object-cover" />}
            </div>
            <div className="border border-gray-300 rounded-lg px-4 py-2.5">
              <p className="text-xs text-gray-400 mb-1">Or paste image URL</p>
              <input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                className="w-full focus:outline-none text-sm" />
            </div>
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-lg font-semibold transition">
              Add Product
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">All Products ({products.length})</h3>
          {products.length === 0 && <p className="text-gray-500">No products yet.</p>}
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" /> : <span className="text-2xl">📦</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-500">₹{p.price} — {p.category} — Stock: {p.stock}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(p._id)} className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;