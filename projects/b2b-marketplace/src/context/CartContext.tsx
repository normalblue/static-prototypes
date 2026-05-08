import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  addToCart: (event: React.MouseEvent<HTMLButtonElement>, productImage: string) => void;
  isAnimating: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const addToCart = (_e: React.MouseEvent<HTMLButtonElement>, _img: string) => {
    // In a real app, we'd animate a clone of the image flying to the cart.
    // For this prototype, we'll trigger a bounce animation on the cart icon.
    setCartCount(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500); // Reset animation state
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, isAnimating }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
