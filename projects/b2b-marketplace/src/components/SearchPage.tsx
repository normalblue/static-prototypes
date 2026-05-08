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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    attributes: [],
    maxPrice: 5000,
    delivery: null,
    inStockOnly: false,
  });

  const queryLower = initialQuery.toLowerCase();

  const results = MOCK_PRODUCTS.filter(product => {
    if (queryLower) {
      const matchText =
        product.nameTh.toLowerCase().includes(queryLower) ||
        product.nameEn.toLowerCase().includes(queryLower) ||
        product.categoryTh.toLowerCase().includes(queryLower) ||
        product.categoryEn.toLowerCase().includes(queryLower);
      if (!matchText) return false;
    }
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(product.categoryTh) && !filters.categories.includes(product.categoryEn)) return false;
    }
    if (filters.attributes.length > 0) {
      const hasAll = filters.attributes.every(attr =>
        product.tagsTh.includes(attr) || product.tagsEn.includes(attr)
      );
      if (!hasAll) return false;
    }
    if (product.price > filters.maxPrice) return false;
    if (filters.delivery && product.deliveryEta !== filters.delivery) return false;
    if (filters.inStockOnly && !product.inStock) return false;
    return true;
  });

  const removeFilter = (type: 'category' | 'attribute' | 'delivery' | 'inStockOnly' | 'price', value?: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (type === 'category' && value) next.categories = next.categories.filter(c => c !== value);
      else if (type === 'attribute' && value) next.attributes = next.attributes.filter(a => a !== value);
      else if (type === 'delivery') next.delivery = null;
      else if (type === 'inStockOnly') next.inStockOnly = false;
      else if (type === 'price') next.maxPrice = 5000;
      return next;
    });
  };

  const clearAllFilters = () => {
    setFilters({ categories: [], attributes: [], maxPrice: 5000, delivery: null, inStockOnly: false });
    onClearSearch();
  };

  const activeFilterCount =
    filters.categories.length +
    filters.attributes.length +
    (filters.maxPrice < 5000 ? 1 : 0) +
    (filters.delivery ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || !!initialQuery;

  return (
    <div className="min-h-screen pt-28 sm:pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Results Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-3 md:mb-0">
            <h1 className="text-xl font-bold text-slate-900">
              {initialQuery ? `${t('search.resultsFor')} "${initialQuery}"` : t('search.allProducts')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{results.length} {t('search.productsFound')}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop quick filter */}
            <div className="hidden lg:flex items-center gap-2 mr-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${filters.inStockOnly ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {t('search.inStock')}
              </button>
            </div>

            {/* Mobile: Filters button with count badge */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden relative flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 bg-white"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters.filters')}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-white hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-normal">{t('search.sortBy')}</span> {t('search.recommended')}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} onClearSearch={onClearSearch} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Active Filters bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-slate-500 font-medium">{t('search.activeFilters')}</span>

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

                {/* Clear all — always visible */}
                <button
                  onClick={clearAllFilters}
                  className="ml-1 text-xs font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                >
                  {t('filters.clearAll')}
                </button>
              </div>
            )}

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

      {/* ── Mobile Filter Bottom Sheet ── */}
      {showMobileFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* Sheet panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">{t('filters.filters')}</h2>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {t('filters.clearAll')}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Scrollable filter body */}
            <div className="overflow-y-auto flex-1 px-2">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onClearSearch={onClearSearch}
                inSheet
              />
            </div>

            {/* Done button */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-2xl transition-colors shadow-sm text-base"
              >
                {`Show ${results.length} results`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
