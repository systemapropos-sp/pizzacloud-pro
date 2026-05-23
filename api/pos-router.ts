import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { ORDERS } from "./mock-data";

export const posRouter = createRouter({
  quickPay: publicQuery
    .input(z.object({
      orderId: z.number(),
      paymentMethod: z.enum(["cash", "card", "mobile"]),
      amount: z.string(),
    }))
    .mutation(async ({ input }) => {
      const order = ORDERS.find(o => o.id === input.orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.paymentMethod = input.paymentMethod;
        order.status = "completed";
        order.updatedAt = new Date();
        order.completedAt = new Date();
      }
      return { success: true };
    }),
});
