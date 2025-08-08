const Button = ({ children, className = "", ...props }) => (
  <button
    className={`bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg px-6 py-2 transition-transform duration-150 focus:ring-2 focus:ring-primary-400 focus:outline-none active:scale-95 shadow-md ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button; 