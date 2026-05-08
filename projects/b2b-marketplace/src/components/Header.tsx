import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Menu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onSearch: (query: string) => void;
  currentPage: 'landing' | 'search' | 'product';
  onNavigateHome: () => void;
  onNavigateProduct: (id: string) => void;
}

export function Header({ onSearch, currentPage, onNavigateHome, onNavigateProduct }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const { cartCount, cartItems, isAnimating, addToCart } = useCart();
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const [showCart, setShowCart] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideDesktop = desktopSearchRef.current?.contains(event.target as Node);
      const isInsideMobile = mobileSearchRef.current?.contains(event.target as Node);
      const isInsideCart = cartRef.current?.contains(event.target as Node);
      
      if (!isInsideDesktop && !isInsideMobile) {
        setShowAutocomplete(false);
      }

      if (!isInsideCart) {
        setShowCart(false);
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

  const isThai = i18n.language === 'th';
  
  const toggleLanguage = () => {
    i18n.changeLanguage(isThai ? 'en' : 'th');
  };

  const filteredProducts = query 
    ? MOCK_PRODUCTS.filter(p => 
        p.nameTh.toLowerCase().includes(query.toLowerCase()) || 
        p.nameEn.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryTh.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryEn.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || currentPage === 'search' ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top row: logo / search (sm+) / cart */}
        <div className="flex justify-between items-center h-14 sm:h-20">

          {/* Logo */}
          <div className="flex items-center cursor-pointer flex-shrink-0" onClick={onNavigateHome}>
            <Menu className="h-6 w-6 text-slate-500 mr-3 lg:hidden" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">F</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 hidden sm:block">{t('header.brand')}</span>
            </div>
          </div>

          {/* Search Bar — inline on sm+ only */}
          {currentPage === 'search' && (
            <div className="hidden sm:flex flex-1 max-w-3xl mx-6 lg:mx-8 relative" ref={desktopSearchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
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
                  {t('header.search')}
                </button>
              </form>

              {/* Desktop Autocomplete */}
              {showAutocomplete && query && (
                <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-2">
                    {filteredProducts.slice(0, 5).map(product => {
                      const name = isThai ? product.nameTh : product.nameEn;
                      const unit = isThai ? product.unitTh : product.unitEn;
                      return (
                        <div 
                          key={product.id} 
                          className="flex items-center p-3 hover:bg-brand-50 rounded-xl cursor-pointer transition-colors"
                          onClick={() => {
                            setShowAutocomplete(false);
                            onNavigateProduct(product.id);
                          }}
                        >
                          <img src={product.image} alt={name} className="w-10 h-10 rounded-lg object-cover mr-4" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-900">{name}</h4>
                            <p className="text-xs text-slate-500">{product.supplier}</p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-brand-600">฿{product.price.toFixed(2)}</p>
                              <p className="text-xs text-slate-400">/ {unit}</p>
                            </div>
                            <button 
                              disabled={!product.inStock}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(e as unknown as React.MouseEvent<HTMLButtonElement>, product);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                product.inStock 
                                  ? 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-slate-200"
            >
              <Globe className="w-4 h-4" />
              <span>{isThai ? 'TH' : 'EN'}</span>
            </button>

            <button 
              onClick={() => onSearch('')}
              className="hidden lg:flex items-center px-4 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-all border border-brand-100 shadow-sm mr-4"
            >
              {t('header.advancedSearch')}
            </button>
            
            <div className="relative group" ref={cartRef}>
              <motion.button 
                onClick={() => setShowCart(!showCart)}
                className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-sm border border-slate-200 hover:border-brand-300 transition-colors cursor-pointer"
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

              {/* Cart Dropdown — state-controlled for mobile toggle + hover support */}
              <div className={`fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-200 z-50 ${showCart ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                <div className="p-4 border-b border-slate-50">
                  <h3 className="font-semibold text-slate-900">{t('header.yourCart')}</h3>
                  <p className="text-xs text-slate-500">{cartCount} {t('header.items')}</p>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, idx) => {
                      const name = isThai ? item.product.nameTh : item.product.nameEn;
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                          <img src={item.product.image} alt={name} className="w-12 h-12 rounded-md object-cover bg-slate-100" />
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
                            <p className="text-xs text-slate-500">฿{item.product.price.toFixed(2)} x {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-brand-600">
                            ฿{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-sm">
                      {t('header.emptyCart')}
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="p-4 border-t border-slate-50">
                    <button className="w-full bg-brand-500 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-600 transition-colors shadow-sm">
                      {t('header.viewCart')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full border border-slate-300 overflow-hidden cursor-pointer">
              <img src="/images/avatar.png" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Mobile search row — second row, only on search page, only on xs (<sm) */}
        {currentPage === 'search' && (
          <div className="sm:hidden pb-2 relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                className="w-full h-10 pl-9 pr-20 rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all outline-none text-sm"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
              />
              <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <button type="submit" className="absolute right-1.5 bg-brand-500 hover:bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors">
                {t('header.search')}
              </button>
            </form>

            {/* Mobile Autocomplete Dropdown */}
            {showAutocomplete && query && (
              <div className="absolute left-0 right-0 top-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-y-auto max-h-[55vh] z-50">
                <div className="p-2">
                    {filteredProducts.slice(0, 8).map(product => {
                      const name = isThai ? product.nameTh : product.nameEn;
                      return (
                        <div key={product.id} className="relative overflow-hidden rounded-xl mb-1 last:mb-0 bg-brand-500">
                          {/* Background revealed on swipe */}
                          <div className="absolute inset-0 flex items-center px-4 text-white font-bold">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="w-5 h-5" />
                              <span className="text-sm">{t('header.addedToCart')}</span>
                            </div>
                          </div>

                          <motion.div 
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            onDragEnd={(_, info) => {
                              // If swiped right enough, add to cart
                              if (info.offset.x > 100) {
                                addToCart(null as any, product);
                              }
                            }}
                            className="relative flex items-center p-2.5 bg-white hover:bg-brand-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                            onClick={(e) => {
                              // Don't navigate if it was a drag
                              if (Math.abs((e as any).movementX || 0) > 5) return;
                              setShowAutocomplete(false);
                              onNavigateProduct(product.id);
                            }}
                          >
                            <img src={product.image} alt={name} className="w-9 h-9 rounded-lg object-cover mr-3 flex-shrink-0" />
                            <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-medium text-slate-900 truncate">{name}</h4>
                              <p className="text-xs text-slate-500 truncate">{product.supplier}</p>
                            </div>
                            <p className="text-sm font-semibold text-brand-600 ml-2 flex-shrink-0">฿{product.price.toFixed(0)}</p>
                          </motion.div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
