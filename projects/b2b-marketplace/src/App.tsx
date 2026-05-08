import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SearchPage } from './components/SearchPage';
import { CartProvider } from './context/CartContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'search'>('landing');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  };

  const handleNavigateHome = () => {
    setCurrentPage('landing');
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  return (
    <CartProvider>
      <div className="font-sans antialiased text-slate-900 bg-white">
        <Header 
          onSearch={handleSearch} 
          currentPage={currentPage}
          onNavigateHome={handleNavigateHome} 
        />
        
        <main>
          {currentPage === 'landing' ? (
            <LandingPage onSearch={handleSearch} />
          ) : (
            <SearchPage initialQuery={searchQuery} />
          )}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
