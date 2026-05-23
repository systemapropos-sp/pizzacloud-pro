// ─── MOCK DATA FOR PIZZACLOUD PRO ──────────────────────────────────────────
// When no database is connected, these mock datasets power the entire app

export const TENANT = { id: 1, name: "Napoli Pizza", slug: "napoli-pizza" };

export const CATEGORIES = [
  { id: 1, tenantId: 1, name: "Signature Pizzas", description: "Our famous wood-fired pizzas", image: "/pizza/margherita.jpg", sortOrder: 1, isActive: true, createdAt: new Date() },
  { id: 2, tenantId: 1, name: "Specialty Pizzas", description: "Unique flavor combinations", image: "/pizza/bbq-chicken.jpg", sortOrder: 2, isActive: true, createdAt: new Date() },
  { id: 3, tenantId: 1, name: "Sides", description: "Wings, breadsticks & more", image: "/pizza/wings.jpg", sortOrder: 3, isActive: true, createdAt: new Date() },
  { id: 4, tenantId: 1, name: "Salads", description: "Fresh and healthy options", image: "/pizza/caesar-salad.jpg", sortOrder: 4, isActive: true, createdAt: new Date() },
  { id: 5, tenantId: 1, name: "Desserts", description: "Sweet finish to your meal", image: "/pizza/tiramisu.jpg", sortOrder: 5, isActive: true, createdAt: new Date() },
];

const commonSizes = [
  { label: "Small (10\")", priceModifier: -3, inches: 10 },
  { label: "Medium (12\")", priceModifier: 0, inches: 12 },
  { label: "Large (14\")", priceModifier: 3, inches: 14 },
  { label: "XL (16\")", priceModifier: 5, inches: 16 },
];

const commonCrusts = [
  { label: "Hand Tossed", priceModifier: 0 },
  { label: "Thin Crust", priceModifier: 0 },
  { label: "Stuffed Crust", priceModifier: 2.50 },
  { label: "Gluten Free", priceModifier: 2 },
];

const commonToppings = [
  { label: "Extra Cheese", priceModifier: 1.50, category: "cheese" as const },
  { label: "Pepperoni", priceModifier: 1.50, category: "meat" as const },
  { label: "Sausage", priceModifier: 1.50, category: "meat" as const },
  { label: "Bacon", priceModifier: 1.50, category: "meat" as const },
  { label: "Mushrooms", priceModifier: 1.00, category: "veggie" as const },
  { label: "Olives", priceModifier: 1.00, category: "veggie" as const },
  { label: "Peppers", priceModifier: 1.00, category: "veggie" as const },
  { label: "Onions", priceModifier: 0.75, category: "veggie" as const },
];

export const MENU_ITEMS = [
  { id: 1, tenantId: 1, categoryId: 1, name: "Margherita", description: "San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil on our signature crust.", image: "/pizza/margherita.jpg", price: "14.99", costPrice: "4.50", calories: 720, prepTimeMinutes: 12, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["classic", "vegetarian"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, tenantId: 1, categoryId: 1, name: "Pepperoni", description: "Double pepperoni, mozzarella, and our secret tomato sauce. The classic American favorite.", image: "/pizza/pepperoni.jpg", price: "16.99", costPrice: "5.20", calories: 950, prepTimeMinutes: 12, isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["bestseller", "classic"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, tenantId: 1, categoryId: 1, name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, parmesan, and fontina cheeses with a white garlic olive oil base.", image: "/pizza/quattro-formaggi.jpg", price: "17.99", costPrice: "5.80", calories: 880, prepTimeMinutes: 12, isAvailable: true, isPopular: false, isVegetarian: true, isVegan: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["cheese-lover", "vegetarian"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, tenantId: 1, categoryId: 2, name: "BBQ Chicken", description: "Grilled chicken, red onion, cilantro, mozzarella, and tangy BBQ sauce on our hand-tossed crust.", image: "/pizza/bbq-chicken.jpg", price: "18.99", costPrice: "6.00", calories: 920, prepTimeMinutes: 15, isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["bestseller", "signature"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, tenantId: 1, categoryId: 2, name: "Hawaiian", description: "Ham, pineapple, mozzarella, and tomato sauce. A tropical twist on a classic.", image: "/pizza/hawaiian.jpg", price: "16.99", costPrice: "5.50", calories: 850, prepTimeMinutes: 12, isAvailable: true, isPopular: false, isVegetarian: false, isVegan: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["classic", "sweet"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, tenantId: 1, categoryId: 2, name: "Meat Lovers", description: "Pepperoni, Italian sausage, bacon, ham, and mozzarella. A carnivore's dream.", image: "/pizza/meat-lovers.jpg", price: "19.99", costPrice: "6.50", calories: 1150, prepTimeMinutes: 15, isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isSpicy: true, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["hearty", "bestseller"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, tenantId: 1, categoryId: 3, name: "Buffalo Wings", description: "10 crispy buffalo wings tossed in your choice of sauce: Hot, BBQ, or Garlic Parmesan.", image: "/pizza/wings.jpg", price: "12.99", costPrice: "4.00", calories: 650, prepTimeMinutes: 15, isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isSpicy: true, sizes: [{ label: "10 pcs", priceModifier: 0, inches: 0 }, { label: "20 pcs", priceModifier: 9, inches: 0 }], crusts: [], toppings: [], tags: ["spicy", "shareable"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, tenantId: 1, categoryId: 3, name: "Garlic Breadsticks", description: "Fresh-baked breadsticks with garlic butter, mozzarella, and marinara dipping sauce.", image: "/pizza/garlic-bread.jpg", price: "7.99", costPrice: "2.00", calories: 480, prepTimeMinutes: 8, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isSpicy: false, sizes: [{ label: "6 pcs", priceModifier: 0, inches: 0 }, { label: "12 pcs", priceModifier: 5, inches: 0 }], crusts: [], toppings: [], tags: ["classic", "shareable"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, tenantId: 1, categoryId: 3, name: "Calzone", description: "Folded pizza with mozzarella, ricotta, and your choice of toppings. Baked to golden perfection.", image: "/pizza/calzone.jpg", price: "14.99", costPrice: "4.50", calories: 780, prepTimeMinutes: 15, isAvailable: true, isPopular: false, isVegetarian: false, isVegan: false, isSpicy: false, sizes: [{ label: "Regular", priceModifier: 0, inches: 0 }, { label: "Large", priceModifier: 3, inches: 0 }], crusts: [], toppings: commonToppings, tags: ["classic"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, tenantId: 1, categoryId: 4, name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons, and Caesar dressing.", image: "/pizza/caesar-salad.jpg", price: "10.99", costPrice: "3.50", calories: 320, prepTimeMinutes: 5, isAvailable: true, isPopular: false, isVegetarian: true, isVegan: false, isSpicy: false, sizes: [{ label: "Side", priceModifier: -3, inches: 0 }, { label: "Entree", priceModifier: 0, inches: 0 }], crusts: [], toppings: [], tags: ["healthy", "fresh"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 11, tenantId: 1, categoryId: 5, name: "Dessert Pizza", description: "Nutella base with fresh strawberries, bananas, and powdered sugar.", image: "/pizza/dessert-pizza.jpg", price: "11.99", costPrice: "3.50", calories: 580, prepTimeMinutes: 10, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isSpicy: false, sizes: [{ label: "Regular", priceModifier: 0, inches: 0 }], crusts: [], toppings: [], tags: ["sweet", "shareable"], extras: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 12, tenantId: 1, categoryId: 5, name: "Tiramisu", description: "Classic Italian dessert with mascarpone cream, coffee-soaked ladyfingers, and cocoa.", image: "/pizza/tiramisu.jpg", price: "8.99", costPrice: "2.50", calories: 420, prepTimeMinutes: 0, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isSpicy: false, sizes: [{ label: "Single", priceModifier: 0, inches: 0 }], crusts: [], toppings: [], tags: ["classic", "italian"], extras: null, createdAt: new Date(), updatedAt: new Date() },
];

// Use a mutable array with explicit string types to avoid const narrowing
export type OrderStatus = "pending" | "confirmed" | "preparing" | "baking" | "ready" | "delivered" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type PaymentMethod = "cash" | "card" | "mobile" | "online" | null;
export type OrderType = "dineIn" | "takeout" | "delivery" | "driveThru";
export type OrderSource = "web" | "kiosk" | "pos" | "mobile" | "phone";
export type ItemStatus = "pending" | "preparing" | "baking" | "ready" | "served";
export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

export const ORDERS: Array<{
  id: number;
  tenantId: number;
  orderNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  orderType: OrderType;
  tableNumber: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: string;
  tax: string;
  tip: string;
  discount: string;
  total: string;
  source: OrderSource;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}> = [
  { id: 1, tenantId: 1, orderNumber: "PZ-2026-1001", customerName: "Anthony Russo", customerPhone: "(212) 555-0201", orderType: "dineIn", tableNumber: "7", status: "completed", paymentStatus: "paid", paymentMethod: "card", subtotal: "35.98", tax: "3.15", tip: "6.00", discount: "0.00", total: "45.13", source: "web", notes: null, createdAt: new Date("2026-05-23T10:00:00Z"), updatedAt: new Date(), completedAt: new Date() },
  { id: 2, tenantId: 1, orderNumber: "PZ-2026-1002", customerName: "Lisa Chen", customerPhone: "(212) 555-0202", orderType: "takeout", tableNumber: null, status: "completed", paymentStatus: "paid", paymentMethod: "cash", subtotal: "16.99", tax: "1.49", tip: "2.00", discount: "0.00", total: "20.48", source: "pos", notes: null, createdAt: new Date("2026-05-23T11:00:00Z"), updatedAt: new Date(), completedAt: new Date() },
  { id: 3, tenantId: 1, orderNumber: "PZ-2026-1003", customerName: "Mike Johnson", customerPhone: "(212) 555-0203", orderType: "delivery", tableNumber: null, status: "preparing", paymentStatus: "paid", paymentMethod: "card", subtotal: "42.97", tax: "3.76", tip: "5.00", discount: "0.00", total: "51.73", source: "web", notes: null, createdAt: new Date("2026-05-23T12:00:00Z"), updatedAt: new Date(), completedAt: null },
  { id: 4, tenantId: 1, orderNumber: "PZ-2026-1004", customerName: "Sarah Kim", customerPhone: "(212) 555-0204", orderType: "dineIn", tableNumber: "3", status: "baking", paymentStatus: "pending", paymentMethod: null, subtotal: "28.98", tax: "2.54", tip: "0.00", discount: "0.00", total: "31.52", source: "kiosk", notes: null, createdAt: new Date("2026-05-23T13:00:00Z"), updatedAt: new Date(), completedAt: null },
  { id: 5, tenantId: 1, orderNumber: "PZ-2026-1005", customerName: "David Torres", customerPhone: "(212) 555-0205", orderType: "takeout", tableNumber: null, status: "ready", paymentStatus: "paid", paymentMethod: "mobile", subtotal: "19.98", tax: "1.75", tip: "3.00", discount: "0.00", total: "24.73", source: "pos", notes: null, createdAt: new Date("2026-05-23T14:00:00Z"), updatedAt: new Date(), completedAt: null },
];

export const ORDER_ITEMS: Array<{
  id: number;
  orderId: number;
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  selectedSize: any;
  selectedCrust: any;
  selectedToppings: any[];
  selectedExtras: any[];
  specialInstructions: string | null;
  status: ItemStatus;
  createdAt: Date;
}> = [
  { id: 1, orderId: 1, menuItemId: 1, name: "Margherita", quantity: 2, unitPrice: "14.99", totalPrice: "29.98", selectedSize: { label: "Medium (12\")", priceModifier: 0 }, selectedCrust: { label: "Hand Tossed", priceModifier: 0 }, selectedToppings: [{ label: "Extra Cheese", priceModifier: 1.50 }], selectedExtras: [], specialInstructions: null, status: "served", createdAt: new Date() },
  { id: 2, orderId: 1, menuItemId: 7, name: "Buffalo Wings", quantity: 1, unitPrice: "12.99", totalPrice: "5.99", selectedSize: { label: "10 pcs", priceModifier: 0 }, selectedCrust: null, selectedToppings: [], selectedExtras: [], specialInstructions: null, status: "served", createdAt: new Date() },
  { id: 3, orderId: 2, menuItemId: 2, name: "Pepperoni", quantity: 1, unitPrice: "16.99", totalPrice: "16.99", selectedSize: { label: "Large (14\")", priceModifier: 3 }, selectedCrust: { label: "Thin Crust", priceModifier: 0 }, selectedToppings: [], selectedExtras: [], specialInstructions: null, status: "served", createdAt: new Date() },
  { id: 4, orderId: 3, menuItemId: 4, name: "BBQ Chicken", quantity: 1, unitPrice: "18.99", totalPrice: "18.99", selectedSize: { label: "Medium (12\")", priceModifier: 0 }, selectedCrust: { label: "Hand Tossed", priceModifier: 0 }, selectedToppings: [{ label: "Bacon", priceModifier: 1.50 }], selectedExtras: [], specialInstructions: null, status: "preparing", createdAt: new Date() },
  { id: 5, orderId: 3, menuItemId: 6, name: "Meat Lovers", quantity: 1, unitPrice: "19.99", totalPrice: "19.99", selectedSize: { label: "Large (14\")", priceModifier: 3 }, selectedCrust: { label: "Stuffed Crust", priceModifier: 2.50 }, selectedToppings: [{ label: "Extra Cheese", priceModifier: 1.50 }], selectedExtras: [], specialInstructions: null, status: "preparing", createdAt: new Date() },
  { id: 6, orderId: 4, menuItemId: 1, name: "Margherita", quantity: 1, unitPrice: "14.99", totalPrice: "11.99", selectedSize: { label: "Small (10\")", priceModifier: -3 }, selectedCrust: { label: "Gluten Free", priceModifier: 2 }, selectedToppings: [{ label: "Mushrooms", priceModifier: 1.00 }], selectedExtras: [], specialInstructions: null, status: "baking", createdAt: new Date() },
  { id: 7, orderId: 4, menuItemId: 8, name: "Garlic Breadsticks", quantity: 1, unitPrice: "7.99", totalPrice: "7.99", selectedSize: { label: "6 pcs", priceModifier: 0 }, selectedCrust: null, selectedToppings: [], selectedExtras: [], specialInstructions: null, status: "ready", createdAt: new Date() },
  { id: 8, orderId: 5, menuItemId: 3, name: "Quattro Formaggi", quantity: 1, unitPrice: "17.99", totalPrice: "17.99", selectedSize: { label: "Medium (12\")", priceModifier: 0 }, selectedCrust: { label: "Hand Tossed", priceModifier: 0 }, selectedToppings: [], selectedExtras: [], specialInstructions: null, status: "ready", createdAt: new Date() },
  { id: 9, orderId: 5, menuItemId: 12, name: "Tiramisu", quantity: 1, unitPrice: "8.99", totalPrice: "6.99", selectedSize: { label: "Single", priceModifier: 0 }, selectedCrust: null, selectedToppings: [], selectedExtras: [], specialInstructions: null, status: "ready", createdAt: new Date() },
];

export const STAFF = [
  { id: 1, tenantId: 1, name: "Giovanni Rossi", email: "g.rossi@napolipizza.com", phone: "(212) 555-0101", role: "manager", pin: "1234", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, tenantId: 1, name: "Maria Bianchi", email: "m.bianchi@napolipizza.com", phone: "(212) 555-0102", role: "cashier", pin: "2345", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, tenantId: 1, name: "Marco Ferretti", email: "m.ferretti@napolipizza.com", phone: "(212) 555-0103", role: "chef", pin: "3456", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, tenantId: 1, name: "Sofia Romano", email: "s.romano@napolipizza.com", phone: "(212) 555-0104", role: "server", pin: "4567", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, tenantId: 1, name: "Luca Conti", email: "l.conti@napolipizza.com", phone: "(212) 555-0105", role: "host", pin: "5678", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, tenantId: 1, name: "Elena Marino", email: "e.marino@napolipizza.com", phone: "(212) 555-0106", role: "chef", pin: "6789", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export const TABLES: Array<{
  id: number;
  tenantId: number;
  number: string;
  capacity: number;
  section: string;
  status: TableStatus;
  createdAt: Date;
}> = [
  { id: 1, tenantId: 1, number: "1", capacity: 2, section: "Patio", status: "available", createdAt: new Date() },
  { id: 2, tenantId: 1, number: "2", capacity: 2, section: "Patio", status: "available", createdAt: new Date() },
  { id: 3, tenantId: 1, number: "3", capacity: 4, section: "Patio", status: "occupied", createdAt: new Date() },
  { id: 4, tenantId: 1, number: "4", capacity: 4, section: "Patio", status: "available", createdAt: new Date() },
  { id: 5, tenantId: 1, number: "5", capacity: 6, section: "Patio", status: "reserved", createdAt: new Date() },
  { id: 6, tenantId: 1, number: "6", capacity: 2, section: "Main Dining", status: "available", createdAt: new Date() },
  { id: 7, tenantId: 1, number: "7", capacity: 4, section: "Main Dining", status: "occupied", createdAt: new Date() },
  { id: 8, tenantId: 1, number: "8", capacity: 4, section: "Main Dining", status: "available", createdAt: new Date() },
  { id: 9, tenantId: 1, number: "9", capacity: 4, section: "Main Dining", status: "reserved", createdAt: new Date() },
  { id: 10, tenantId: 1, number: "10", capacity: 6, section: "Main Dining", status: "available", createdAt: new Date() },
  { id: 11, tenantId: 1, number: "11", capacity: 8, section: "Main Dining", status: "available", createdAt: new Date() },
  { id: 12, tenantId: 1, number: "12", capacity: 2, section: "Bar Area", status: "occupied", createdAt: new Date() },
  { id: 13, tenantId: 1, number: "13", capacity: 2, section: "Bar Area", status: "available", createdAt: new Date() },
  { id: 14, tenantId: 1, number: "14", capacity: 4, section: "Bar Area", status: "available", createdAt: new Date() },
  { id: 15, tenantId: 1, number: "15", capacity: 4, section: "Private Room", status: "available", createdAt: new Date() },
  { id: 16, tenantId: 1, number: "16", capacity: 8, section: "Private Room", status: "reserved", createdAt: new Date() },
  { id: 17, tenantId: 1, number: "17", capacity: 12, section: "Private Room", status: "available", createdAt: new Date() },
  { id: 18, tenantId: 1, number: "18", capacity: 2, section: "Counter", status: "available", createdAt: new Date() },
];

export const INVENTORY = [
  { id: 1, tenantId: 1, name: "Pizza Dough", sku: "DOU-001", category: "Bakery", unit: "balls", quantity: "120", minLevel: "30", reorderPoint: "50", unitCost: "0.80", supplier: "Artisan Dough Co.", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, tenantId: 1, name: "Mozzarella Cheese", sku: "CHS-001", category: "Dairy", unit: "lbs", quantity: "45", minLevel: "15", reorderPoint: "25", unitCost: "4.50", supplier: "Wisconsin Dairy", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, tenantId: 1, name: "San Marzano Tomatoes", sku: "SAU-001", category: "Sauces", unit: "cans", quantity: "80", minLevel: "20", reorderPoint: "30", unitCost: "2.50", supplier: "Italian Imports", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, tenantId: 1, name: "Pepperoni", sku: "MT-001", category: "Meats", unit: "lbs", quantity: "35", minLevel: "10", reorderPoint: "15", unitCost: "5.20", supplier: "Heritage Meats", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, tenantId: 1, name: "Chicken Breast", sku: "MT-002", category: "Meats", unit: "lbs", quantity: "25", minLevel: "10", reorderPoint: "15", unitCost: "4.80", supplier: "Free Range Farms", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, tenantId: 1, name: "Fresh Basil", sku: "HRB-001", category: "Produce", unit: "oz", quantity: "12", minLevel: "5", reorderPoint: "8", unitCost: "1.20", supplier: "Local Farms", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, tenantId: 1, name: "Olive Oil", sku: "OIL-001", category: "Oils", unit: "liters", quantity: "18", minLevel: "5", reorderPoint: "8", unitCost: "8.50", supplier: "Mediterranean Imports", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, tenantId: 1, name: "Flour (00)", sku: "FLR-001", category: "Dry Goods", unit: "lbs", quantity: "200", minLevel: "50", reorderPoint: "80", unitCost: "0.55", supplier: "Caputo Flour", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, tenantId: 1, name: "Parmesan Cheese", sku: "CHS-002", category: "Dairy", unit: "lbs", quantity: "20", minLevel: "8", reorderPoint: "12", unitCost: "6.00", supplier: "Italian Imports", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, tenantId: 1, name: "Pineapple", sku: "PRD-001", category: "Produce", unit: "cans", quantity: "30", minLevel: "10", reorderPoint: "15", unitCost: "1.80", supplier: "Tropical Farms", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export const PERMISSIONS_MOCK = [
  { id: 1, key: "pos:sell", label: "POS Sell", module: "pos", description: "Process sales at POS", createdAt: new Date() },
  { id: 2, key: "pos:refund", label: "POS Refund", module: "pos", description: "Process refunds", createdAt: new Date() },
  { id: 3, key: "pos:discount", label: "POS Discount", module: "pos", description: "Apply discounts", createdAt: new Date() },
  { id: 4, key: "pos:reports", label: "POS Reports", module: "pos", description: "View POS reports", createdAt: new Date() },
  { id: 5, key: "kitchen:view", label: "Kitchen View", module: "kitchen", description: "View kitchen display", createdAt: new Date() },
  { id: 6, key: "kitchen:update", label: "Kitchen Update", module: "kitchen", description: "Update kitchen orders", createdAt: new Date() },
  { id: 7, key: "kitchen:manage", label: "Kitchen Manage", module: "kitchen", description: "Manage kitchen", createdAt: new Date() },
  { id: 8, key: "menu:view", label: "Menu View", module: "menu", description: "View menu items", createdAt: new Date() },
  { id: 9, key: "menu:create", label: "Menu Create", module: "menu", description: "Create menu items", createdAt: new Date() },
  { id: 10, key: "menu:update", label: "Menu Update", module: "menu", description: "Update menu items", createdAt: new Date() },
  { id: 11, key: "orders:view", label: "Orders View", module: "orders", description: "View orders", createdAt: new Date() },
  { id: 12, key: "orders:cancel", label: "Orders Cancel", module: "orders", description: "Cancel orders", createdAt: new Date() },
  { id: 13, key: "inventory:view", label: "Inventory View", module: "inventory", description: "View inventory", createdAt: new Date() },
  { id: 14, key: "staff:view", label: "Staff View", module: "staff", description: "View staff", createdAt: new Date() },
  { id: 15, key: "admin:dashboard", label: "Admin Dashboard", module: "admin", description: "View admin dashboard", createdAt: new Date() },
  { id: 16, key: "admin:analytics", label: "Admin Analytics", module: "admin", description: "View analytics", createdAt: new Date() },
  { id: 17, key: "tenant:manage", label: "Tenant Manage", module: "tenant", description: "Manage tenants", createdAt: new Date() },
  { id: 18, key: "system:settings", label: "System Settings", module: "system", description: "Manage system settings", createdAt: new Date() },
];

export function getDashboardStats() {
  const todayOrders = ORDERS.filter(o => o.status !== "cancelled");
  const weekOrders = ORDERS;
  return {
    todayRevenue: todayOrders.reduce((s, o) => s + parseFloat(o.total), 0),
    todayOrders: todayOrders.length,
    weekRevenue: weekOrders.reduce((s, o) => s + parseFloat(o.total), 0),
    weekOrders: weekOrders.length,
    activeOrders: ORDERS.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
    lowStock: INVENTORY.filter(i => parseFloat(i.quantity) <= parseFloat(i.reorderPoint)).length,
    totalStaff: STAFF.length,
  };
}

export function getSalesByDay(days: number) {
  const dayMap: Record<string, { date: string; orders: number; revenue: number }> = {};
  for (const order of ORDERS) {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    if (!dayMap[date]) dayMap[date] = { date, orders: 0, revenue: 0 };
    dayMap[date].orders++; dayMap[date].revenue += parseFloat(order.total);
  }
  return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
}

export function getPopularItems(limit: number) {
  const counts: Record<number, { name: string; count: number; revenue: number }> = {};
  for (const item of ORDER_ITEMS) {
    if (!counts[item.menuItemId]) { const m = MENU_ITEMS.find(x => x.id === item.menuItemId); counts[item.menuItemId] = { name: m?.name ?? "Unknown", count: 0, revenue: 0 }; }
    counts[item.menuItemId].count += item.quantity;
    counts[item.menuItemId].revenue += parseFloat(item.totalPrice);
  }
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, limit);
}

export function getKitchenTickets() {
  const activeStatuses = ["pending", "confirmed", "preparing", "baking", "ready"];
  return ORDERS.filter(o => activeStatuses.includes(o.status)).map(o => ({
    ...o,
    items: ORDER_ITEMS.filter(i => i.orderId === o.id),
  }));
}

export function getKitchenStats() {
  return {
    totalOrders: ORDERS.length,
    activeOrders: ORDERS.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
    pendingItems: ORDER_ITEMS.filter(i => i.status === "pending").length,
    preparingItems: ORDER_ITEMS.filter(i => i.status === "preparing").length,
    readyItems: ORDER_ITEMS.filter(i => i.status === "ready").length,
  };
}
