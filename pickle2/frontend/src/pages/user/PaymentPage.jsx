// PaymentPage.jsx
// Dedicated payment page for placing an order after shipping info is collected.
// Receives cart, shipping, discount, and coupon from location.state.
// Handles payment form, order summary, and order placement.
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiCreditCard } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import api from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Footer from '../../components/ui/Footer';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, shipping, discount = 0, coupon = '' } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!cart || !shipping) {
    navigate('/cart');
    return null;
  }

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping,
        payment: {
          method: data.paymentMethod,
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv
        },
        coupon,
        discount,
        total: (getCartTotal() * 1.08) * (1 - discount)
      };
      const response = await api.post('/orders', orderData);
      if (window.showToast) window.showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionWrapper>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-gray-600">Enter your payment details to complete your order</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FiCreditCard className="w-5 h-5" />
                    Payment Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <select
                        {...register('paymentMethod', { required: 'Payment method is required' })}
                        className="input-field"
                      >
                        <option value="">Select payment method</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                      </select>
                      {errors.paymentMethod && (
                        <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        {...register('cardNumber', { 
                          required: 'Card number is required',
                          pattern: {
                            value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                            message: 'Please enter a valid card number'
                          }
                        })}
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          {...register('expiryDate', { 
                            required: 'Expiry date is required',
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                              message: 'Please enter in MM/YY format'
                            }
                          })}
                          className="input-field"
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          {...register('cvv', { 
                            required: 'CVV is required',
                            pattern: {
                              value: /^\d{3,4}$/,
                              message: 'Please enter a valid CVV'
                            }
                          })}
                          className="input-field"
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full flex items-center justify-center text-lg disabled:opacity-50">
                  {loading ? (<><LoadingSpinner size="sm" /> Processing...</>) : 'Place Order'}
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
                  <div key={item._id || item.id} className="flex items-center justify-between">
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
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">- {formatPrice(getCartTotal() * discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice((getCartTotal() * 1.08) * (1 - discount))}</span>
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

export default PaymentPage; 