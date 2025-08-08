import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import api from '../../utils/api';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Remove imagePreview, uploading, and upload logic

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Remove handleImageUpload and removeImage

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const productData = {
        ...data,
        image: '/product-images/sample-pickle.png', // Use static image
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        featured: data.featured || false,
        id: Date.now(), // Assign unique id
      };
      // Store in localStorage
      const products = JSON.parse(localStorage.getItem('products')) || [];
      products.push(productData);
      localStorage.setItem('products', JSON.stringify(products));
      if (window.showToast) {
        window.showToast('Product added successfully', 'success');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      if (window.showToast) {
        window.showToast('Failed to add product', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your store</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Product name is required' })}
                  className="input-field"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Dill Pickles">Dill Pickles</option>
                  <option value="Sweet Pickles">Sweet Pickles</option>
                  <option value="Spicy Pickles">Spicy Pickles</option>
                  <option value="Bread & Butter">Bread & Butter</option>
                  <option value="Kosher Pickles">Kosher Pickles</option>
                  <option value="Gherkins">Gherkins</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    className="input-field pl-8"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('stock', { 
                    required: 'Stock quantity is required',
                    min: { value: 0, message: 'Stock must be positive' }
                  })}
                  className="input-field"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="input-field"
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Image</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={'/product-images/sample-pickle.png'}
                  alt="Product preview"
                  className="w-64 h-64 object-cover rounded-lg border border-gray-200 mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  {...register('weight')}
                  className="input-field"
                  placeholder="e.g., 16 oz, 1 lb"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  {...register('sku')}
                  className="input-field"
                  placeholder="Stock keeping unit"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Featured product (will appear on homepage)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage; 