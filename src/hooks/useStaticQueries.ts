import { useMemo } from "react";
import {
  CATEGORIES,
  MENU_ITEMS,
  ORDERS,
  ORDER_ITEMS,
  STAFF,
  TABLES,
  INVENTORY,
} from "@/lib/mockData";

// ─── Dashboard ──────────────────────────────────────────────
export function useDashboardStats() {
  return useMemo(() => {
    const todayOrders = ORDERS.filter(o => o.status !== "cancelled");
    return {
      data: {
        todayRevenue: todayOrders.reduce((s, o) => s + parseFloat(o.total), 0),
        todayOrders: todayOrders.length,
        weekRevenue: ORDERS.reduce((s, o) => s + parseFloat(o.total), 0),
        weekOrders: ORDERS.length,
        activeOrders: ORDERS.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
        lowStock: INVENTORY.filter(i => parseFloat(i.quantity) <= parseFloat(i.reorderPoint)).length,
        totalStaff: STAFF.length,
      },
      isLoading: false,
    };
  }, []);
}

export function useTodayOrders() {
  return useMemo(() => ({
    data: [...ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    isLoading: false,
  }), []);
}

export function useSalesByDay(_days?: number) {
  return useMemo(() => {
    const dayMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    for (const order of ORDERS) {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!dayMap[date]) dayMap[date] = { date, orders: 0, revenue: 0 };
      dayMap[date].orders++;
      dayMap[date].revenue += parseFloat(order.total);
    }
    return { data: Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date)), isLoading: false };
  }, []);
}

export function usePopularItems(limit?: number) {
  return useMemo(() => {
    const counts: Record<number, { name: string; count: number; revenue: number }> = {};
    for (const item of ORDER_ITEMS) {
      if (!counts[item.menuItemId]) {
        const m = MENU_ITEMS.find(x => x.id === item.menuItemId);
        counts[item.menuItemId] = { name: m?.name ?? "Unknown", count: 0, revenue: 0 };
      }
      counts[item.menuItemId].count += item.quantity;
      counts[item.menuItemId].revenue += parseFloat(item.totalPrice);
    }
    const result = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, limit ?? 5);
    return { data: result, isLoading: false };
  }, [limit]);
}

// ─── Orders ─────────────────────────────────────────────────
export function useOrders(status?: string) {
  return useMemo(() => {
    let orders = [...ORDERS];
    if (status && status !== "all") orders = orders.filter(o => o.status === status);
    return { data: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), isLoading: false };
  }, [status]);
}

// ─── Menu ───────────────────────────────────────────────────
export function useMenuCategories() {
  return useMemo(() => ({
    data: CATEGORIES.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    isLoading: false,
  }), []);
}

export function useMenuItems(categoryId?: number) {
  return useMemo(() => {
    let items = MENU_ITEMS.filter(i => i.isAvailable);
    if (categoryId) items = items.filter(i => i.categoryId === categoryId);
    return { data: items.sort((a, b) => a.name.localeCompare(b.name)), isLoading: false };
  }, [categoryId]);
}

export function usePopularMenuItems() {
  return useMemo(() => ({
    data: MENU_ITEMS.filter(i => i.isAvailable && i.isPopular),
    isLoading: false,
  }), []);
}

// ─── Inventory ──────────────────────────────────────────────
export function useInventory(search?: string, lowStock?: boolean) {
  return useMemo(() => {
    let items = INVENTORY.filter(i => i.isActive);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (lowStock) items = items.filter(i => parseFloat(i.quantity) <= parseFloat(i.reorderPoint));
    return { data: items, isLoading: false };
  }, [search, lowStock]);
}

// ─── Staff ──────────────────────────────────────────────────
export function useStaff(role?: string) {
  return useMemo(() => {
    let items = [...STAFF];
    if (role) items = items.filter(s => s.role === role);
    return { data: items, isLoading: false };
  }, [role]);
}

// ─── Tables ─────────────────────────────────────────────────
export function useTables() {
  return useMemo(() => ({ data: [...TABLES], isLoading: false }), []);
}

// ─── Kitchen ────────────────────────────────────────────────
export function useKitchenTickets() {
  return useMemo(() => {
    const activeStatuses = ["pending", "confirmed", "preparing", "baking", "ready"];
    const orders = ORDERS.filter(o => activeStatuses.includes(o.status)).map(o => ({
      ...o,
      items: ORDER_ITEMS.filter(i => i.orderId === o.id),
    }));
    return { data: orders, isLoading: false };
  }, []);
}

export function useKitchenStats() {
  return useMemo(() => ({
    data: {
      totalOrders: ORDERS.length,
      activeOrders: ORDERS.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
      pendingItems: ORDER_ITEMS.filter(i => i.status === "pending").length,
      preparingItems: ORDER_ITEMS.filter(i => i.status === "preparing").length,
      readyItems: ORDER_ITEMS.filter(i => i.status === "ready").length,
    },
    isLoading: false,
  }), []);
}

// ─── POS Terminal Items ─────────────────────────────────────
export function usePosMenuItems() {
  return useMemo(() => ({
    data: MENU_ITEMS.filter(i => i.isAvailable).sort((a, b) => a.name.localeCompare(b.name)),
    isLoading: false,
  }), []);
}

// ─── Permissions ────────────────────────────────────────────
const ALL_PERMISSIONS = [
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

export function useMyPermissions() {
  return useMemo(() => ({
    data: ALL_PERMISSIONS.map(p => ({ ...p, granted: true })),
    isLoading: false,
  }), []);
}

export function useAllPermissions() {
  return useMemo(() => ({ data: [...ALL_PERMISSIONS], isLoading: false }), []);
}
