import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { STAFF } from "./mock-data";

export const staffRouter = createRouter({
  list: publicQuery.input(z.object({ role: z.string().optional() }).optional()).query(async ({ input }) => {
    let items = [...STAFF];
    if (input?.role) items = items.filter(s => s.role === input.role);
    return items;
  }),
});
