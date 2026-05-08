export interface Product {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: string;
  category: string;
  tags: string[];
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  deliveryEta: string;
  promotion?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Chicken Breast (Boneless)',
    supplier: 'CP Foods Thailand',
    price: 125.00,
    unit: '1 kg',
    category: 'Meat',
    tags: ['Fresh', 'Halal', 'Local'],
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 342,
    inStock: true,
    deliveryEta: 'Same-day',
    promotion: '10% off bulk',
  },
  {
    id: 'p2',
    name: 'Premium Norwegian Salmon Whole',
    supplier: 'Thammachart Seafood',
    price: 680.00,
    unit: '1 kg',
    category: 'Seafood',
    tags: ['Fresh', 'Imported'],
    image: 'https://images.unsplash.com/photo-1599084927502-ae926b8cbdfd?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 128,
    inStock: true,
    deliveryEta: 'Next-day',
  },
  {
    id: 'p3',
    name: 'Frozen Chicken Wings (Middle)',
    supplier: 'Betagro',
    price: 95.00,
    unit: '1 kg',
    category: 'Meat',
    tags: ['Frozen', 'Halal'],
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 512,
    inStock: true,
    deliveryEta: 'Same-day',
  },
  {
    id: 'p4',
    name: 'Australian Angus Beef Ribeye',
    supplier: 'Meat & Co',
    price: 1250.00,
    unit: '1 kg',
    category: 'Meat',
    tags: ['Fresh', 'Imported'],
    image: 'https://images.unsplash.com/photo-1603360946369-dc9aec65a585?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviews: 89,
    inStock: false,
    deliveryEta: 'Scheduled',
  },
  {
    id: 'p5',
    name: 'Organic Romaine Lettuce',
    supplier: 'Royal Project Foundation',
    price: 45.00,
    unit: '500 g',
    category: 'Vegetables',
    tags: ['Fresh', 'Organic', 'Local'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 215,
    inStock: true,
    deliveryEta: 'Same-day',
  },
  {
    id: 'p6',
    name: 'Fresh Hokkaido Milk (Pasteurized)',
    supplier: 'Meiji',
    price: 89.00,
    unit: '2 Liters',
    category: 'Dairy',
    tags: ['Fresh', 'Local'],
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 840,
    inStock: true,
    deliveryEta: 'Same-day',
  },
  {
    id: 'p7',
    name: 'Tiger Prawns Size 20-25',
    supplier: 'Ocean Fresh',
    price: 450.00,
    unit: '1 kg',
    category: 'Seafood',
    tags: ['Fresh', 'Local'],
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 176,
    inStock: true,
    deliveryEta: 'Next-day',
  },
  {
    id: 'p8',
    name: 'Cheddar Cheese Block',
    supplier: 'Allowrie',
    price: 320.00,
    unit: '1 kg',
    category: 'Dairy',
    tags: ['Imported'],
    image: 'https://images.unsplash.com/photo-1628088062820-d464879df9cc?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 95,
    inStock: true,
    deliveryEta: 'Same-day',
  }
];

export const CATEGORIES = ['All', 'Meat', 'Seafood', 'Vegetables', 'Dairy', 'Frozen', 'Dry Goods'];
export const ATTRIBUTES = ['Organic', 'Halal', 'Imported', 'Local', 'Frozen', 'Fresh'];
export const DELIVERY_OPTIONS = ['Same-day delivery', 'Next-day delivery', 'Scheduled delivery'];
