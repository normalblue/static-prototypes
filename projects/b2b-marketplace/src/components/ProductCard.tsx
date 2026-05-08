import { ShoppingCart, Star, Clock } from 'lucide-react';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  onClick?: () => void;
}

export function ProductCard({ product, compact = false, onClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  
  const isThai = i18n.language === 'th';
  const name = isThai ? product.nameTh : product.nameEn;
  const unit = isThai ? product.unitTh : product.unitEn;
  const category = isThai ? product.categoryTh : product.categoryEn;
  const tags = isThai ? product.tagsTh : product.tagsEn;

  if (compact) {
    return (
      <div 
        onClick={onClick}
        className="flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-3 w-full cursor-pointer group"
      >
        <div className="relative h-24 mb-3 overflow-hidden rounded-lg bg-slate-50">
          <img src={product.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">{name}</h4>
        <p className="text-xs text-slate-500 mb-2 truncate">{product.supplier}</p>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-brand-600">฿{product.price.toFixed(2)}</p>
            <p className="text-[10px] text-slate-400">/ {unit}</p>
          </div>
          <button 
            disabled={!product.inStock}
            onClick={(e) => { e.stopPropagation(); addToCart(e, product); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              product.inStock 
                ? 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t('product.add')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative"
    >
      {product.promotion && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
          {product.promotion}
        </div>
      )}
      <div className="relative h-48 overflow-hidden bg-slate-50">
        <img src={product.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{t('product.outOfStock')}</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">{category}</p>
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium text-slate-600 ml-1">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-slate-900 leading-tight mb-1 group-hover:text-brand-600 transition-colors line-clamp-2">{name}</h3>
        <p className="text-sm text-slate-500 mb-4">{product.supplier}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-center text-slate-400 mb-1">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-[10px]">{product.deliveryEta}</span>
            </div>
            <p className="text-lg font-bold text-slate-900">฿{product.price.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{t('product.per')} {unit}</p>
          </div>
          <button 
            disabled={!product.inStock}
            onClick={(e) => { e.stopPropagation(); addToCart(e, product); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              product.inStock 
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('product.add')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
