import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems } from "@db/schema";
import { eq, and, desc, gte } from "drizzle-orm";

const TENANT_ID = 1;

export const orderRouter = createRouter({
  list: publicQuery
    .input(z.object({ status: z.string().optional(), dateFrom: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conds = [eq(orders.tenantId, TENANT_ID)];
      if (input?.status) conds.push(eq(orders.status, input.status as any));
      if (input?.dateFrom) conds.push(gte(orders.createdAt, new Date(input.dateFrom)));
      return db.select().from(orders).where(and(...conds)).orderBy(desc(orders.createdAt));
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const o = await db.select().from(orders).where(eq(orders.id, input.id));
      if (!o[0]) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, input.id));
      return { ...o[0], items };
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
      const db = getDb();
      const orderNumber = `PZ-${Date.now().toString(36).toUpperCase()}`;
      const result = await db.insert(orders).values({
        tenantId: TENANT_ID,
        orderNumber,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        orderType: input.orderType,
        tableNumber: input.tableNumber,
        notes: input.notes,
        source: input.source,
        subtotal: input.subtotal,
        tax: input.tax,
        total: input.total,
        status: "pending",
        paymentStatus: "pending",
      }).returning({ id: orders.id });
      const orderId = result[0].id;
      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          selectedSize: item.selectedSize,
          selectedCrust: item.selectedCrust,
          selectedToppings: item.selectedToppings,
          selectedExtras: item.selectedExtras,
          specialInstructions: item.specialInstructions,
          status: "pending",
        });
      }
      return { orderId, orderNumber };
    }),

  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.enum(["pending", "confirmed", "preparing", "baking", "ready", "delivered", "completed", "cancelled"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status, updatedAt: new Date() }).where(eq(orders.id, input.id));
      return { success: true };
    }),

  updatePayment: publicQuery
    .input(z.object({ id: z.number(), paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]), paymentMethod: z.enum(["cash", "card", "mobile", "online"]).optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const update: any = { paymentStatus: input.paymentStatus, updatedAt: new Date() };
      if (input.paymentMethod) update.paymentMethod = input.paymentMethod;
      await db.update(orders).set(update).where(eq(orders.id, input.id));
      return { success: true };
    }),

  today: publicQuery.query(async () => {
    const db = getDb();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return db.select().from(orders).where(and(eq(orders.tenantId, TENANT_ID), gte(orders.createdAt, today))).orderBy(desc(orders.createdAt));
  }),
});
