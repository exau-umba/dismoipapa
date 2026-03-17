import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface CartItem {
  /** Identifiant de ligne panier (bookId + format) */
  lineId: string;
  bookId: string;
  title: string;
  coverImage: string;
  price: string;
  quantity: number;
  /** Format de fichier (recommandé: pdf). Null pour physique / non applicable. */
  fileFormat: 'pdf' | 'epub' | null;
  /** Type de produit choisi */
  productType: 'ebook' | 'physical';
}

const STORAGE_KEY = 'livre-online-cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'lineId'> & { quantity?: number }) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateFileFormat: (lineId: string, fileFormat: 'pdf' | 'epub' | null) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity' | 'lineId'> & { quantity?: number }) => {
    const isEbook = item.productType === 'ebook';
    const qty = isEbook ? 1 : Math.max(1, item.quantity ?? 1);
    const effectiveFileFormat = isEbook ? item.fileFormat : null;
    const lineId = `${item.bookId}:${item.productType}:${effectiveFileFormat ?? 'none'}`;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.lineId === lineId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: isEbook ? 1 : next[idx].quantity + qty,
        };
        return next;
      }
      return [...prev, { ...item, fileFormat: effectiveFileFormat, lineId, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    const qty = Math.max(0, quantity);
    setItems((prev) => {
      if (qty === 0) return prev.filter((i) => i.lineId !== lineId);
      const next = [...prev];
      const idx = next.findIndex((i) => i.lineId === lineId);
      if (idx >= 0) {
        const item = next[idx];
        next[idx] = { ...item, quantity: item.productType === 'ebook' ? 1 : qty };
      }
      return next;
    });
  }, []);

  const updateFileFormat = useCallback((lineId: string, fileFormat: 'pdf' | 'epub' | null) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.lineId === lineId);
      if (idx < 0) return prev;
      const item = prev[idx];
      if (item.productType !== 'ebook') return prev;
      const nextLineId = `${item.bookId}:${item.productType}:${fileFormat ?? 'none'}`;

      // Si une ligne existe déjà pour ce format, on fusionne les quantités
      const existingIdx = prev.findIndex((i) => i.lineId === nextLineId);
      if (existingIdx >= 0 && existingIdx !== idx) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + item.quantity };
        next.splice(idx, 1);
        return next;
      }

      const next = [...prev];
      next[idx] = { ...item, fileFormat, lineId: nextLineId };
      return next;
    });
  }, []);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + parseFloat(i.price || '0') * i.quantity, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateFileFormat,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
