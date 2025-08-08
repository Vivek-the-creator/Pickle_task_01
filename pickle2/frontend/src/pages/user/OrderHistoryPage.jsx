import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiBox, FiX } from 'react-icons/fi';

const statusColors = {
  Completed: 'text-green-600 bg-green-100',
  Pending: 'text-yellow-600 bg-yellow-100',
  Cancelled: 'text-red-600 bg-red-100',
};

const mockTrackingSteps = [
  { label: 'Order Placed', key: 'placed' },
  { label: 'Packed', key: 'packed' },
  { label: 'Shipped', key: 'shipped' },
  { label: 'Out for Delivery', key: 'out' },
  { label: 'Delivered', key: 'delivered' },
];

const getMockOrderStatus = (order) => {
  // For demo: alternate status based on order id
  const idx = order.id % mockTrackingSteps.length;
  return mockTrackingSteps.slice(0, idx + 1).map(s => s.key);
};

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all orders from localStorage (filter by user email if present)
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = user ? allOrders.filter(o => o.email === user.email) : [];
    if (user && userOrders.length === 0) {
      // Seed with sample orders
      const sampleOrders = [
        {
          id: Date.now(),
          email: user.email,
          date: new Date().toLocaleDateString(),
          total: 49.99,
          status: 'Completed',
          items: [
            { name: 'Mango Pickle', quantity: 1 },
            { name: 'Lemon Pickle', quantity: 2 },
          ],
        },
        {
          id: Date.now() + 1,
          email: user.email,
          date: new Date(Date.now() - 86400000).toLocaleDateString(),
          total: 19.99,
          status: 'Completed',
          items: [
            { name: 'Garlic Pickle', quantity: 1 },
          ],
        },
      ];
      const updatedOrders = [...allOrders, ...sampleOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(sampleOrders);
      return;
    }
    setOrders(userOrders);
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-700 flex items-center gap-2">
        <FiBox className="inline-block text-primary-500" /> Order History
      </h1>
      {orders.length === 0 ? (
        <div className="text-gray-600">No orders found.</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => (
            <div
              key={order.id || idx}
              className="border rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 relative"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary-700">
                  <FiPackage className="text-primary-500" />
                  Order #{order.id || idx + 1}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FiCalendar /> {order.date || 'N/A'}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'text-gray-600 bg-gray-100'}`}> 
                  <FiCheckCircle /> {order.status || 'Completed'}
                </div>
              </div>
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <span className="font-medium text-gray-700">Items:</span>
                  <ul className="list-disc ml-6 mt-1 text-gray-700">
                    {order.items?.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-lg font-bold text-green-700 mt-4 md:mt-0">
                  <FiDollarSign /> ${order.total?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow"
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Link to="/" className="text-primary-600 hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  );
};

export default OrderHistoryPage; 