import { BULK_DISCOUNT, HAPPY_HOUR } from "./catalog";

export function cartSubtotal(cart) {
  return cart.reduce((sum, line) => sum + line.item.price * line.qty, 0);
}

// Evaluates the "Active Campaign Promotional Match" step: picks the single
// best-matching automatic promo rather than stacking every eligible one.
export function evaluateAutoPromo(cart, subtotal, now = new Date()) {
  const candidates = [];

  if (subtotal >= BULK_DISCOUNT.threshold) {
    candidates.push({
      label: BULK_DISCOUNT.label,
      amount: Math.round(subtotal * (BULK_DISCOUNT.percent / 100)),
    });
  }

  const hour = now.getHours();
  const inHappyHour = hour >= HAPPY_HOUR.startHour && hour < HAPPY_HOUR.endHour;
  if (inHappyHour) {
    const beverageTotal = cart
      .filter((l) => l.item.category === HAPPY_HOUR.category)
      .reduce((sum, l) => sum + l.item.price * l.qty, 0);
    if (beverageTotal > 0) {
      candidates.push({
        label: HAPPY_HOUR.label,
        amount: Math.round(beverageTotal * (HAPPY_HOUR.percent / 100)),
      });
    }
  }

  if (!candidates.length) return { label: null, amount: 0 };
  return candidates.reduce((best, c) => (c.amount > best.amount ? c : best), candidates[0]);
}

export function computeCartTotals(cart, manualDiscount, now = new Date()) {
  const subtotal = cartSubtotal(cart);
  const autoPromo = evaluateAutoPromo(cart, subtotal, now);

  const manualAmount =
    manualDiscount?.type === "percent"
      ? Math.round(subtotal * ((manualDiscount.value || 0) / 100))
      : Math.min(manualDiscount?.value || 0, subtotal);

  const totalDiscount = Math.min(subtotal, autoPromo.amount + manualAmount);
  const taxableBase = subtotal - totalDiscount;

  // Blended tax rate across line items, applied to the discounted base,
  // then split evenly into CGST/SGST per standard intra-state GST rules.
  const weightedTax = cart.reduce(
    (sum, l) => sum + l.item.price * l.qty * (l.item.taxRate / 100),
    0
  );
  const effectiveRate = subtotal > 0 ? weightedTax / subtotal : 0;
  const totalTax = Math.round(taxableBase * effectiveRate);
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  const total = taxableBase + cgst + sgst;

  return {
    subtotal,
    autoPromo,
    manualAmount,
    totalDiscount,
    taxableBase,
    cgst,
    sgst,
    totalTax,
    total,
  };
}

export function formatINR(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
