import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockData';

interface HeaderProps {
  onSearch: (query: string) => void;
  currentPage: 'landing' | 'search';
  onNavigateHome: () => void;
}

export function Header({ onSearch, currentPage, onNavigateHome }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const { cartCount, isAnimating } = useCart();
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowAutocomplete(false);
      onSearch(query);
    }
  };

  const filteredProducts = query 
    ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || currentPage === 'search' ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
            <Menu className="h-6 w-6 text-slate-500 mr-4 lg:hidden" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-slate-900 hidden sm:block">FreshMarket</span>
            </div>
          </div>

          {/* Search Bar - Only show in Header if on Search Page, else hide (Landing has its own big one) */}
          {currentPage === 'search' && (
            <div className="flex-1 max-w-3xl mx-8 relative" ref={autocompleteRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search ingredients, seafood, meat, vegetables..."
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all outline-none"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowAutocomplete(true);
                  }}
                  onFocus={() => setShowAutocomplete(true)}
                />
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <button type="submit" className="absolute right-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                  Search
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showAutocomplete && query && (
                <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-2">
                    {filteredProducts.slice(0, 5).map(product => (
                      <div 
                        key={product.id} 
                        className="flex items-center p-3 hover:bg-brand-50 rounded-xl cursor-pointer transition-colors"
                        onClick={() => {
                          setQuery(product.name);
                          setShowAutocomplete(false);
                          onSearch(product.name);
                        }}
                      >
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover mr-4" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-900">{product.name}</h4>
                          <p className="text-xs text-slate-500">{product.supplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-brand-600">฿{product.price.toFixed(2)}</p>
                          <p className="text-xs text-slate-400">/ {product.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 mr-4 text-sm font-medium text-slate-600">
              <span className="cursor-pointer hover:text-brand-600 transition-colors">My Lists</span>
              <span className="cursor-pointer hover:text-brand-600 transition-colors">Orders</span>
            </div>
            <motion.button 
              className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 hover:border-brand-300 transition-colors"
              animate={isAnimating ? { scale: [1, 1.2, 0.9, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart className="h-5 w-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </motion.button>
            <div className="w-10 h-10 bg-slate-200 rounded-full border border-slate-300 overflow-hidden cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=User&background=f8fafc&color=0f172a" alt="User" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
