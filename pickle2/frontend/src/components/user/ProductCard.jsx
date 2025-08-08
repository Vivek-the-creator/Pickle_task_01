import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, cart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Check if product is already in cart
      const alreadyInCart = cart.some(item => item.id === product.id);
      addToCart(product, 1);
      // Wait a tick for cart to update
      setTimeout(() => {
        const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const inCart = updatedCart.some(item => item.id === product.id);
        if (!alreadyInCart && inCart) {
          if (window.showToast) {
            window.showToast('Product added to cart!', 'success');
          }
        } else if (alreadyInCart && inCart) {
          if (window.showToast) {
            window.showToast('Product quantity increased in cart!', 'success');
          }
        } else {
          if (window.showToast) {
            window.showToast('Failed to add product to cart', 'error');
          }
        }
        setIsLoading(false);
      }, 100);
    } catch (error) {
      if (window.showToast) {
        window.showToast('Failed to add product to cart', 'error');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="card group hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white flex flex-col h-full border border-gray-100 scale-100 hover:scale-[1.03]">
      <div className="relative overflow-hidden rounded-t-2xl flex items-center justify-center bg-gray-50" style={{ minHeight: '180px', height: '180px' }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10">
          <FiHeart className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-2">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-primary-600 transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2 min-h-[32px]">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 gap-3">
          <span className="text-xl font-bold text-primary-600 whitespace-nowrap">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-base shadow hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60"
          >
            <FiShoppingCart className="w-5 h-5" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 