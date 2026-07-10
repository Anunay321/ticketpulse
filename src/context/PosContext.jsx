import { createContext, useContext, useMemo, useState } from "react";
import { computeCartTotals } from "../data/posEngine";

const PosContext = createContext(null);

export function PosProvider({ children }) {
  const [cart, setCart] = useState([]); // [{ item, qty }]
  const [manualDiscount, setManualDiscount] = useState(null); // { type: 'percent'|'flat', value, reason }
  const [sales, setSales] = useState([]);

  function addItem(item) {
    setCart((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  }

  function updateQty(itemId, qty) {
    if (qty <= 0) {
      setCart((prev) => prev.filter((l) => l.item.id !== itemId));
      return;
    }
    setCart((prev) => prev.map((l) => (l.item.id === itemId ? { ...l, qty } : l)));
  }

  function removeItem(itemId) {
    setCart((prev) => prev.filter((l) => l.item.id !== itemId));
  }

  function clearCart() {
    setCart([]);
    setManualDiscount(null);
  }

  function completeSale({ locationId, paymentMethod, tendered }) {
    const totals = computeCartTotals(cart, manualDiscount);
    const id = `S${Date.now()}`;
    const sale = {
      id,
      date: new Date().toISOString(),
      locationId,
      paymentMethod,
      tendered: tendered ?? totals.total,
      change: paymentMethod === "Cash" ? Math.max(0, (tendered ?? 0) - totals.total) : 0,
      lines: cart.map((l) => ({
        name: l.item.name,
        code: l.item.code,
        price: l.item.price,
        qty: l.qty,
        taxRate: l.item.taxRate,
      })),
      manualDiscount,
      ...totals,
    };
    setSales((prev) => [sale, ...prev]);
    clearCart();
    return sale;
  }

  const value = useMemo(
    () => ({
      cart,
      manualDiscount,
      setManualDiscount,
      sales,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      completeSale,
    }),
    [cart, manualDiscount, sales]
  );

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos() {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos must be used within PosProvider");
  return ctx;
}
