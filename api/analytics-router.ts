import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDashboardStats, getSalesByDay, getPopularItems } from "./mock-data";

export const analyticsRouter = createRouter({
  dashboard: publicQuery.query(async () => {
    return getDashboardStats();
  }),
  salesByDay: publicQuery.input(z.object({ days: z.number().default(7) })).query(async ({ input }) => {
    return getSalesByDay(input.days);
  }),
  popularItems: publicQuery.input(z.object({ limit: z.number().default(5) })).query(async ({ input }) => {
    return getPopularItems(input.limit);
  }),
});
