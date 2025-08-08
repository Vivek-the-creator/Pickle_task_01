// CRMPage.jsx
// Admin Customer Relationship Management (CRM) page
import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const mockCustomers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', phone: '555-1234', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@email.com', phone: '555-5678', status: 'Active' },
  { id: 3, name: 'Charlie Lee', email: 'charlie@email.com', phone: '555-8765', status: 'Inactive' },
];

const CRMPage = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleDeactivate = (id) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, status: 'Inactive' } : c));
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Customer Relationship Management</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-field mb-6 w-full max-w-md"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{customer.name}</td>
                  <td className="px-6 py-4 border-b">{customer.email}</td>
                  <td className="px-6 py-4 border-b">{customer.phone}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={customer.status === 'Active' ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <Button className="mr-2" onClick={() => handleView(customer)}>View</Button>
                    {customer.status === 'Active' && (
                      <Button onClick={() => handleDeactivate(customer.id)} className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2">Deactivate</Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Customer Details Modal */}
      {modalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-primary-700">Customer Details</h2>
            <div className="mb-4">
              <div className="font-semibold text-gray-700">Name:</div>
              <div className="mb-2">{selectedCustomer.name}</div>
              <div className="font-semibold text-gray-700">Email:</div>
              <div className="mb-2">{selectedCustomer.email}</div>
              <div className="font-semibold text-gray-700">Phone:</div>
              <div className="mb-2">{selectedCustomer.phone}</div>
              <div className="font-semibold text-gray-700">Status:</div>
              <div>{selectedCustomer.status}</div>
            </div>
            <Button onClick={() => setModalOpen(false)} className="w-full">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage; 