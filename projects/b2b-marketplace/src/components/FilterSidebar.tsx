import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES_EN, CATEGORIES_TH, ATTRIBUTES_EN, ATTRIBUTES_TH, DELIVERY_OPTIONS_EN, DELIVERY_OPTIONS_TH } from '../data/mockData';
import { FilterState } from './SearchPage';
import { useTranslation } from 'react-i18next';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearSearch: () => void;
  /** When true, renders without outer fixed-width wrapper (for use in bottom sheet) */
  inSheet?: boolean;
}

export function FilterSidebar({ filters, setFilters, onClearSearch, inSheet = false }: FilterSidebarProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language === 'th';
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Category: true,
    Attributes: true,
    Price: true,
    Delivery: false,
    Stock: true,
  });

  const CATEGORIES = isThai ? CATEGORIES_TH : CATEGORIES_EN;
  const ATTRIBUTES = isThai ? ATTRIBUTES_TH : ATTRIBUTES_EN;
  const DELIVERY_OPTIONS = isThai ? DELIVERY_OPTIONS_TH : DELIVERY_OPTIONS_EN;

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: string) => {
    if (category === CATEGORIES_EN[0] || category === CATEGORIES_TH[0]) {
      setFilters(prev => ({ ...prev, categories: [] }));
      return;
    }
    
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleAttributeChange = (attr: string) => {
    setFilters(prev => {
      const isSelected = prev.attributes.includes(attr);
      if (isSelected) {
        return { ...prev, attributes: prev.attributes.filter(a => a !== attr) };
      } else {
        return { ...prev, attributes: [...prev.attributes, attr] };
      }
    });
  };

  const clearAll = () => {
    setFilters({
      categories: [],
      attributes: [],
      maxPrice: 5000,
      delivery: null,
      inStockOnly: false,
    });
    onClearSearch();
  };

  const Accordion = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <div className="border-b border-slate-100 py-4">
      <button 
        className="flex items-center justify-between w-full text-left font-semibold text-slate-800"
        onClick={() => toggleSection(id)}
      >
        <span>{title}</span>
        {openSections[id] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {openSections[id] && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={inSheet ? 'w-full' : 'w-64 flex-shrink-0 pr-6'}>
      <div className={inSheet ? '' : 'sticky top-24 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm'}>
        {!inSheet && (
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900">{t('filters.filters')}</h2>
            <button onClick={clearAll} className="text-xs font-medium text-brand-600 hover:text-brand-700">{t('filters.clearAll')}</button>
          </div>
        )}

        <Accordion id="Category" title={t('filters.category')}>
          <div className="space-y-2">
            {CATEGORIES.map(category => {
              const isAll = category === CATEGORIES_EN[0] || category === CATEGORIES_TH[0];
              const isChecked = isAll ? filters.categories.length === 0 : filters.categories.includes(category);
              return (
                <label key={category} className="flex items-center group cursor-pointer">
                  <div className={`relative flex items-center justify-center w-5 h-5 mr-3 border rounded transition-colors ${isChecked ? 'bg-white border-brand-500' : 'bg-white border-slate-300 group-hover:border-brand-500'}`}>
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={isChecked}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {isChecked && <div className="w-3 h-3 bg-brand-500 rounded-sm"></div>}
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{category}</span>
                </label>
              );
            })}
          </div>
        </Accordion>

        <Accordion id="Attributes" title={t('filters.attributes')}>
          <div className="space-y-2">
            {ATTRIBUTES.map(attr => {
              const isChecked = filters.attributes.includes(attr);
              return (
                <label key={attr} className="flex items-center group cursor-pointer">
                  <div className={`relative flex items-center justify-center w-5 h-5 mr-3 border rounded transition-colors ${isChecked ? 'bg-white border-brand-500' : 'bg-white border-slate-300 group-hover:border-brand-500'}`}>
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={isChecked}
                      onChange={() => handleAttributeChange(attr)}
                    />
                    {isChecked && <div className="w-3 h-3 bg-brand-500 rounded-sm"></div>}
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{attr}</span>
                </label>
              );
            })}
          </div>
        </Accordion>

        <Accordion id="Price" title={t('filters.price')}>
          <div className="px-1 py-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-700">{t('filters.upTo')} ฿{filters.maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5000" 
              step="50"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
              className="w-full accent-brand-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>฿0</span>
              <span>฿5,000+</span>
            </div>
          </div>
        </Accordion>

        <Accordion id="Delivery" title={t('filters.delivery')}>
          <div className="space-y-2">
            <label className="flex items-center group cursor-pointer">
              <div className={`relative flex items-center justify-center w-5 h-5 mr-3 border rounded-full transition-colors ${filters.delivery === null ? 'bg-white border-brand-500' : 'bg-white border-slate-300 group-hover:border-brand-500'}`}>
                <input 
                  type="radio" 
                  name="delivery" 
                  className="peer sr-only" 
                  checked={filters.delivery === null}
                  onChange={() => setFilters(prev => ({ ...prev, delivery: null }))}
                />
                {filters.delivery === null && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full"></div>}
              </div>
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{t('filters.anyDelivery')}</span>
            </label>
            {DELIVERY_OPTIONS.map(opt => {
              const isChecked = filters.delivery === opt;
              return (
                <label key={opt} className="flex items-center group cursor-pointer">
                  <div className={`relative flex items-center justify-center w-5 h-5 mr-3 border rounded-full transition-colors ${isChecked ? 'bg-white border-brand-500' : 'bg-white border-slate-300 group-hover:border-brand-500'}`}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      className="peer sr-only" 
                      checked={isChecked}
                      onChange={() => setFilters(prev => ({ ...prev, delivery: opt }))}
                    />
                    {isChecked && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full"></div>}
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{opt}</span>
                </label>
              );
            })}
          </div>
        </Accordion>

        <Accordion id="Stock" title={t('filters.stockStatus')}>
          <label className="flex items-center group cursor-pointer mt-1">
            <div className={`relative flex items-center justify-center w-10 h-5 mr-3 rounded-full transition-colors ${filters.inStockOnly ? 'bg-brand-500' : 'bg-slate-200'}`}>
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              />
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filters.inStockOnly ? 'left-6' : 'left-1'}`}></div>
            </div>
            <span className="text-sm text-slate-600 font-medium">{t('filters.inStockOnly')}</span>
          </label>
        </Accordion>
      </div>
    </div>
  );
}
