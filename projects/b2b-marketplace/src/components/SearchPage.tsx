import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchPageProps {
  initialQuery: string;
  onClearSearch: () => void;
  onNavigateProduct: (id: string) => void;
}

export interface FilterState {
  categories: string[];
  attributes: string[];
  maxPrice: number;
  delivery: string | null;
  inStockOnly: boolean;
}

export function SearchPage({ initialQuery, onClearSearch, onNavigateProduct }: SearchPageProps) {
  const { t } = useTranslation();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    attributes: [],
    maxPrice: 5000,
    delivery: null,
    inStockOnly: false,
  });

  const queryLower = initialQuery.toLowerCase();
  
  // Filtering logic
  const results = MOCK_PRODUCTS.filter(product => {
    // 1. Text Query (Search both Thai and English)
    if (queryLower) {
      const matchText = 
        product.nameTh.toLowerCase().includes(queryLower) || 
        product.nameEn.toLowerCase().includes(queryLower) || 
        product.categoryTh.toLowerCase().includes(queryLower) ||
        product.categoryEn.toLowerCase().includes(queryLower);
      if (!matchText) return false;
    }
    
    // 2. Categories (Match selected categories in either language)
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(product.categoryTh) && !filters.categories.includes(product.categoryEn)) return false;
    }

    // 3. Attributes (Tags) (Match selected attributes in either language)
    if (filters.attributes.length > 0) {
      const hasAllSelectedAttributes = filters.attributes.every(attr => 
        product.tagsTh.includes(attr) || product.tagsEn.includes(attr)
      );
      if (!hasAllSelectedAttributes) return false;
    }

    // 4. Price
    if (product.price > filters.maxPrice) return false;

    // 5. Delivery
    if (filters.delivery && product.deliveryEta !== filters.delivery) return false;

    // 6. Stock Status
    if (filters.inStockOnly && !product.inStock) return false;

    return true;
  });

  const removeFilter = (type: 'category' | 'attribute' | 'delivery' | 'inStockOnly' | 'price', value?: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (type === 'category' && value) {
        next.categories = next.categories.filter(c => c !== value);
      } else if (type === 'attribute' && value) {
        next.attributes = next.attributes.filter(a => a !== value);
      } else if (type === 'delivery') {
        next.delivery = null;
      } else if (type === 'inStockOnly') {
        next.inStockOnly = false;
      } else if (type === 'price') {
        next.maxPrice = 5000;
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Results Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-slate-900">
              {initialQuery ? `${t('search.resultsFor')} "${initialQuery}"` : t('search.allProducts')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{results.length} {t('search.productsFound')}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 mr-4">
              {/* Toolbar Quick Filters */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${filters.inStockOnly ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {t('search.inStock')}
              </button>
            </div>

            <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters.filters')}
            </button>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-white hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-normal">{t('search.sortBy')}</span> {t('search.recommended')}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} setFilters={setFilters} onClearSearch={onClearSearch} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-slate-500 mr-1">{t('search.activeFilters')}</span>
              
              {initialQuery && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">
                  {t('search.searchQuery')} {initialQuery}
                </span>
              )}

              {filters.categories.map(c => (
                <span key={`cat-${c}`} className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100">
                  {t('filters.category')}: {c}
                  <button onClick={() => removeFilter('category', c)}><X className="w-3 h-3 hover:text-brand-900" /></button>
                </span>
              ))}

              {filters.attributes.map(a => (
                <span key={`attr-${a}`} className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100">
                  {a}
                  <button onClick={() => removeFilter('attribute', a)}><X className="w-3 h-3 hover:text-brand-900" /></button>
                </span>
              ))}

              {filters.maxPrice < 5000 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100">
                  {t('filters.upTo')} ฿{filters.maxPrice}
                  <button onClick={() => removeFilter('price')}><X className="w-3 h-3 hover:text-brand-900" /></button>
                </span>
              )}

              {filters.delivery && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100">
                  {filters.delivery}
                  <button onClick={() => removeFilter('delivery')}><X className="w-3 h-3 hover:text-brand-900" /></button>
                </span>
              )}

              {filters.inStockOnly && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100">
                  {t('filters.inStockOnly')}
                  <button onClick={() => removeFilter('inStockOnly')}><X className="w-3 h-3 hover:text-brand-900" /></button>
                </span>
              )}

              {(!initialQuery && filters.categories.length === 0 && filters.attributes.length === 0 && filters.maxPrice === 5000 && !filters.delivery && !filters.inStockOnly) && (
                <span className="text-xs text-slate-400 italic">None</span>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results.map(product => (
                  <ProductCard key={product.id} product={product} onClick={() => onNavigateProduct(product.id)} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('search.noProducts')}</h3>
                  <p className="text-slate-500">{t('search.tryAdjusting')}</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {results.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">{t('search.previous')}</button>
                  <button className="w-10 h-10 flex items-center justify-center bg-brand-500 text-white rounded-lg text-sm font-medium shadow-sm">1</button>
                  <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">2</button>
                  <span className="px-2 text-slate-400">...</span>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">{t('search.next')}</button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
