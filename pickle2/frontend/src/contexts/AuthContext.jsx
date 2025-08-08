import { createContext, useContext, useState, useEffect } from 'react';
import { isTokenValid, decodeToken } from '../utils/jwt';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && isTokenValid(storedToken)) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        logout();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Development mode: Allow admin access for testing
  const isDevelopment = import.meta.env.DEV;
  const devAdminUser = isDevelopment ? {
    _id: 'dev-admin',
    name: 'Development Admin',
    email: 'admin@picklebusiness.com',
    role: 'admin'
  } : null;

  const value = {
    user: isDevelopment && !user ? devAdminUser : user,
    token: isDevelopment && !token ? 'dev-token' : token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: isDevelopment ? true : (!!token && !!user),
    isAdmin: isDevelopment ? true : (user?.role === 'admin'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 