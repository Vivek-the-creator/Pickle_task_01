import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const discount = location.state?.discount || 0;
  const coupon = location.state?.coupon || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // When an address is selected, auto-fill the address field
  const handleSelectAddress = (idx) => {
    setSelectedAddressIdx(idx);
    if (user && user.addresses && user.addresses[idx]) {
      setValue('address', user.addresses[idx].value);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Instead of placing order, go to payment page
      navigate('/payment', {
        state: {
          shipping: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country
          },
          cart,
          discount,
          coupon
        }
      });
    } catch (error) {
      setError('Failed to proceed to payment.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Checkout | Pickle Business</title>
        <meta name="description" content="Complete your order and enjoy fresh handcrafted pickles delivered to your door." />
      </Helmet>
      <SectionWrapper>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FiTruck className="w-5 h-5" />
                    Shipping Information
                  </h2>
                  {/* Saved Addresses Selection */}
                  {user && user.addresses && user.addresses.length > 0 && (
                    <div className="mb-6">
                      <div className="font-medium text-gray-700 mb-2">Select a saved address:</div>
                      <div className="flex flex-wrap gap-4">
                        {user.addresses.map((addr, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`rounded-lg border px-4 py-3 text-left min-w-[180px] transition-all shadow-sm ${selectedAddressIdx === idx ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'}`}
                            onClick={() => handleSelectAddress(idx)}
                          >
                            <div className="font-semibold text-primary-700 mb-1">{addr.tag}</div>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{addr.value}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="input-field"
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone is required' })}
                        className="input-field"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        {...register('address', { required: 'Address is required' })}
                        className="input-field"
                        placeholder="Enter your address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'City is required' })}
                        className="input-field"
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        {...register('state', { required: 'State is required' })}
                        className="input-field"
                        placeholder="Enter your state"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        {...register('zipCode', { required: 'ZIP code is required' })}
                        className="input-field"
                        placeholder="Enter ZIP code"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        {...register('country', { required: 'Country is required' })}
                        className="input-field"
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Payment Information */}
                {/* Remove payment fields and button */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full flex items-center justify-center text-lg disabled:opacity-50">
                  {loading ? (<><LoadingSpinner size="sm" /> Processing...</>) : 'Continue to Payment'}
                </Button>
              </form>
            </Card>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">{formatPrice(getCartTotal() * 0.08)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(getCartTotal() * 1.08)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SectionWrapper>
      <Footer />
    </div>
  );
};

export default CheckoutPage; 