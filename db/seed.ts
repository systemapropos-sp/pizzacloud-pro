import { getDb } from "../api/queries/connection";
import { tenants, categories, menuItems, staff, tables, inventory, permissions, orders, orderItems } from "./schema";
import { eq } from "drizzle-orm";
import { PERMISSIONS } from "../contracts/constants";

async function seed() {
  const db = getDb();
  console.log("Seeding PizzaCloud Pro...");

  // ─── TENANT ──────────────────────────────────────────────────────────────
  const existingTenants = await db.select().from(tenants).where(eq(tenants.slug, "napoli-pizza"));
  let tenantId: number;
  if (existingTenants.length > 0) {
    tenantId = existingTenants[0].id;
    console.log("Using existing tenant:", tenantId);
  } else {
    const [t] = await db.insert(tenants).values({
      name: "Napoli Pizza", slug: "napoli-pizza",
      address: "789 Little Italy, New York, NY 10013",
      phone: "(212) 555-0199", email: "hello@napolipizza.com",
      timezone: "America/New_York", currency: "USD", taxRate: "8.875",
      status: "active", plan: "professional",
      settings: { allowOnlineOrders: true, allowReservations: true, defaultOrderType: "dineIn", prepTimeMinutes: 15, autoAcceptOrders: false },
    });
    tenantId = Number(t.insertId);
    console.log("Created tenant:", tenantId);
  }

  // ─── PERMISSIONS ─────────────────────────────────────────────────────────
  const existingPerms = await db.select().from(permissions);
  if (existingPerms.length === 0) {
    const permValues = Object.entries(PERMISSIONS).map(([key, value]) => ({
      key: value,
      label: key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim(),
      module: value.split(":")[0],
      description: `${key} permission`,
    }));
    await db.insert(permissions).values(permValues);
    console.log("Created permissions:", permValues.length);
  }

  // ─── CATEGORIES ──────────────────────────────────────────────────────────
  let allCats = await db.select().from(categories).where(eq(categories.tenantId, tenantId));
  if (allCats.length === 0) {
    await db.insert(categories).values([
      { tenantId, name: "Signature Pizzas", description: "Our famous wood-fired pizzas", image: "/pizza/margherita.jpg", sortOrder: 1, isActive: true },
      { tenantId, name: "Specialty Pizzas", description: "Unique flavor combinations", image: "/pizza/bbq-chicken.jpg", sortOrder: 2, isActive: true },
      { tenantId, name: "Sides", description: "Wings, breadsticks & more", image: "/pizza/wings.jpg", sortOrder: 3, isActive: true },
      { tenantId, name: "Salads", description: "Fresh and healthy options", image: "/pizza/caesar-salad.jpg", sortOrder: 4, isActive: true },
      { tenantId, name: "Desserts", description: "Sweet finish to your meal", image: "/pizza/tiramisu.jpg", sortOrder: 5, isActive: true },
    ]);
    allCats = await db.select().from(categories).where(eq(categories.tenantId, tenantId));
    console.log("Created categories");
  }

  const catMap: Record<string, number> = {};
  for (const c of allCats) catMap[c.name] = c.id;

  // ─── MENU ITEMS ──────────────────────────────────────────────────────────
  const existingItems = await db.select().from(menuItems).where(eq(menuItems.tenantId, tenantId));
  if (existingItems.length === 0) {
    const sigId = catMap["Signature Pizzas"];
    const specId = catMap["Specialty Pizzas"];
    const sidesId = catMap["Sides"];
    const saladId = catMap["Salads"];
    const dessertId = catMap["Desserts"];

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

    await db.insert(menuItems).values([
      { tenantId, categoryId: sigId, name: "Margherita", description: "San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil on our signature crust.", image: "/pizza/margherita.jpg", price: "14.99", costPrice: "4.50", calories: 720, prepTimeMinutes: 12, isAvailable: true, isPopular: true, isVegetarian: true, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["classic", "vegetarian"] },
      { tenantId, categoryId: sigId, name: "Pepperoni", description: "Double pepperoni, mozzarella, and our secret tomato sauce. The classic American favorite.", image: "/pizza/pepperoni.jpg", price: "16.99", costPrice: "5.20", calories: 950, prepTimeMinutes: 12, isAvailable: true, isPopular: true, isVegetarian: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["bestseller", "classic"] },
      { tenantId, categoryId: sigId, name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, parmesan, and fontina cheeses with a white garlic olive oil base.", image: "/pizza/quattro-formaggi.jpg", price: "17.99", costPrice: "5.80", calories: 880, prepTimeMinutes: 12, isAvailable: true, isPopular: false, isVegetarian: true, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["cheese-lover", "vegetarian"] },
      { tenantId, categoryId: specId, name: "BBQ Chicken", description: "Grilled chicken, red onion, cilantro, mozzarella, and tangy BBQ sauce on our hand-tossed crust.", image: "/pizza/bbq-chicken.jpg", price: "18.99", costPrice: "6.00", calories: 920, prepTimeMinutes: 15, isAvailable: true, isPopular: true, isVegetarian: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["bestseller", "signature"] },
      { tenantId, categoryId: specId, name: "Hawaiian", description: "Ham, pineapple, mozzarella, and tomato sauce. A tropical twist on a classic.", image: "/pizza/hawaiian.jpg", price: "16.99", costPrice: "5.50", calories: 850, prepTimeMinutes: 12, isAvailable: true, isPopular: false, isVegetarian: false, isSpicy: false, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["classic", "sweet"] },
      { tenantId, categoryId: specId, name: "Meat Lovers", description: "Pepperoni, Italian sausage, bacon, ham, and mozzarella. A carnivore's dream.", image: "/pizza/meat-lovers.jpg", price: "19.99", costPrice: "6.50", calories: 1150, prepTimeMinutes: 15, isAvailable: true, isPopular: true, isVegetarian: false, isSpicy: true, sizes: commonSizes, crusts: commonCrusts, toppings: commonToppings, tags: ["hearty", "bestseller"] },
      { tenantId, categoryId: sidesId, name: "Buffalo Wings", description: "10 crispy buffalo wings tossed in your choice of sauce: Hot, BBQ, or Garlic Parmesan.", image: "/pizza/wings.jpg", price: "12.99", costPrice: "4.00", calories: 650, prepTimeMinutes: 15, isAvailable: true, isPopular: true, isVegetarian: false, sizes: [{ label: "10 pcs", priceModifier: 0, inches: 0 }, { label: "20 pcs", priceModifier: 9, inches: 0 }], crusts: [], toppings: [], tags: ["spicy", "shareable"] },
      { tenantId, categoryId: sidesId, name: "Garlic Breadsticks", description: "Fresh-baked breadsticks with garlic butter, mozzarella, and marinara dipping sauce.", image: "/pizza/garlic-bread.jpg", price: "7.99", costPrice: "2.00", calories: 480, prepTimeMinutes: 8, isAvailable: true, isPopular: true, isVegetarian: true, sizes: [{ label: "6 pcs", priceModifier: 0, inches: 0 }, { label: "12 pcs", priceModifier: 5, inches: 0 }], crusts: [], toppings: [], tags: ["classic", "shareable"] },
      { tenantId, categoryId: sidesId, name: "Calzone", description: "Folded pizza with mozzarella, ricotta, and your choice of toppings. Baked to golden perfection.", image: "/pizza/calzone.jpg", price: "14.99", costPrice: "4.50", calories: 780, prepTimeMinutes: 15, isAvailable: true, isPopular: false, sizes: [{ label: "Regular", priceModifier: 0, inches: 0 }, { label: "Large", priceModifier: 3, inches: 0 }], crusts: [], toppings: commonToppings, tags: ["classic"] },
      { tenantId, categoryId: saladId, name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons, and Caesar dressing. Add grilled chicken for extra protein.", image: "/pizza/caesar-salad.jpg", price: "10.99", costPrice: "3.50", calories: 320, prepTimeMinutes: 5, isAvailable: true, isPopular: false, isVegetarian: true, sizes: [{ label: "Side", priceModifier: -3, inches: 0 }, { label: "Entree", priceModifier: 0, inches: 0 }], crusts: [], toppings: [], tags: ["healthy", "fresh"] },
      { tenantId, categoryId: dessertId, name: "Dessert Pizza", description: "Nutella base with fresh strawberries, bananas, and powdered sugar. A sweet ending to any meal.", image: "/pizza/dessert-pizza.jpg", price: "11.99", costPrice: "3.50", calories: 580, prepTimeMinutes: 10, isAvailable: true, isPopular: true, isVegetarian: true, sizes: [{ label: "Regular", priceModifier: 0, inches: 0 }], crusts: [], toppings: [], tags: ["sweet", "shareable"] },
      { tenantId, categoryId: dessertId, name: "Tiramisu", description: "Classic Italian dessert with layers of mascarpone cream, coffee-soaked ladyfingers, and cocoa.", image: "/pizza/tiramisu.jpg", price: "8.99", costPrice: "2.50", calories: 420, prepTimeMinutes: 0, isAvailable: true, isPopular: true, isVegetarian: true, sizes: [{ label: "Single", priceModifier: 0, inches: 0 }], crusts: [], toppings: [], tags: ["classic", "italian"] },
    ]);
    console.log("Created menu items");
  }

  // ─── STAFF ───────────────────────────────────────────────────────────────
  const existingStaff = await db.select().from(staff).where(eq(staff.tenantId, tenantId));
  if (existingStaff.length === 0) {
    await db.insert(staff).values([
      { tenantId, name: "Giovanni Rossi", email: "g.rossi@napolipizza.com", phone: "(212) 555-0101", role: "manager", pin: "1234", isActive: true },
      { tenantId, name: "Maria Bianchi", email: "m.bianchi@napolipizza.com", phone: "(212) 555-0102", role: "cashier", pin: "2345", isActive: true },
      { tenantId, name: "Marco Ferretti", email: "m.ferretti@napolipizza.com", phone: "(212) 555-0103", role: "chef", pin: "3456", isActive: true },
      { tenantId, name: "Sofia Romano", email: "s.romano@napolipizza.com", phone: "(212) 555-0104", role: "server", pin: "4567", isActive: true },
      { tenantId, name: "Luca Conti", email: "l.conti@napolipizza.com", phone: "(212) 555-0105", role: "host", pin: "5678", isActive: true },
      { tenantId, name: "Elena Marino", email: "e.marino@napolipizza.com", phone: "(212) 555-0106", role: "chef", pin: "6789", isActive: true },
    ]);
    console.log("Created staff");
  }

  // ─── TABLES ──────────────────────────────────────────────────────────────
  const existingTables = await db.select().from(tables).where(eq(tables.tenantId, tenantId));
  if (existingTables.length === 0) {
    await db.insert(tables).values([
      { tenantId, number: "1", capacity: 2, section: "Patio", status: "available" },
      { tenantId, number: "2", capacity: 2, section: "Patio", status: "available" },
      { tenantId, number: "3", capacity: 4, section: "Patio", status: "occupied" },
      { tenantId, number: "4", capacity: 4, section: "Patio", status: "available" },
      { tenantId, number: "5", capacity: 6, section: "Patio", status: "reserved" },
      { tenantId, number: "6", capacity: 2, section: "Main Dining", status: "available" },
      { tenantId, number: "7", capacity: 4, section: "Main Dining", status: "occupied" },
      { tenantId, number: "8", capacity: 4, section: "Main Dining", status: "available" },
      { tenantId, number: "9", capacity: 4, section: "Main Dining", status: "reserved" },
      { tenantId, number: "10", capacity: 6, section: "Main Dining", status: "available" },
      { tenantId, number: "11", capacity: 8, section: "Main Dining", status: "available" },
      { tenantId, number: "12", capacity: 2, section: "Bar Area", status: "occupied" },
      { tenantId, number: "13", capacity: 2, section: "Bar Area", status: "available" },
      { tenantId, number: "14", capacity: 4, section: "Bar Area", status: "available" },
      { tenantId, number: "15", capacity: 4, section: "Private Room", status: "available" },
      { tenantId, number: "16", capacity: 8, section: "Private Room", status: "reserved" },
      { tenantId, number: "17", capacity: 12, section: "Private Room", status: "available" },
      { tenantId, number: "18", capacity: 2, section: "Counter", status: "available" },
    ]);
    console.log("Created tables");
  }

  // ─── INVENTORY ───────────────────────────────────────────────────────────
  const existingInv = await db.select().from(inventory).where(eq(inventory.tenantId, tenantId));
  if (existingInv.length === 0) {
    await db.insert(inventory).values([
      { tenantId, name: "Pizza Dough", sku: "DOU-001", category: "Bakery", unit: "balls", quantity: "120", minLevel: "30", reorderPoint: "50", unitCost: "0.80", supplier: "Artisan Dough Co." },
      { tenantId, name: "Mozzarella Cheese", sku: "CHS-001", category: "Dairy", unit: "lbs", quantity: "45", minLevel: "15", reorderPoint: "25", unitCost: "4.50", supplier: "Wisconsin Dairy" },
      { tenantId, name: "San Marzano Tomatoes", sku: "SAU-001", category: "Sauces", unit: "cans", quantity: "80", minLevel: "20", reorderPoint: "30", unitCost: "2.50", supplier: "Italian Imports" },
      { tenantId, name: "Pepperoni", sku: "MT-001", category: "Meats", unit: "lbs", quantity: "35", minLevel: "10", reorderPoint: "15", unitCost: "5.20", supplier: "Heritage Meats" },
      { tenantId, name: "Chicken Breast", sku: "MT-002", category: "Meats", unit: "lbs", quantity: "25", minLevel: "10", reorderPoint: "15", unitCost: "4.80", supplier: "Free Range Farms" },
      { tenantId, name: "Fresh Basil", sku: "HRB-001", category: "Produce", unit: "oz", quantity: "12", minLevel: "5", reorderPoint: "8", unitCost: "1.20", supplier: "Local Farms" },
      { tenantId, name: "Olive Oil", sku: "OIL-001", category: "Oils", unit: "liters", quantity: "18", minLevel: "5", reorderPoint: "8", unitCost: "8.50", supplier: "Mediterranean Imports" },
      { tenantId, name: "Flour (00)", sku: "FLR-001", category: "Dry Goods", unit: "lbs", quantity: "200", minLevel: "50", reorderPoint: "80", unitCost: "0.55", supplier: "Caputo Flour" },
      { tenantId, name: "Parmesan Cheese", sku: "CHS-002", category: "Dairy", unit: "lbs", quantity: "20", minLevel: "8", reorderPoint: "12", unitCost: "6.00", supplier: "Italian Imports" },
      { tenantId, name: "Pineapple", sku: "PRD-001", category: "Produce", unit: "cans", quantity: "30", minLevel: "10", reorderPoint: "15", unitCost: "1.80", supplier: "Tropical Farms" },
    ]);
    console.log("Created inventory");
  }

  // ─── SAMPLE ORDERS ───────────────────────────────────────────────────────
  const existingOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
  if (existingOrders.length === 0) {
    const orderData = [
      { tenantId, orderNumber: "PZ-2026-1001", customerName: "Anthony Russo", customerPhone: "(212) 555-0201", orderType: "dineIn" as const, tableNumber: "7", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, subtotal: "35.98", tax: "3.15", tip: "6.00", discount: "0.00", total: "45.13", source: "web" as const },
      { tenantId, orderNumber: "PZ-2026-1002", customerName: "Lisa Chen", customerPhone: "(212) 555-0202", orderType: "takeout" as const, status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "cash" as const, subtotal: "16.99", tax: "1.49", tip: "2.00", discount: "0.00", total: "20.48", source: "pos" as const },
      { tenantId, orderNumber: "PZ-2026-1003", customerName: "Mike Johnson", customerPhone: "(212) 555-0203", orderType: "delivery" as const, status: "preparing" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, subtotal: "42.97", tax: "3.76", tip: "5.00", discount: "0.00", total: "51.73", source: "web" as const },
      { tenantId, orderNumber: "PZ-2026-1004", customerName: "Sarah Kim", customerPhone: "(212) 555-0204", orderType: "dineIn" as const, tableNumber: "3", status: "baking" as const, paymentStatus: "pending" as const, subtotal: "28.98", tax: "2.54", tip: "0.00", discount: "0.00", total: "31.52", source: "kiosk" as const },
      { tenantId, orderNumber: "PZ-2026-1005", customerName: "David Torres", customerPhone: "(212) 555-0205", orderType: "takeout" as const, status: "ready" as const, paymentStatus: "paid" as const, paymentMethod: "mobile" as const, subtotal: "19.98", tax: "1.75", tip: "3.00", discount: "0.00", total: "24.73", source: "pos" as const },
    ];
    for (const o of orderData) await db.insert(orders).values(o);
    console.log("Created sample orders");
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed();
