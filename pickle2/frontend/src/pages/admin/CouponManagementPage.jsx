// CouponManagementPage.jsx
// Admin page for managing coupons (view, add, delete; local state only)
import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const initialCoupons = [
  { code: 'PICKLE10', discount: 10, count: 100, active: true, start: '', end: '' },
  { code: 'PICKLE20', discount: 20, count: 50, active: false, start: '', end: '' },
];

const CouponManagementPage = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [count, setCount] = useState('');
  const [active, setActive] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    const discountValue = parseInt(discount, 10);
    const countValue = parseInt(count, 10);
    if (!trimmedCode || isNaN(discountValue) || discountValue <= 0 || discountValue > 100 || isNaN(countValue) || countValue < 1) {
      setError('Enter a valid code, discount (1-100), and count (>=1)');
      return;
    }
    if (start && end && new Date(end) < new Date(start)) {
      setError('End date must be after start date');
      return;
    }
    if (coupons.some(c => c.code === trimmedCode)) {
      setError('Coupon code already exists');
      return;
    }
    setCoupons([
      ...coupons,
      { code: trimmedCode, discount: discountValue, count: countValue, active, start, end }
    ]);
    setCode('');
    setDiscount('');
    setCount('');
    setActive(true);
    setStart('');
    setEnd('');
    setError('');
  };

  const handleDelete = (code) => {
    setCoupons(coupons.filter(c => c.code !== code));
  };

  const handleCountChange = (code, newCount) => {
    if (isNaN(newCount) || newCount < 1) return;
    setCoupons(coupons.map(c => c.code === code ? { ...c, count: newCount } : c));
  };

  const handleToggleActive = (code) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const handleScheduleChange = (code, field, value) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, [field]: value } : c));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Coupon Management</h1>
        <form onSubmit={handleAddCoupon} className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Coupon Code"
            className="input-field"
            maxLength={20}
          />
          <input
            type="number"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            placeholder="Discount %"
            className="input-field"
            min={1}
            max={100}
          />
          <input
            type="number"
            value={count}
            onChange={e => setCount(e.target.value)}
            placeholder="Count"
            className="input-field"
            min={1}
          />
          <Button type="submit" className="w-full md:w-auto">Add Coupon</Button>
        </form>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Discount (%)</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Count</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Active</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Start</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">End</th>
                <th className="px-6 py-3 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b font-mono text-lg">{coupon.code}</td>
                  <td className="px-6 py-4 border-b">{coupon.discount}</td>
                  <td className="px-6 py-4 border-b">
                    <input
                      type="number"
                      value={coupon.count}
                      min={1}
                      className="input-field w-24"
                      onChange={e => handleCountChange(coupon.code, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td className="px-6 py-4 border-b">
                    <input
                      type="checkbox"
                      checked={coupon.active}
                      onChange={() => handleToggleActive(coupon.code)}
                    />
                  </td>
                  <td className="px-6 py-4 border-b">
                    <input
                      type="date"
                      value={coupon.start}
                      onChange={e => handleScheduleChange(coupon.code, 'start', e.target.value)}
                      className="input-field w-32"
                    />
                  </td>
                  <td className="px-6 py-4 border-b">
                    <input
                      type="date"
                      value={coupon.end}
                      onChange={e => handleScheduleChange(coupon.code, 'end', e.target.value)}
                      className="input-field w-32"
                    />
                  </td>
                  <td className="px-6 py-4 border-b">
                    <Button onClick={() => handleDelete(coupon.code)} className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2">Delete</Button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No coupons available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CouponManagementPage; 