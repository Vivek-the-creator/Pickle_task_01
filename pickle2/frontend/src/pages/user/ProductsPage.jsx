import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../../components/user/ProductCard';
import ProductSkeleton from '../../components/user/ProductSkeleton';
import SearchBar from '../../components/user/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import SectionWrapper from '../../components/ui/SectionWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import Footer from '../../components/ui/Footer';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up products without 'id'
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id);
    // If no products, seed with some samples
    if (products.length === 0) {
      products = [
        {
          id: Date.now(),
          name: 'Mango Pickle',
          category: 'Spicy Pickles',
          price: 8.0,
          stock: 50,
          description: 'A spicy and tangy mango pickle.',
          image: '/product-images/sample-pickle.png',
        },
        {
          id: Date.now() + 1,
          name: 'Lemon Pickle',
          category: 'Sweet Pickles',
          price: 6.0,
          stock: 30,
          description: 'A sweet and sour lemon pickle.',
          image: '/product-images/sample-pickle.png',
        },
        {
          id: Date.now() + 2,
          name: 'Garlic Pickle',
          category: 'Kosher Pickles',
          price: 7.0,
          stock: 40,
          description: 'A flavorful garlic pickle.',
          image: '/product-images/sample-pickle.png',
        },
      ];
    }
    localStorage.setItem('products', JSON.stringify(products));
  }, []);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [searchTerm, category, sortBy, currentPage]);

  const fetchCategories = () => {
    // Get unique categories from products in localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    setCategories(uniqueCategories);
  };

  const fetchProducts = () => {
    setLoading(true);
    try {
      let products = JSON.parse(localStorage.getItem('products')) || [];
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
        );
      }
      // Filter by category
      if (category) {
        products = products.filter(p => p.category === category);
      }
      // Sort
      if (sortBy === 'name') {
        products = products.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === '-name') {
        products = products.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortBy === 'price') {
        products = products.sort((a, b) => a.price - b.price);
      } else if (sortBy === '-price') {
        products = products.sort((a, b) => b.price - a.price);
      } // Newest First not implemented (no createdAt)
      // Pagination
      const pageSize = 12;
      const total = products.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      setTotalPages(totalPages);
      const paginated = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      setProducts(paginated);
    } catch (error) { console.error('Error fetching products:', error); }
    finally { setLoading(false); }
  };

  const handleSearch = (term) => { setSearchTerm(term); setCurrentPage(1); };
  const handleCategoryChange = (newCategory) => { setCategory(newCategory); setCurrentPage(1); };
  const handleSortChange = (newSortBy) => { setSortBy(newSortBy); setCurrentPage(1); };
  const handlePageChange = (page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Products | Pickle Business</title>
        <meta name="description" content="Browse our handcrafted pickles. Filter by category, search, and discover your favorite flavors." />
      </Helmet>
      <SectionWrapper>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
            <p className="text-gray-600">Discover our handcrafted pickles</p>
          </div>
          <Button onClick={() => navigate('/cart')} className="text-base font-semibold">Go to Cart</Button>
        </div>
        {/* Filters and Search */}
        <Card className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="input-field pr-8 appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input-field pr-8 appearance-none"
                >
                  <option value="name">Name A-Z</option>
                  <option value="-name">Name Z-A</option>
                  <option value="price">Price Low-High</option>
                  <option value="-price">Price High-Low</option>
                  <option value="-createdAt">Newest First</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
                  aria-label="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>
        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(12)].map((_, index) => (
              <Card key={index}><ProductSkeleton /></Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((product, index) => (
              <Card key={product._id || product.name || index}>
                <ProductCard product={product} />
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            message="Try adjusting your search or filter criteria"
            icon="search"
          />
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 !rounded-lg !shadow-none disabled:opacity-50 disabled:cursor-not-allowed">Previous</Button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 !rounded-lg !shadow-none ${currentPage === page ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 !rounded-lg !shadow-none disabled:opacity-50 disabled:cursor-not-allowed">Next</Button>
            </div>
          </div>
        )}
      </SectionWrapper>
      <Footer />
    </div>
  );
};

export default ProductsPage; 