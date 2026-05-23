import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { ORDERS, ORDER_ITEMS, MENU_ITEMS } from "./mock-data";

let nextOrderId = 100;

export const orderRouter = createRouter({
  list: publicQuery
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let orders = [...ORDERS];
      if (input?.status) orders = orders.filter(o => o.status === input.status);
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const order = ORDERS.find(o => o.id === input.id);
      if (!order) return null;
      const items = ORDER_ITEMS.filter(i => i.orderId === input.id);
      return { ...order, items };
    }),

  create: publicQuery
    .input(z.object({
      customerName: z.string().optional(),
      customerPhone: z.string().optional(),
      orderType: z.enum(["dineIn", "takeout", "delivery", "driveThru"]),
      tableNumber: z.string().optional(),
      notes: z.string().optional(),
      source: z.enum(["web", "kiosk", "pos", "mobile", "phone"]),
      subtotal: z.string(),
      tax: z.string(),
      total: z.string(),
      items: z.array(z.object({
        menuItemId: z.number(),
        name: z.string(),
        quantity: z.number(),
        unitPrice: z.string(),
        totalPrice: z.string(),
        selectedSize: z.any().optional(),
        selectedCrust: z.any().optional(),
        selectedToppings: z.any().optional(),
        selectedExtras: z.any().optional(),
        specialInstructions: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const orderNumber = `PZ-${Date.now().toString(36).toUpperCase()}`;
      const orderId = ++nextOrderId;
      ORDERS.push({
        id: orderId,
        tenantId: 1,
        orderNumber,
        customerName: input.customerName ?? null,
        customerPhone: input.customerPhone ?? null,
        orderType: input.orderType,
        tableNumber: input.tableNumber ?? null,
        notes: input.notes ?? null,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: null,
        subtotal: input.subtotal,
        tax: input.tax,
        tip: "0.00",
        discount: "0.00",
        total: input.total,
        source: input.source,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
      });
      for (const item of input.items) {
        ORDER_ITEMS.push({
          id: ORDER_ITEMS.length + 100,
          orderId,
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          selectedSize: item.selectedSize ?? null,
          selectedCrust: item.selectedCrust ?? null,
          selectedToppings: item.selectedToppings ?? [],
          selectedExtras: item.selectedExtras ?? [],
          specialInstructions: item.specialInstructions ?? null,
          status: "pending",
          createdAt: new Date(),
        });
      }
      return { orderId, orderNumber };
    }),

  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.enum(["pending", "confirmed", "preparing", "baking", "ready", "delivered", "completed", "cancelled"]) }))
    .mutation(async ({ input }) => {
      const order = ORDERS.find(o => o.id === input.id);
      if (order) { order.status = input.status; order.updatedAt = new Date(); if (input.status === "completed") order.completedAt = new Date(); }
      return { success: true };
    }),

  updatePayment: publicQuery
    .input(z.object({ id: z.number(), paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]), paymentMethod: z.enum(["cash", "card", "mobile", "online"]).optional() }))
    .mutation(async ({ input }) => {
      const order = ORDERS.find(o => o.id === input.id);
      if (order) { order.paymentStatus = input.paymentStatus; if (input.paymentMethod) order.paymentMethod = input.paymentMethod; order.updatedAt = new Date(); }
      return { success: true };
    }),

  today: publicQuery.query(async () => {
    return ORDERS.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }),
});
