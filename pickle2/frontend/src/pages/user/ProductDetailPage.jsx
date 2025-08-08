import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiArrowLeft } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/ui/Footer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    setLoading(true);
    try {
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const found = products.find(p => String(p.id) === String(id));
      setProduct(found);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (window.showToast) {
      window.showToast('Product added to cart!', 'success');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const productSchema = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Pickle Business'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href
    }
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{product ? `${product.name} | Pickle Business` : 'Product | Pickle Business'}</title>
        <meta name="description" content={product ? product.description : 'Product details for Pickle Business.'} />
        {productSchema && (
          <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        )}
      </Helmet>
      <SectionWrapper>
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary-600">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <Card className="flex flex-col items-center justify-center">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 w-full max-w-xs">
              <img
                src={product?.images?.[selectedImage] || product?.image}
                alt={product?.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {product?.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-transparent'}`}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>
          {/* Product Info */}
          <Card>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      className={`w-4 h-4 ${index < (product?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product?.reviews?.length || 0} reviews)
                </span>
              </div>
              <p className="text-2xl font-bold text-primary-600 mb-4">
                {formatPrice(product?.price)}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{product?.description}</p>
            </div>
            <div className="mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className={`font-medium ${product?.stock > 10 ? 'text-green-600' : product?.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>{product?.stock} available</span>
              </div>
              {product?.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product?.weight}</span>
                </div>
              )}
            </div>
            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >-</button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product?.stock}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >+</button>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product?.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button className="p-3 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors" aria-label="Add to wishlist">
                  <FiHeart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        {/* Reviews Section */}
        {product?.reviews && product.reviews.length > 0 && (
          <Card className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-primary-600">{review.customer.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900">{review.customer.name}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, starIndex) => (
                        <FiStar
                          key={starIndex}
                          className={`w-4 h-4 ${starIndex < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </SectionWrapper>
      <Footer />
    </div>
  );
};

export default ProductDetailPage; 