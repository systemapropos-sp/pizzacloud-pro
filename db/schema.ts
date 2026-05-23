import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── ENUMS ─────────────────────────────────────────────────────────────────
export const orderStatusEnum = pgEnum("order_status", [
  "pending", "confirmed", "preparing", "baking", "ready", "delivered", "completed", "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", "paid", "refunded", "failed",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash", "card", "mobile", "online",
]);

export const orderTypeEnum = pgEnum("order_type", [
  "dineIn", "takeout", "delivery", "driveThru",
]);

export const orderSourceEnum = pgEnum("order_source", [
  "web", "kiosk", "pos", "mobile", "phone",
]);

export const userRoleEnum = pgEnum("user_role", [
  "customer", "cashier", "chef", "manager", "admin", "superadmin",
]);

export const tableStatusEnum = pgEnum("table_status", [
  "available", "occupied", "reserved", "cleaning",
]);

// ─── TENANTS ───────────────────────────────────────────────────────────────
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  timezone: varchar("timezone", { length: 100 }).default("America/New_York"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("8.50"),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  plan: varchar("plan", { length: 50 }).default("free").notNull(),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── USERS ─────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("union_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 320 }),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("customer").notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  phone: varchar("phone", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── PERMISSIONS ───────────────────────────────────────────────────────────
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  module: varchar("module", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── USER PERMISSIONS (granular RBAC) ──────────────────────────────────────
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  permissionId: integer("permission_id").notNull().references(() => permissions.id),
  granted: boolean("granted").default(true).notNull(),
  grantedBy: integer("granted_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── CATEGORIES ────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── MENU ITEMS ────────────────────────────────────────────────────────────
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).default("0.00"),
  calories: integer("calories"),
  prepTimeMinutes: integer("prep_time_minutes").default(12),
  isAvailable: boolean("is_available").default(true),
  isPopular: boolean("is_popular").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  isVegan: boolean("is_vegan").default(false),
  isSpicy: boolean("is_spicy").default(false),
  allergens: jsonb("allergens").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  // Pizza-specific options
  sizes: jsonb("sizes").$type<{ label: string; priceModifier: number; inches: number }[]>(),
  crusts: jsonb("crusts").$type<{ label: string; priceModifier: number }[]>(),
  toppings: jsonb("toppings").$type<{ label: string; priceModifier: number; category: "meat" | "veggie" | "cheese" }[]>(),
  extras: jsonb("extras").$type<{ label: string; priceModifier: number }[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── ORDERS ────────────────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  customerEmail: varchar("customer_email", { length: 320 }),
  orderType: orderTypeEnum("order_type").default("takeout").notNull(),
  tableNumber: varchar("table_number", { length: 20 }),
  status: orderStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  paymentMethod: paymentMethodEnum("payment_method"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  tip: decimal("tip", { precision: 10, scale: 2 }).default("0.00"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  source: orderSourceEnum("source").default("web").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// ─── ORDER ITEMS ───────────────────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  selectedSize: jsonb("selected_size").$type<{ label: string; priceModifier: number }>(),
  selectedCrust: jsonb("selected_crust").$type<{ label: string; priceModifier: number }>(),
  selectedToppings: jsonb("selected_toppings").$type<{ label: string; priceModifier: number }[]>(),
  selectedExtras: jsonb("selected_extras").$type<{ label: string; priceModifier: number }[]>(),
  specialInstructions: text("special_instructions"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── INVENTORY ─────────────────────────────────────────────────────────────
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  category: varchar("category", { length: 100 }),
  unit: varchar("unit", { length: 50 }).default("units"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("0"),
  minLevel: decimal("min_level", { precision: 10, scale: 2 }).default("10"),
  reorderPoint: decimal("reorder_point", { precision: 10, scale: 2 }).default("20"),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).default("0.00"),
  supplier: varchar("supplier", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── STAFF ─────────────────────────────────────────────────────────────────
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 50 }).notNull(),
  pin: varchar("pin", { length: 10 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── TABLES ────────────────────────────────────────────────────────────────
export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  number: varchar("number", { length: 20 }).notNull(),
  capacity: integer("capacity").default(4),
  section: varchar("section", { length: 100 }).default("main"),
  status: tableStatusEnum("status").default("available").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── ACTIVITY LOG ──────────────────────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 100 }),
  entityId: integer("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
