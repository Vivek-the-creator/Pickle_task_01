import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import EmptyState from '../../components/shared/EmptyState';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Footer from '../../components/ui/Footer';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  console.log('Cart in CartPage:', cart);
  // Optionally, listen for storage changes from other tabs
  useEffect(() => {
    const syncCart = () => {
      // This will only update if the cart is changed in another tab
      // In this tab, CartContext is the source of truth
      // No setState here to avoid infinite loop
    };
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const validCoupons = {
    PICKLE10: 0.10, // 10% off
    PICKLE20: 0.20, // 20% off
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (validCoupons[code]) {
      setDiscount(validCoupons[code]);
      setCouponError('');
      if (window.showToast) window.showToast('Coupon applied!', 'success');
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code');
      if (window.showToast) window.showToast('Invalid coupon code', 'error');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    if (window.showToast) {
      window.showToast('Item removed from cart', 'info');
    }
  };

  const handleClearCart = () => {
    clearCart();
    if (window.showToast) {
      window.showToast('Cart cleared', 'info');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Cart | Pickle Business</title>
          <meta name="description" content="View and manage your shopping cart. Checkout your favorite pickles at Pickle Business." />
        </Helmet>
        <SectionWrapper>
          <EmptyState
            title="Your cart is empty"
            message="Add some delicious pickles to get started!"
            icon="cart"
            action={
              <Button as={Link} to="/products">Start Shopping</Button>
            }
          />
        </SectionWrapper>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Cart | Pickle Business</title>
        <meta name="description" content="View and manage your shopping cart. Checkout your favorite pickles at Pickle Business." />
      </Helmet>
      <SectionWrapper>
        <div className="mb-8 flex items-center gap-4">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary-600">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-500">({cart.length} items)</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                <Button onClick={handleClearCart} className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2">Clear Cart</Button>
              </div>
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col md:flex-row items-center gap-6">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.id}`} className="text-lg font-medium text-gray-900 hover:text-primary-600">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">{formatPrice(item.price)}</p>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 p-0 flex items-center justify-center">-</Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-8 h-8 p-0 flex items-center justify-center">+</Button>
                    </div>
                    {/* Remove Button */}
                    <Button onClick={() => handleRemoveItem(item.id)} className="bg-red-100 text-red-700 hover:bg-red-200 p-2" aria-label="Remove item">
                      <FiTrash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(getCartTotal() * 0.08)}</span>
                </div>
                {/* Coupon Code Input */}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="input-field"
                  />
                  <Button onClick={handleApplyCoupon} className="w-full">Apply Coupon</Button>
                  {couponError && <span className="text-sm text-red-600">{couponError}</span>}
                  {discount > 0 && (
                    <span className="text-sm text-green-600">Coupon applied: -{Math.round(discount * 100)}%</span>
                  )}
                </div>
                {/* Discount Row */}
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">- {formatPrice(getCartTotal() * discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice((getCartTotal() * 1.08) * (1 - discount))}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full flex items-center justify-center gap-2 text-lg"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/checkout', { state: { discount, coupon } });
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <FiShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </Button>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Secure checkout powered by Stripe</p>
              </div>
            </Card>
          </div>
        </div>
      </SectionWrapper>
      <Footer />
    </div>
  );
};

export default CartPage; 