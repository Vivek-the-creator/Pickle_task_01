import { FiPackage, FiShoppingCart, FiSearch, FiAlertCircle } from 'react-icons/fi';

const EmptyState = ({ 
  title = 'No items found', 
  message = 'There are no items to display at the moment.',
  icon = 'package',
  action = null 
}) => {
  const iconMap = {
    package: <FiPackage className="w-12 h-12" />,
    cart: <FiShoppingCart className="w-12 h-12" />,
    search: <FiSearch className="w-12 h-12" />,
    alert: <FiAlertCircle className="w-12 h-12" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">
        {iconMap[icon]}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{message}</p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 