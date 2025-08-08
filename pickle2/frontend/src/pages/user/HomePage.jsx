import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import Lottie from 'lottie-react';
import pickle3d from '../../assets/pickle-3d.json';
import ProductCard from '../../components/user/ProductCard';
import ProductSkeleton from '../../components/user/ProductSkeleton';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import Footer from '../../components/ui/Footer';

const TESTIMONIALS = [
  {
    name: 'Emily R.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    quote: 'The best pickles I have ever tasted! Super fresh and delivered fast. Highly recommend Pickle Business!'
  },
  {
    name: 'James K.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    quote: 'I love the spicy pickles! The flavor is amazing and the packaging is beautiful.'
  },
  {
    name: 'Priya S.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4,
    quote: 'Great variety and super easy checkout. My family loves these pickles!'
  },
];

const CATEGORY_IMAGES = {
  'Spicy Pickles': '/product-images/sample-pickle.png',
  'Sweet Pickles': '/product-images/sample-pickle.png',
  'Kosher Pickles': '/product-images/sample-pickle.png',
  // Add more mappings as needed
};
const DEFAULT_CATEGORY_IMAGE = '/product-images/sample-pickle.png';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Frontend-only: get products from localStorage
        const stored = localStorage.getItem('products');
        const products = stored ? JSON.parse(stored) : [];
        setFeaturedProducts(products);
        // Extract unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Pickle Business - Fresh Handcrafted Pickles</title>
        <meta name="description" content="Discover our handcrafted pickles made with the finest ingredients and traditional recipes. Shop fresh pickles online." />
      </Helmet>
      {/* Hero Section */}
      <SectionWrapper className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-primary-600 to-green-400 text-white rounded-2xl shadow-xl mt-8 overflow-hidden relative">
        <div className="md:w-1/2 space-y-8 py-16 px-2 md:px-8 z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg mb-4">
            Fresh, Crunchy <span className="text-primary-200">Pickles</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-lg text-primary-100 font-medium">
            Handcrafted with the finest ingredients. Delivered to your door, always crisp and delicious.
          </p>
          <Button as={Link} to="/products" className="inline-flex items-center gap-2 text-lg px-8 py-3 font-bold shadow-xl">
            Shop Now <FiArrowRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="md:w-1/2 flex justify-center items-center relative z-10">
          <Lottie
            animationData={pickle3d}
            loop
            className="w-80 h-80"
            style={{ maxWidth: 320, maxHeight: 320 }}
          />
        </div>
        {/* Decorative background shapes */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-200 rounded-full opacity-30 blur-2xl z-0" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-200 rounded-full opacity-30 blur-2xl z-0" />
      </SectionWrapper>

      {/* Shop by Categories Section */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Categories</h2>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          {categories.length === 0 ? (
            <div className="text-gray-400 text-lg p-8">No categories found.</div>
          ) : (
            categories.map(category => (
              <button
                key={category}
                onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
                className="flex flex-col items-center focus:outline-none group"
              >
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center shadow-lg mb-2 overflow-hidden border-4 border-primary-200 group-hover:scale-105 transition-transform">
                  <img
                    src={CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGE}
                    alt={category}
                    className="w-20 h-20 object-cover"
                  />
                </div>
                <span className="text-primary-900 font-semibold text-base mt-1 group-hover:text-primary-600 transition-colors text-center max-w-[100px] truncate">
                  {category}
                </span>
              </button>
            ))
          )}
        </div>
      </SectionWrapper>

      {/* Featured Products Section */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Button as={Link} to="/products" className="text-base font-semibold">View All</Button>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-8 min-w-[600px] md:min-w-0">
            {loading ? (
              [...Array(6)].map((_, idx) => (
                <Card key={idx} className="w-72 flex-shrink-0"><ProductSkeleton /></Card>
              ))
            ) : featuredProducts.length === 0 ? (
              <div className="text-gray-400 text-lg p-8">No products found.</div>
            ) : (
              featuredProducts.map(product => (
                <Card key={product.id} className="w-72 flex-shrink-0">
                  <ProductCard product={product} />
                </Card>
              ))
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonials Section */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real reviews from real pickle lovers!</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <Card key={idx} className="flex flex-col items-center text-center p-8 bg-gray-50">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-4 border-primary-200 shadow" />
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-5 h-5 ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-lg text-gray-800 font-medium mb-4">“{t.quote}”</p>
              <span className="text-primary-700 font-semibold">{t.name}</span>
            </Card>
          ))}
        </div>
      </SectionWrapper>
      <Footer />
    </div>
  );
};

export default HomePage; 