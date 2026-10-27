import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === (product._id || product.product));
      if (existing) {
        return prevItems.map((item) =>
          item.product === (product._id || product.product)
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id || product.product,
            title: product.title,
            image: product.images?.[0] || product.image || '',
            price: product.discountPrice > 0 ? product.discountPrice : product.price,
            stock: product.stock,
            quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountPercent(0);
    setCouponCode('');
    localStorage.removeItem('cartItems');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NEX10') {
      setDiscountPercent(10);
      setCouponCode('NEX10');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'SAVE20') {
      setDiscountPercent(20);
      setCouponCode('SAVE20');
      return { success: true, message: '20% special discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try NEX10 or SAVE20' };
    }
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (itemsPrice * discountPercent) / 100;
  const taxablePrice = itemsPrice - discountAmount;
  const shippingPrice = taxablePrice > 1499 || taxablePrice === 0 ? 0 : 99;
  const taxPrice = Number((taxablePrice * 0.05).toFixed(2));
  const totalPrice = Number((taxablePrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        discountPercent,
        discountAmount,
        couponCode,
        shippingPrice,
        taxPrice,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
