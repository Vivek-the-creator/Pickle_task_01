import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import SearchBar from '../../components/user/SearchBar';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import api from '../../utils/api';

const ProductsAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = () => {
    setLoading(true);
    try {
      let products = JSON.parse(localStorage.getItem('products')) || [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
        );
      }
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map((p, idx) => p._id || p.name || idx));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleDeleteProduct = (productId) => {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p._id !== productId && p.name !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    setProducts(products);
    if (window.showToast) {
      window.showToast('Product deleted successfully', 'success');
    }
  };

  const handleBulkDelete = () => {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => !selectedProducts.includes(p._id) && !selectedProducts.includes(p.name));
    localStorage.setItem('products', JSON.stringify(products));
    setProducts(products);
    setSelectedProducts([]);
    setShowDeleteModal(false);
    if (window.showToast) {
      window.showToast('Products deleted successfully', 'success');
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (stock <= 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/add-product"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <SearchBar onSearch={handleSearch} placeholder="Search products..." />
          </div>
          {selectedProducts.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-secondary text-red-600 hover:text-red-700"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, idx) => {
                const stockStatus = getStockStatus(product.stock);
                const key = product._id || product.name || idx;
                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id || product.name || idx)}
                        onChange={(e) => handleSelectProduct(product._id || product.name || idx, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/products/${product._id}/view`}
                          className="text-gray-400 hover:text-gray-600"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedProducts.length} selected product(s)? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setViewModalOpen(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-primary-700">Product Details</h2>
            <div className="mb-4 flex flex-col items-center">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-32 h-32 object-cover rounded mb-4" />
              <div className="font-semibold text-gray-700">Name:</div>
              <div className="mb-2">{selectedProduct.name}</div>
              <div className="font-semibold text-gray-700">Description:</div>
              <div className="mb-2">{selectedProduct.description}</div>
              <div className="font-semibold text-gray-700">Category:</div>
              <div className="mb-2">{selectedProduct.category}</div>
              <div className="font-semibold text-gray-700">Price:</div>
              <div className="mb-2">{formatPrice(selectedProduct.price)}</div>
              <div className="font-semibold text-gray-700">Stock:</div>
              <div className="mb-2">{selectedProduct.stock}</div>
              <div className="font-semibold text-gray-700">Status:</div>
              <div>{getStockStatus(selectedProduct.stock).text}</div>
            </div>
            <button onClick={() => setViewModalOpen(false)} className="w-full btn-secondary mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdminPage; 