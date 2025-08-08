import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ToastContainer from './components/shared/ToastContainer';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { useState, useRef, useEffect } from 'react';
import { FiUser, FiBell, FiLogOut, FiX } from 'react-icons/fi';

// User Pages
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderConfirmationPage from './pages/user/OrderConfirmationPage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import OrderHistoryPage from './pages/user/OrderHistoryPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import PaymentPage from './pages/user/PaymentPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import AddProductPage from './pages/admin/AddProductPage';
import OrdersPage from './pages/admin/OrdersPage';
import MessagesPage from './pages/admin/MessagesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import CouponManagementPage from './pages/admin/CouponManagementPage';
import CRMPage from './pages/admin/CRMPage';
import ProductViewPage from './pages/admin/ProductViewPage';

// Admin Components
import Sidebar from './components/admin/Sidebar';
import Topbar from './components/admin/Topbar';
import MobileNavBar from './components/ui/MobileNavBar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// User Layout Component
const UserLayout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock notifications
  const mockNotifications = [
    { id: 1, message: 'Your order #1234 has been shipped!', date: '2025-07-09' },
    { id: 2, message: 'Welcome to Pickle Business!', date: '2025-07-08' },
    { id: 3, message: 'Your profile was updated successfully.', date: '2025-07-07' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div key={isAuthenticated ? 'auth' : 'guest'} className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-1240 mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">Pickle Business</h1>
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-primary-600">Home</a>
              <a href="/products" className="text-gray-700 hover:text-primary-600">Products</a>
              <a href="/cart" className="text-gray-700 hover:text-primary-600">Cart</a>
              {isAuthenticated && (
                <a href="/order-history" className="text-gray-700 hover:text-primary-600">Order History</a>
              )}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-2 rounded-full transition-colors flex items-center focus:outline-none"
                    title="Profile"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <FiUser className="w-6 h-6" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <a href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700">
                        <FiUser className="mr-2" /> Profile
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={e => { e.preventDefault(); setDropdownOpen(false); setNotificationsOpen(true); }}
                      >
                        <FiBell className="mr-2" /> Notifications
                      </a>
                      <button
                        onClick={async () => { await logout(); navigate('/login'); }}
                        className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        <FiLogOut className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a href="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors">Login</a>
                  <a href="/register" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md font-medium transition-colors">Sign Up</a>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      {children}
      {/* Notifications Panel */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setNotificationsOpen(false)}
              title="Close"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-700">
              <FiBell className="text-primary-500" /> Notifications
            </h2>
            {mockNotifications.length === 0 ? (
              <div className="text-gray-500">No notifications.</div>
            ) : (
              <ul className="space-y-4">
                {mockNotifications.map(n => (
                  <li key={n.id} className="border-b pb-2">
                    <div className="font-medium text-gray-800">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{n.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
            <Routes>
              {/* User Routes */}
              <Route path="/" element={
                <UserLayout>
                  <HomePage />
                </UserLayout>
              } />
              <Route path="/products" element={
                <UserLayout>
                  <ProductsPage />
                </UserLayout>
              } />
              <Route path="/products/:id" element={
                <UserLayout>
                  <ProductDetailPage />
                </UserLayout>
              } />
              <Route path="/cart" element={
                <UserLayout>
                  <CartPage />
                </UserLayout>
              } />
              {/* Restrict all other user routes for logged-out users */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <UserLayout>
                    <CheckoutPage />
                  </UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <UserLayout>
                    <PaymentPage />
                  </UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/login" element={
                <PublicOnlyRoute>
                  <UserLayout>
                    <LoginPage />
                  </UserLayout>
                </PublicOnlyRoute>
              } />
              <Route path="/register" element={
                <PublicOnlyRoute>
                  <UserLayout>
                    <RegisterPage />
                  </UserLayout>
                </PublicOnlyRoute>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <ProtectedRoute>
                  <UserLayout>
                    <OrderConfirmationPage />
                  </UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/order-history" element={
                <ProtectedRoute>
                  <UserLayout>
                    <OrderHistoryPage />
                  </UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/order/:orderId" element={
                <ProtectedRoute>
                  <UserLayout>
                    <OrderDetailPage />
                  </UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserLayout>
                    <ProfilePage />
                  </UserLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminLayout>
                    <DashboardPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute>
                  <AdminLayout>
                    <ProductsAdminPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/add-product" element={
                <AdminRoute>
                  <AdminLayout>
                    <AddProductPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminLayout>
                    <OrdersPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/messages" element={
                <AdminRoute>
                  <AdminLayout>
                    <MessagesPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/analytics" element={
                <AdminRoute>
                  <AdminLayout>
                    <AnalyticsPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/coupons" element={
                <AdminRoute>
                  <AdminLayout>
                    <CouponManagementPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/crm" element={
                <AdminRoute>
                  <AdminLayout>
                    <CRMPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/products/:id/view" element={
                <AdminRoute>
                  <AdminLayout>
                    <ProductViewPage />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/profile" element={
                <AdminRoute>
                  <AdminLayout>
                    <ProfilePage />
                  </AdminLayout>
                </AdminRoute>
              } />

              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
            <ToastContainer />
            <MobileNavBar />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
