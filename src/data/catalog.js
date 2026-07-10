export const POS_CATEGORIES = [
  "Starters",
  "Wood-Fired Flatbreads",
  "Mains",
  "Salads",
  "Beverages",
  "Desserts",
];

// GST for restaurant food service is simplified here to a flat 5% (the common
// slab for standard restaurants under current rules). A full HSN/SAC multi-slab
// mapping table is planned for the tax-compliance phase.
const TAX_RATE = 5;

export const MENU_ITEMS = [
  { id: "p1", code: "STR-01", name: "Charred Corn & Feta", category: "Starters", price: 320, taxRate: TAX_RATE },
  { id: "p2", code: "STR-02", name: "Crispy Cauliflower Bites", category: "Starters", price: 280, taxRate: TAX_RATE },
  { id: "p3", code: "STR-03", name: "Burrata & Heirloom Tomato", category: "Starters", price: 450, taxRate: TAX_RATE },
  { id: "p4", code: "STR-04", name: "Soup of the Day", category: "Starters", price: 220, taxRate: TAX_RATE },

  { id: "p5", code: "FLB-01", name: "Basil & Burrata Flatbread", category: "Wood-Fired Flatbreads", price: 480, taxRate: TAX_RATE },
  { id: "p6", code: "FLB-02", name: "Wild Mushroom & Truffle Oil", category: "Wood-Fired Flatbreads", price: 520, taxRate: TAX_RATE },
  { id: "p7", code: "FLB-03", name: "Spicy Ember Chicken", category: "Wood-Fired Flatbreads", price: 540, taxRate: TAX_RATE },
  { id: "p8", code: "FLB-04", name: "Classic Margherita", category: "Wood-Fired Flatbreads", price: 420, taxRate: TAX_RATE },

  { id: "p9", code: "MN-01", name: "Wood-Fired Salmon", category: "Mains", price: 780, taxRate: TAX_RATE },
  { id: "p10", code: "MN-02", name: "Herb-Crusted Chicken", category: "Mains", price: 620, taxRate: TAX_RATE },
  { id: "p11", code: "MN-03", name: "Grilled Ribeye", category: "Mains", price: 1450, taxRate: TAX_RATE },
  { id: "p12", code: "MN-04", name: "Butternut Squash Risotto", category: "Mains", price: 560, taxRate: TAX_RATE },

  { id: "p13", code: "SAL-01", name: "Ember House Salad", category: "Salads", price: 340, taxRate: TAX_RATE },
  { id: "p14", code: "SAL-02", name: "Kale & Quinoa Salad", category: "Salads", price: 380, taxRate: TAX_RATE },
  { id: "p15", code: "SAL-03", name: "Caesar Salad", category: "Salads", price: 360, taxRate: TAX_RATE },

  { id: "p16", code: "BEV-01", name: "Sparkling Basil Lemonade", category: "Beverages", price: 180, taxRate: TAX_RATE },
  { id: "p17", code: "BEV-02", name: "Fresh Cold Brew", category: "Beverages", price: 160, taxRate: TAX_RATE },
  { id: "p18", code: "BEV-03", name: "Iced Herbal Tea", category: "Beverages", price: 150, taxRate: TAX_RATE },
  { id: "p19", code: "BEV-04", name: "House Wine, Glass", category: "Beverages", price: 450, taxRate: TAX_RATE },

  { id: "p20", code: "DES-01", name: "Flourless Chocolate Torte", category: "Desserts", price: 280, taxRate: TAX_RATE },
  { id: "p21", code: "DES-02", name: "Charred Peach Sundae", category: "Desserts", price: 260, taxRate: TAX_RATE },
];

export const PAYMENT_METHODS = ["Cash", "UPI", "Card"];

// Active promotional campaign: bulk-order threshold discount.
export const BULK_DISCOUNT = { threshold: 2000, percent: 10, label: "Bulk order (10% off ₹2,000+)" };

// Scheduled happy-hour matrix: discounts Beverages during a fixed local time window.
export const HAPPY_HOUR = { startHour: 15, endHour: 18, percent: 15, category: "Beverages", label: "Happy Hour (15% off beverages)" };
