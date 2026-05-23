import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";
import { eq } from "drizzle-orm";

export const posRouter = createRouter({
  quickPay: publicQuery
    .input(z.object({
      orderId: z.number(),
      paymentMethod: z.enum(["cash", "card", "mobile"]),
      amount: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({
        paymentStatus: "paid",
        paymentMethod: input.paymentMethod,
        status: "completed",
        updatedAt: new Date(),
        completedAt: new Date(),
      }).where(eq(orders.id, input.orderId));
      return { success: true };
    }),
});
