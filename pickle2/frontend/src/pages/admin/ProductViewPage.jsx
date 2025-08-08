// ProductViewPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/format';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const ProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const found = products.find(p => String(p._id) === id || String(p.name) === id);
    setProduct(found);
    setLoading(false);
  }, [id]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock <= 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  }
  if (!product) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Product Not Found</h2>
          <button onClick={() => navigate(-1)} className="btn-secondary mt-4">Back</button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-xl">
        <button onClick={() => navigate(-1)} className="btn-secondary mb-6">&larr; Back to Products</button>
        <div className="flex flex-col items-center">
          <img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-gray-600 mb-4">{product.description}</div>
          <div className="mb-2"><span className="font-semibold">Category:</span> {product.category}</div>
          <div className="mb-2"><span className="font-semibold">Price:</span> {formatPrice(product.price)}</div>
          <div className="mb-2"><span className="font-semibold">Stock:</span> {product.stock}</div>
          <div className="mb-2"><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded ${stockStatus.color}`}>{stockStatus.text}</span></div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage; 