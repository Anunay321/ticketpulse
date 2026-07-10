import { useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, Tag, Receipt } from "lucide-react";
import { usePos } from "../context/PosContext";
import { useFeedback } from "../context/FeedbackContext";
import { MENU_ITEMS, POS_CATEGORIES, PAYMENT_METHODS } from "../data/catalog";
import { computeCartTotals, formatINR } from "../data/posEngine";
import ReceiptTicket from "../components/ReceiptTicket";

export default function Checkout() {
  const { locations } = useFeedback();
  const { cart, addItem, updateQty, removeItem, manualDiscount, setManualDiscount, completeSale } =
    usePos();

  const [locationId, setLocationId] = useState(locations[0].id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [step, setStep] = useState("cart"); // cart | payment | receipt
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [tendered, setTendered] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [completedSale, setCompletedSale] = useState(null);

  const totals = computeCartTotals(cart, manualDiscount);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (query && !item.name.toLowerCase().includes(query.toLowerCase()) && !item.code.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [query, category]);

  function applyManualDiscount() {
    const value = Number(discountInput);
    if (!value) {
      setManualDiscount(null);
      return;
    }
    setManualDiscount({ type: "percent", value, reason: discountReason || `Manual ${value}% off` });
  }

  function handleCharge() {
    setStep("payment");
    setTendered(String(totals.total));
  }

  function handleCompleteSale() {
    const sale = completeSale({
      locationId,
      paymentMethod,
      tendered: paymentMethod === "Cash" ? Number(tendered) : totals.total,
    });
    setCompletedSale(sale);
    setStep("receipt");
    setDiscountInput("");
    setDiscountReason("");
  }

  function startNewSale() {
    setStep("cart");
    setCompletedSale(null);
    setPaymentMethod("Cash");
    setTendered("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product catalog */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-sage">Point of sale</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">Checkout</h1>
        </div>

        <div className="flex items-center gap-2 bg-white border border-line rounded-lg px-3 py-2">
          <Search size={16} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or item code..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory("all")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              category === "all" ? "bg-ink text-paper border-ink" : "border-line text-ink/60 hover:border-ink/40"
            }`}
          >
            All
          </button>
          {POS_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                category === c ? "bg-ink text-paper border-ink" : "border-line text-ink/60 hover:border-ink/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className="text-left bg-white border border-line rounded-lg p-3.5 hover:border-sage hover:shadow-sm transition-all"
            >
              <p className="text-[10px] font-mono text-ink/40">{item.code}</p>
              <p className="text-sm font-medium text-ink mt-1 leading-snug">{item.name}</p>
              <p className="font-mono text-sm text-sage mt-2">{formatINR(item.price)}</p>
            </button>
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full text-sm text-ink/45 text-center py-10">
              No menu items match that search.
            </p>
          )}
        </div>
      </div>

      {/* Cart / checkout panel */}
      <div className="bg-white border border-line rounded-lg p-5 h-fit lg:sticky lg:top-6">
        {step === "cart" && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold">Current order</h2>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="text-xs font-mono bg-paper-dim border border-line rounded-md px-2 py-1 outline-none"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name.replace("Basil & Ember – ", "")}
                  </option>
                ))}
              </select>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-ink/45 text-center py-10">
                Tap a menu item to add it to the order.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {cart.map((l) => (
                  <div key={l.item.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-ink truncate">{l.item.name}</p>
                      <p className="text-xs font-mono text-ink/40">{formatINR(l.item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQty(l.item.id, l.qty - 1)}
                        className="w-6 h-6 rounded border border-line flex items-center justify-center text-ink/60 hover:border-ink/40"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono w-4 text-center">{l.qty}</span>
                      <button
                        onClick={() => updateQty(l.item.id, l.qty + 1)}
                        className="w-6 h-6 rounded border border-line flex items-center justify-center text-ink/60 hover:border-ink/40"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(l.item.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-ember/70 hover:text-ember"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <div className="border-t border-line mt-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-ink/40" />
                    <input
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      placeholder="Discount reason (optional)"
                      className="flex-1 text-xs bg-paper-dim border border-line rounded px-2 py-1.5 outline-none"
                    />
                    <input
                      type="number"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      onBlur={applyManualDiscount}
                      placeholder="%"
                      className="w-14 text-xs bg-paper-dim border border-line rounded px-2 py-1.5 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-line mt-4 pt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink/60">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatINR(totals.subtotal)}</span>
                  </div>
                  {totals.autoPromo.label && (
                    <div className="flex justify-between text-sage">
                      <span>{totals.autoPromo.label}</span>
                      <span className="font-mono">-{formatINR(totals.autoPromo.amount)}</span>
                    </div>
                  )}
                  {manualDiscount && totals.manualAmount > 0 && (
                    <div className="flex justify-between text-sage">
                      <span>{manualDiscount.reason}</span>
                      <span className="font-mono">-{formatINR(totals.manualAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink/60">
                    <span>CGST + SGST</span>
                    <span className="font-mono">{formatINR(totals.totalTax)}</span>
                  </div>
                  <div className="flex justify-between font-display font-semibold text-base pt-1.5 border-t border-line mt-1.5">
                    <span>Total</span>
                    <span className="font-mono">{formatINR(totals.total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCharge}
                  className="w-full mt-4 bg-sage text-paper text-sm font-semibold rounded-md py-2.5 hover:bg-sage/90 transition-colors"
                >
                  Charge {formatINR(totals.total)}
                </button>
              </>
            )}
          </>
        )}

        {step === "payment" && (
          <>
            <h2 className="font-display font-semibold mb-1">Take payment</h2>
            <p className="text-sm text-ink/50 mb-4">
              Total due: <span className="font-mono text-ink">{formatINR(totals.total)}</span>
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`text-sm py-2 rounded-md border transition-colors ${
                    paymentMethod === m
                      ? "bg-ink text-paper border-ink"
                      : "border-line text-ink/60 hover:border-ink/40"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {paymentMethod === "Cash" && (
              <div className="mb-4">
                <label className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                  Amount tendered
                </label>
                <input
                  type="number"
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                  className="w-full mt-1.5 text-sm font-mono bg-paper-dim border border-line rounded-md px-3 py-2 outline-none"
                />
                {Number(tendered) >= totals.total && (
                  <p className="text-xs text-sage mt-1.5">
                    Change due: {formatINR(Number(tendered) - totals.total)}
                  </p>
                )}
              </div>
            )}
            {paymentMethod !== "Cash" && (
              <p className="text-xs text-ink/45 mb-4">
                Simulated {paymentMethod} authorization — no real payment gateway is connected in
                this demo.
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep("cart")}
                className="flex-1 text-sm font-medium py-2.5 rounded-md border border-line text-ink/60 hover:border-ink/40"
              >
                Back
              </button>
              <button
                onClick={handleCompleteSale}
                disabled={paymentMethod === "Cash" && Number(tendered) < totals.total}
                className="flex-[2] bg-ink text-paper text-sm font-semibold rounded-md py-2.5 hover:bg-ink/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Complete sale
              </button>
            </div>
          </>
        )}

        {step === "receipt" && completedSale && (
          <>
            <div className="flex items-center gap-2 mb-3 text-sage">
              <Receipt size={16} />
              <p className="text-xs font-mono uppercase tracking-widest">Sale complete</p>
            </div>
            <ReceiptTicket
              sale={completedSale}
              locationName={locations.find((l) => l.id === completedSale.locationId)?.name}
            />
            <button
              onClick={startNewSale}
              className="w-full mt-4 bg-sage text-paper text-sm font-semibold rounded-md py-2.5 hover:bg-sage/90 transition-colors"
            >
              Start new sale
            </button>
          </>
        )}
      </div>
    </div>
  );
}
