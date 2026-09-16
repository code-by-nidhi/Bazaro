import React, { createContext, useState, useEffect } from 'react';
import { validateCouponApi } from '../services/couponApi';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('bazaro_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem('bazaro_coupon');
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  const [couponError, setCouponError] = useState('');

  // Persist Cart Items
  useEffect(() => {
    localStorage.setItem('bazaro_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist Coupon
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('bazaro_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('bazaro_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, selectedVariant = {}) => {
    setCartItems((prevItems) => {
      // Generate unique key matching variant (size, color, weight)
      const variantKey = `${selectedVariant.size || ''}_${selectedVariant.color || ''}_${selectedVariant.weight || ''}`;
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id && item.variantKey === variantKey
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const currentQty = updated[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: {
              _id: product._id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              discountPrice: product.discountPrice || product.price,
              images: product.images,
              stock: product.stock,
              brand: product.brand,
            },
            quantity: Math.min(product.stock, quantity),
            selectedVariant,
            variantKey,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, variantKey) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product._id === productId && item.variantKey === variantKey))
    );
  };

  const updateQuantity = (productId, variantKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId && item.variantKey === variantKey) {
          return {
            ...item,
            quantity: Math.min(item.product.stock, quantity),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const subtotal = cartItems.reduce(
        (acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity,
        0
      );
      const data = await validateCouponApi({ code, cartTotal: subtotal });
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        return { success: true, message: data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to apply coupon.';
      setCouponError(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Pricing Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxPrice = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const shippingPrice = subtotal > 999 || cartItems.length === 0 ? 0 : 70;
  const totalAmount = Math.max(0, Math.round(subtotal - discountAmount + taxPrice + shippingPrice));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        appliedCoupon,
        couponError,
        subtotal,
        discountAmount,
        taxPrice,
        shippingPrice,
        totalAmount,
        totalItemsCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
