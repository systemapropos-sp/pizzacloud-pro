import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orderItems, orders } from "@db/schema";
import { eq, and, inArray, asc } from "drizzle-orm";

const TENANT_ID = 1;
const activeStatuses = ["pending", "confirmed", "preparing", "baking", "ready"] as const;
type ActiveStatus = typeof activeStatuses[number];

export const kitchenRouter = createRouter({
  tickets: publicQuery.query(async () => {
    const db = getDb();
    const orderResults = await db.select().from(orders)
      .where(and(eq(orders.tenantId, TENANT_ID), inArray(orders.status, activeStatuses as unknown as string[])))
      .orderBy(asc(orders.createdAt));
    const tickets = [];
    for (const order of orderResults) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      tickets.push({ ...order, items });
    }
    return tickets;
  }),

  updateItemStatus: publicQuery
    .input(z.object({ itemId: z.number(), status: z.enum(["pending", "preparing", "ready", "served"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orderItems).set({ status: input.status }).where(eq(orderItems.id, input.itemId));
      return { success: true };
    }),

  updateOrderStatus: publicQuery
    .input(z.object({ orderId: z.number(), status: z.enum(["pending", "confirmed", "preparing", "baking", "ready", "delivered", "completed", "cancelled"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status, updatedAt: new Date() }).where(eq(orders.id, input.orderId));
      if (input.status === "completed") {
        await db.update(orders).set({ completedAt: new Date() }).where(eq(orders.id, input.orderId));
      }
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const allOrders = await db.select().from(orders).where(eq(orders.tenantId, TENANT_ID));
    const allItems = await db.select().from(orderItems);
    return {
      totalOrders: allOrders.length,
      activeOrders: allOrders.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
      pendingItems: allItems.filter(i => i.status === "pending").length,
      preparingItems: allItems.filter(i => i.status === "preparing").length,
      readyItems: allItems.filter(i => i.status === "ready").length,
    };
  }),
});
