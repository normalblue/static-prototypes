import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      header: {
        searchPlaceholder: 'ค้นหาวัตถุดิบ, อาหารทะเล, เนื้อสัตว์, ผัก...',
        search: 'ค้นหา',
        myLists: 'รายการของฉัน',
        orders: 'คำสั่งซื้อ',
        yourCart: 'ตะกร้าสินค้าของคุณ',
        items: 'ชิ้น',
        viewCart: 'ดูตะกร้าและชำระเงิน',
        emptyCart: 'ตะกร้าของคุณว่างเปล่า',
        brand: 'FreshMarket'
      },
      landing: {
        title: 'แพลตฟอร์มจัดซื้ออาหาร B2B',
        subtitle: 'ค้นพบวัตถุดิบขายส่งจากซัพพลายเออร์ที่เชื่อถือได้ พร้อมการจัดส่งที่รวดเร็ว',
        trending: 'หมวดหมู่ยอดนิยม',
        topProducts: 'สินค้ายอดนิยม',
        noResults: 'ไม่พบผลลัพธ์สำหรับ',
      },
      search: {
        resultsFor: 'ผลการค้นหาสำหรับ',
        allProducts: 'สินค้าทั้งหมด',
        productsFound: 'รายการที่พบ',
        inStock: 'มีสินค้า',
        cheapest: 'ราคาถูกสุด',
        fastDelivery: 'ส่งด่วน',
        sortBy: 'เรียงตาม:',
        recommended: 'แนะนำ',
        activeFilters: 'ตัวกรองที่ใช้งาน:',
        noProducts: 'ไม่พบสินค้า',
        tryAdjusting: 'ลองปรับการค้นหาหรือตัวกรองของคุณ',
        previous: 'ก่อนหน้า',
        next: 'ถัดไป',
        searchQuery: 'ค้นหา:'
      },
      filters: {
        filters: 'ตัวกรอง',
        clearAll: 'ล้างทั้งหมด',
        category: 'หมวดหมู่',
        attributes: 'คุณลักษณะ',
        price: 'ราคา',
        upTo: 'สูงสุด',
        delivery: 'การจัดส่ง',
        anyDelivery: 'จัดส่งแบบใดก็ได้',
        stockStatus: 'สถานะสินค้า',
        inStockOnly: 'มีสินค้าเท่านั้น'
      },
      product: {
        outOfStock: 'สินค้าหมด',
        per: 'ต่อ',
        add: 'เพิ่ม'
      }
    }
  },
  en: {
    translation: {
      header: {
        searchPlaceholder: 'Search ingredients, seafood, meat, vegetables...',
        search: 'Search',
        myLists: 'My Lists',
        orders: 'Orders',
        yourCart: 'Your Cart',
        items: 'items',
        viewCart: 'View Cart & Checkout',
        emptyCart: 'Your cart is empty',
        brand: 'FreshMarket'
      },
      landing: {
        title: 'B2B Food Procurement',
        subtitle: 'Discover wholesale ingredients from trusted suppliers with fast delivery.',
        trending: 'Trending Categories',
        topProducts: 'Top Products',
        noResults: 'No results found for',
      },
      search: {
        resultsFor: 'Search results for',
        allProducts: 'All Products',
        productsFound: 'products found',
        inStock: 'In Stock',
        cheapest: 'Cheapest',
        fastDelivery: 'Fast Delivery',
        sortBy: 'Sort by:',
        recommended: 'Recommended',
        activeFilters: 'Active filters:',
        noProducts: 'No products found',
        tryAdjusting: 'Try adjusting your search or filter criteria.',
        previous: 'Previous',
        next: 'Next',
        searchQuery: 'Search:'
      },
      filters: {
        filters: 'Filters',
        clearAll: 'Clear all',
        category: 'Category',
        attributes: 'Attributes',
        price: 'Price',
        upTo: 'Up to',
        delivery: 'Delivery',
        anyDelivery: 'Any delivery',
        stockStatus: 'Stock Status',
        inStockOnly: 'In Stock Only'
      },
      product: {
        outOfStock: 'Out of Stock',
        per: 'per',
        add: 'Add'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'th',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
