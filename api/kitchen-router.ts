import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { ORDERS, ORDER_ITEMS, getKitchenTickets, getKitchenStats } from "./mock-data";

export const kitchenRouter = createRouter({
  tickets: publicQuery.query(async () => {
    return getKitchenTickets();
  }),

  updateItemStatus: publicQuery
    .input(z.object({ itemId: z.number(), status: z.enum(["pending", "preparing", "baking", "ready", "served"]) }))
    .mutation(async ({ input }) => {
      const item = ORDER_ITEMS.find(i => i.id === input.itemId);
      if (item) item.status = input.status;
      return { success: true };
    }),

  updateOrderStatus: publicQuery
    .input(z.object({ orderId: z.number(), status: z.enum(["pending", "confirmed", "preparing", "baking", "ready", "delivered", "completed", "cancelled"]) }))
    .mutation(async ({ input }) => {
      const order = ORDERS.find(o => o.id === input.orderId);
      if (order) {
        order.status = input.status;
        order.updatedAt = new Date();
        if (input.status === "completed") order.completedAt = new Date();
      }
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    return getKitchenStats();
  }),
});
