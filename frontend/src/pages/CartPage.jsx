import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await axios.post('/payment/create-order', { amount: totalPrice });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'E-Shop',
        description: 'Order Payment',
        order_id: data.id,
        handler: async (response) => {
          try {
            await axios.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const items = cartItems.map((i) => ({
              product: i._id,
              quantity: i.quantity,
              price: i.price,
            }));
            await axios.post('/orders', { items, totalPrice });
            clearCart();
            toast.success('Payment successful! Order placed!');
            navigate('/orders');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#f59e0b' },
        modal: {
          ondismiss: () => toast.error('Payment cancelled'),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.error(`${item.name} removed from cart`);
  };

  if (cartItems.length === 0) return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <p className="text-6xl mb-4">🛒</p>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
      <Link to="/" className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-50 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    : <span className="text-3xl">📦</span>}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-green-600 text-sm font-semibold mt-1">In Stock</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                    <span className="font-semibold px-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 font-bold">+</button>
                    <button onClick={() => handleRemove(item)} className="ml-4 text-blue-500 hover:underline text-sm">Delete</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-72">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-green-600 font-semibold mb-2">✅ Your order is eligible for FREE Delivery</p>
              <hr className="mb-3" />
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                <span className="font-bold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <hr className="mb-3" />
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Order Total</span>
                <span>₹{totalPrice}</span>
              </div>
              <button onClick={handlePayment} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-full font-semibold transition">
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;