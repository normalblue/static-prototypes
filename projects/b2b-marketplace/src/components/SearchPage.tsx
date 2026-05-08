import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface SearchPageProps {
  initialQuery: string;
}

export function SearchPage({ initialQuery }: SearchPageProps) {
  // For the prototype, we simply filter our mock products by name or category.
  const queryLower = initialQuery.toLowerCase();
  const results = initialQuery 
    ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(queryLower) || p.category.toLowerCase().includes(queryLower))
    : MOCK_PRODUCTS;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Results Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-slate-900">
              {initialQuery ? `Search results for "${initialQuery}"` : 'All Products'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{results.length} products found</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 mr-4">
              {['In Stock', 'Cheapest', 'Fast Delivery'].map(chip => (
                <span key={chip} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                  {chip}
                </span>
              ))}
            </div>

            <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-white hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-normal">Sort by:</span> Recommended
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters */}
            {initialQuery && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-500">Active filters:</span>
                <span className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-md border border-brand-100">
                  Search: {initialQuery}
                  <X className="w-3 h-3 cursor-pointer hover:text-brand-900" />
                </span>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No products found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {results.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">Previous</button>
                  <button className="w-10 h-10 flex items-center justify-center bg-brand-500 text-white rounded-lg text-sm font-medium shadow-sm">1</button>
                  <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">2</button>
                  <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">3</button>
                  <span className="px-2 text-slate-400">...</span>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
