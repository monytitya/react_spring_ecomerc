import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext(null);

const getId = (i) => i?.pId ?? i?.pid ?? i?.productId ?? i?.id ?? null;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const isLoggedIn = !!(
    localStorage.getItem('admin_token') || localStorage.getItem('customer_token')
  );

  const cartCount = cartItems.reduce((sum, i) => sum + (i.qty || 0), 0);
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + (i.subtotal ?? ((i.productPrice ?? 0) * (i.qty ?? 1))),
    0
  );

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) { setCartItems([]); return; }
    try {
      const r = await cartApi.get();
      setCartItems(r.data?.data || []);
    } catch { }
  }, [isLoggedIn]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = useCallback(async (product, qty = 1) => {
    if (!isLoggedIn) return false;
    const productId = product?.productId ?? product?.id;
    if (!productId) return false;


    setCartItems(prev => {
      const existing = prev.find(i => getId(i) === productId);
      if (existing) {
        return prev.map(i =>
          getId(i) === productId
            ? { ...i, qty: (i.qty || 1) + qty, subtotal: (i.productPrice ?? 0) * ((i.qty || 1) + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          pId: productId,
          productId,
          productTitle: product.productTitle || product.title || '',
          productImg: product.productImg || product.imageName || product.imageFile || null,
          productPrice: product.productPrice ?? product.price ?? 0,
          qty,
          subtotal: (product.productPrice ?? product.price ?? 0) * qty,
        },
      ];
    });

    try {
      await cartApi.add({ productId, qty });
      cartApi.get().then(r => setCartItems(r.data?.data || [])).catch(() => { });
      return true;
    } catch {
      refreshCart();
      return false;
    }
  }, [isLoggedIn, refreshCart]);

  const removeFromCart = useCallback(async (productId) => {
    setCartItems(prev => prev.filter(i => getId(i) !== productId));
    try { await cartApi.remove(productId); }
    catch { refreshCart(); }
  }, [refreshCart]);

  const updateQty = useCallback(async (productId, newQty, price) => {
    setCartItems(prev =>
      prev.map(i => {
        if (getId(i) !== productId) return i;
        const unitPrice = price ?? i.productPrice ?? 0;
        return { ...i, qty: newQty, subtotal: unitPrice * newQty };
      })
    );
    try { await cartApi.updateQty(productId, newQty); }
    catch { refreshCart(); }
  }, [refreshCart]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    await cartApi.clear().catch(() => { });
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside <CartProvider>');
  return ctx;
};
