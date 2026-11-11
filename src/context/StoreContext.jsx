import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoStores } from '../data/stores.js';

const StoreContext = createContext(null);

const CART_KEY = 'noor-shop:cart';
const STORE_KEY = 'noor-shop:active-store';

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore storage errors */
  }
};

export function StoreProvider({ children }) {
  const [activeMerchantStoreId, setActiveMerchantStoreId] = useState(() =>
    readStorage(STORE_KEY, demoStores[0]?.id ?? null),
  );
  const [cart, setCart] = useState(() => readStorage(CART_KEY, { storeSlug: null, items: [] }));
  const [toast, setToast] = useState(null);

  useEffect(() => writeStorage(CART_KEY, cart), [cart]);
  useEffect(() => writeStorage(STORE_KEY, activeMerchantStoreId), [activeMerchantStoreId]);

  const notify = useCallback((message, tone = 'info') => {
    setToast({ id: Date.now(), message, tone });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback(
    (storeSlug, item) => {
      setCart((prev) => {
        if (prev.storeSlug && prev.storeSlug !== storeSlug) {
          return { storeSlug, items: [item] };
        }
        const existing = prev.items.find(
          (i) => i.productId === item.productId && i.variantKey === item.variantKey,
        );
        if (existing) {
          return {
            storeSlug,
            items: prev.items.map((i) =>
              i === existing ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          };
        }
        return { storeSlug, items: [...prev.items, item] };
      });
      notify('Produit ajouté au panier', 'success');
    },
    [notify],
  );

  const updateQuantity = useCallback((productId, variantKey, qty) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items
        .map((i) =>
          i.productId === productId && i.variantKey === variantKey
            ? { ...i, quantity: Math.max(1, qty) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    }));
  }, []);

  const removeItem = useCallback((productId, variantKey) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !(i.productId === productId && i.variantKey === variantKey)),
    }));
  }, []);

  const clearCart = useCallback(() => setCart({ storeSlug: null, items: [] }), []);

  const cartTotals = useMemo(() => {
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    return { subtotal, itemCount };
  }, [cart]);

  const value = {
    activeMerchantStoreId,
    setActiveMerchantStoreId,
    cart,
    cartTotals,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    notify,
    toast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
