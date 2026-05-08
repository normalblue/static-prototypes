import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SearchPage } from './components/SearchPage';
import { ProductInfoPage } from './components/ProductInfoPage';
import { CartProvider } from './context/CartContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'search' | 'product'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  };

  const handleNavigateProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleNavigateHome = () => {
    setCurrentPage('landing');
    setSearchQuery('');
    setSelectedProductId(null);
    window.scrollTo(0, 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <CartProvider>
      <div className="font-sans antialiased text-slate-900 bg-white">
        <Header 
          onSearch={handleSearch} 
          currentPage={currentPage}
          onNavigateHome={handleNavigateHome} 
          onNavigateProduct={handleNavigateProduct}
        />
        
        <main>
          {currentPage === 'landing' && (
            <LandingPage onSearch={handleSearch} onNavigateProduct={handleNavigateProduct} />
          )}
          {currentPage === 'search' && (
            <SearchPage initialQuery={searchQuery} onClearSearch={handleClearSearch} onNavigateProduct={handleNavigateProduct} />
          )}
          {currentPage === 'product' && selectedProductId && (
            <ProductInfoPage productId={selectedProductId} onBack={() => {
              // Go back to search if query exists, else home
              setCurrentPage(searchQuery ? 'search' : 'landing');
            }} />
          )}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
