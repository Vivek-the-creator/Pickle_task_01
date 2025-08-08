import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiBox, FiUser, FiBell, FiX, FiStar } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  if (!order) return [];
  const idx = order.id % mockTrackingSteps.length;
  return mockTrackingSteps.slice(0, idx + 1).map(s => s.key);
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const invoiceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const found = allOrders.find(o => String(o.id) === String(orderId));
    if (!found) {
      setOrder(null);
    } else {
      setOrder(found);
      // Load review from localStorage
      const reviews = JSON.parse(localStorage.getItem('orderReviews')) || {};
      if (reviews[found.id]) {
        setReview(reviews[found.id]);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Order Not Found</h1>
        <Link to="/order-history" className="text-primary-600 hover:underline">&larr; Back to Order History</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary-700 flex items-center gap-2">
          <FiBox className="inline-block text-primary-500" /> Order #{order.id}
        </h1>
        <button onClick={() => navigate(-1)} className="text-primary-600 hover:underline">Back</button>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <FiCalendar /> {order.date || 'N/A'}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-max ${statusColors[order.status] || 'text-gray-600 bg-gray-100'}`}> 
          <FiCheckCircle /> {order.status || 'Completed'}
        </div>
        <div className="text-sm text-gray-500">Customer: <span className="font-semibold text-gray-700">{user?.name || user?.email}</span> ({user?.email})</div>
      </div>
      {/* Tracking */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-primary-700">
          <FiPackage className="text-primary-500" /> Order Tracking
        </h2>
        <ol className="relative border-l-2 border-primary-200 ml-4 mb-4">
          {mockTrackingSteps.map((step, i) => {
            const completed = getMockOrderStatus(order).includes(step.key);
            return (
              <li key={step.key} className="mb-6 ml-4">
                <div className={`flex items-center gap-2 ${completed ? 'text-primary-700' : 'text-gray-400'}`}>
                  <span className={`w-4 h-4 rounded-full border-2 ${completed ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-300'}`}></span>
                  <span className="font-medium">{step.label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {/* Invoice */}
      <div className="mb-8" ref={invoiceRef}>
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-primary-700">
          <FiDollarSign className="text-primary-500" /> Invoice
        </h2>
        <div className="mb-2 text-sm text-gray-500">Date: {order.date}</div>
        <div className="mb-4">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-center">Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Total:</span>
          <span className="text-green-700 font-bold text-lg">${order.total?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="text-right">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors mr-2"
            onClick={() => window.print()}
          >
            Print Invoice
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            onClick={async () => {
              const input = invoiceRef.current;
              if (!input) return;
              const canvas = await html2canvas(input);
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const imgWidth = pageWidth - 40;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
              pdf.save(`invoice-order-${order.id}.pdf`);
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
      {/* Add Review Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-primary-700">
          <FiStar className="text-primary-500" /> Review This Order
        </h2>
        {review ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} className={i <= review.rating ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <div className="text-gray-800 mb-1">{review.comment}</div>
            <div className="text-xs text-gray-500">Thank you for your feedback!</div>
          </div>
        ) : (
          <form
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            onSubmit={e => {
              e.preventDefault();
              if (rating === 0) return;
              const newReview = { rating, comment };
              setReview(newReview);
              setReviewSubmitted(true);
              // Save to localStorage
              const reviews = JSON.parse(localStorage.getItem('orderReviews')) || {};
              reviews[order.id] = newReview;
              localStorage.setItem('orderReviews', JSON.stringify(reviews));
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRating(i)}
                  className="focus:outline-none"
                >
                  <FiStar className={i <= rating ? 'text-yellow-400 w-6 h-6' : 'text-gray-300 w-6 h-6'} />
                </button>
              ))}
            </div>
            <textarea
              className="w-full border rounded-md p-2 mb-2"
              rows={3}
              placeholder="Write your review..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />
            <div className="text-right">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                disabled={rating === 0}
              >
                Submit Review
              </button>
            </div>
            {reviewSubmitted && (
              <div className="text-green-600 mt-2">Review submitted!</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage; 