import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-16">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-700">
      {/* Brand & Newsletter */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-extrabold text-primary-700">Pickle Business</span>
          <span className="text-gray-400 text-sm">© {new Date().getFullYear()}</span>
        </div>
        <p className="mb-4 text-sm text-gray-500 max-w-xs">Fresh, handcrafted pickles delivered to your door. Taste the crunch!</p>
        <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()} aria-label="Newsletter signup">
          <label htmlFor="newsletter" className="text-xs font-semibold text-gray-600">Subscribe to our newsletter</label>
          <div className="flex">
            <input id="newsletter" type="email" required placeholder="Your email address" className="rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-r-md text-sm font-semibold hover:bg-primary-700 transition-colors">Subscribe</button>
          </div>
        </form>
      </div>
      {/* Navigation */}
      <div>
        <h3 className="font-bold mb-3 text-primary-700">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/about" className="hover:text-primary-600 transition-colors">About Us</a></li>
          <li><a href="/contact" className="hover:text-primary-600 transition-colors">Contact</a></li>
          <li><a href="/faq" className="hover:text-primary-600 transition-colors">FAQ</a></li>
          <li><a href="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
          <li><a href="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
        </ul>
      </div>
      {/* Contact Info */}
      <div>
        <h3 className="font-bold mb-3 text-primary-700">Contact</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><FiMail className="w-4 h-4" /> support@picklebusiness.com</li>
          <li className="flex items-center gap-2"><FiPhone className="w-4 h-4" /> (555) 123-4567</li>
          <li className="flex items-center gap-2"><FiMapPin className="w-4 h-4" /> 123 Pickle Lane, Crunch City, USA</li>
        </ul>
      </div>
      {/* Social */}
      <div>
        <h3 className="font-bold mb-3 text-primary-700">Follow Us</h3>
        <div className="flex items-center gap-4 mb-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-primary-600 transition-colors">
            <FiInstagram className="w-6 h-6" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-primary-600 transition-colors">
            <FiFacebook className="w-6 h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-primary-600 transition-colors">
            <FiTwitter className="w-6 h-6" />
          </a>
        </div>
        <p className="text-xs text-gray-400">#PickleBusiness</p>
      </div>
    </div>
  </footer>
);

export default Footer; 