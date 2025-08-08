import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiGrid, FiUser } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/products', icon: FiGrid, label: 'Products' },
  { to: '/cart', icon: FiShoppingBag, label: 'Cart' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
];

const MobileNavBar = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const cartCount = getCartCount();
  const filteredNavItems = isAuthenticated
    ? navItems
    : navItems.filter(item => item.to !== '/profile');
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow z-50 flex justify-around items-center py-2 sm:hidden">
      {filteredNavItems.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`relative flex flex-col items-center text-xs font-medium transition-colors duration-150 ${location.pathname === to ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
          aria-label={label}
        >
          <Icon className="w-6 h-6 mb-1" />
          {label}
          {label === 'Cart' && cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {cartCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default MobileNavBar; 