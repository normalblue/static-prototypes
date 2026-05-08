import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, Clock, Minus, Plus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

interface ProductInfoPageProps {
  productId: string;
  onBack: () => void;
}

export function ProductInfoPage({ productId, onBack }: ProductInfoPageProps) {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
        <button onClick={onBack} className="text-brand-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const isThai = i18n.language === 'th';
  const name = isThai ? product.nameTh : product.nameEn;
  const category = isThai ? product.categoryTh : product.categoryEn;
  const unit = isThai ? product.unitTh : product.unitEn;
  const tags = isThai ? product.tagsTh : product.tagsEn;

  // Mock descriptive text based on language
  const description = isThai 
    ? `ผลิตภัณฑ์คุณภาพระดับพรีเมียม ส่งตรงจากแหล่งผลิตที่เชื่อถือได้ (${product.supplier}) ผ่านการตรวจสอบคุณภาพอย่างเข้มงวดเพื่อให้มั่นใจว่าคุณได้รับสินค้าที่สดใหม่และดีที่สุด เหมาะสำหรับธุรกิจร้านอาหาร โรงแรม และการจัดเลี้ยงที่ต้องการวัตถุดิบคุณภาพสูง`
    : `Premium quality product sourced directly from trusted suppliers (${product.supplier}). Subject to rigorous quality control to ensure you receive the freshest and best ingredients. Perfect for restaurants, hotels, and catering businesses that demand high-quality materials.`;

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(e, product, quantity);
    setQuantity(1); // Reset after adding
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 group w-max"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">{t('search.previous') || 'Back'}</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-1/2 bg-slate-100 relative min-h-[400px] lg:min-h-[600px]">
              {product.promotion && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg z-10 shadow-sm">
                  {product.promotion}
                </div>
              )}
              <img 
                src={product.image} 
                alt={name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-slate-800 text-white text-lg font-semibold px-6 py-2 rounded-full shadow-lg">
                    {t('product.outOfStock') || 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-100">
                  {category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                  <span className="text-xs text-amber-600/60">({product.reviews})</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-2">
                {name}
              </h1>
              <p className="text-lg text-slate-500 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Verified Supplier: <span className="font-medium text-slate-700">{product.supplier}</span>
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                {description}
              </p>

              <div className="mt-auto bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{t('filters.price') || 'Price'}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-slate-900">฿{product.price.toFixed(2)}</span>
                      <span className="text-slate-500 mb-1">/ {unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-500" />
                      <span>{t('filters.delivery') || 'Delivery'}: <span className="text-slate-900">{product.deliveryEta}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-500" />
                      <span>{t('filters.stockStatus') || 'Stock'}: <span className={product.inStock ? 'text-emerald-600' : 'text-red-500'}>{product.inStock ? (t('filters.inStockOnly') || 'In Stock') : (t('product.outOfStock') || 'Out of Stock')}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-2 w-full sm:w-32 h-14">
                    <button 
                      onClick={handleDecrease}
                      disabled={!product.inStock || quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-slate-900">{quantity}</span>
                    <button 
                      onClick={handleIncrease}
                      disabled={!product.inStock}
                      className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button 
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl text-base font-bold transition-all shadow-sm ${
                      product.inStock 
                        ? 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow active:scale-[0.98]' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{t('product.add') || 'Add to Cart'} - ฿{(product.price * quantity).toFixed(2)}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
