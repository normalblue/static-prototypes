import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, TrendingUp } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onSearch: (query: string) => void;
  onNavigateProduct: (id: string) => void;
}

export function LandingPage({ onSearch, onNavigateProduct }: LandingPageProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();
  
  const isThai = i18n.language === 'th';

  const filteredProducts = query 
    ? MOCK_PRODUCTS.filter(p => 
        p.nameTh.toLowerCase().includes(query.toLowerCase()) || 
        p.nameEn.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryTh.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryEn.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const popularSearches = isThai 
    ? ['แซลมอน', 'อกไก่', 'ผักกาดออร์แกนิค', 'นม']
    : ['Salmon', 'Chicken Breast', 'Organic Lettuce', 'Milk'];

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-20 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          {t('landing.title')}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>

        {/* Big Search Bar */}
        <div className="relative w-full max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className={`relative flex items-center bg-white rounded-2xl shadow-lg border-2 transition-colors duration-300 ${isFocused ? 'border-brand-500 shadow-brand-100/50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <Search className={`absolute left-6 h-6 w-6 transition-colors ${isFocused ? 'text-brand-500' : 'text-slate-400'}`} />
            <input
              ref={inputRef}
              type="text"
              className="w-full h-16 md:h-20 pl-16 pr-32 text-lg md:text-xl text-slate-900 bg-transparent outline-none rounded-2xl placeholder:text-slate-400"
              placeholder={t('header.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            <button 
              type="submit"
              className="absolute right-3 top-3 bottom-3 bg-brand-500 hover:bg-brand-600 text-white px-6 rounded-xl font-semibold text-lg transition-colors flex items-center shadow-sm"
            >
              {t('header.search')}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isFocused && query && (
            <div 
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {filteredProducts.length > 0 ? (
                <div className="flex flex-col md:flex-row">
                  {/* Section A: Text Suggestions */}
                  <div className="md:w-1/2 p-2 border-b md:border-b-0 md:border-r border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Suggestions</h3>
                    <ul>
                      {filteredProducts.slice(0, 5).map(product => {
                        const name = isThai ? product.nameTh : product.nameEn;
                        return (
                          <li key={product.id}>
                            <button
                              type="button"
                              onClick={() => onNavigateProduct(product.id)}
                              className="w-full text-left flex items-center p-3 hover:bg-brand-50 rounded-xl transition-colors group"
                            >
                              <img src={product.image} alt={name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                              <div className="ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 truncate group-hover:text-brand-700">{name}</p>
                                <p className="text-xs text-slate-500 truncate">{product.supplier}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Section B: Visual Cards */}
                  <div className="md:w-1/2 p-4 bg-slate-50/50">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t('landing.topProducts')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                      {filteredProducts.slice(0, 2).map(product => (
                        <div key={`visual-${product.id}`} className="w-full">
                          <ProductCard product={product} compact onClick={() => onNavigateProduct(product.id)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p>{t('landing.noResults')} "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular Searches */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm">
          <span className="flex items-center text-slate-500 font-medium">
            <TrendingUp className="w-4 h-4 mr-1.5" /> Popular:
          </span>
          {popularSearches.map(term => (
            <button
              key={term}
              onClick={() => onSearch(term)}
              className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-colors shadow-sm"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-100/40 blur-3xl" />
      </div>
    </div>
  );
}
