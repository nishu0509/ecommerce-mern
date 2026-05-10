import { useEffect, useState } from 'react';
import axios from '../api/axios';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/orders/mine');
      setOrders(data);
    };
    fetch();
  }, []);

  if (orders.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <p className="text-5xl mb-4">📦</p>
      <h2 className="text-2xl font-bold text-gray-700">No orders yet!</h2>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-400">Order ID: {order._id}</p>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.isPaid ? '✅ Paid' : '⏳ Pending'}
              </span>
            </div>
            <ul className="space-y-1 mb-3">
              {order.items.map((item, index) => (
                <li key={index} className="text-gray-600 text-sm">• {item.product?.name} x {item.quantity} — ₹{item.price}</li>
              ))}
            </ul>
            <p className="text-blue-600 font-bold text-lg">Total: ₹{order.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;