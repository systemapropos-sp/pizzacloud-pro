import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { INVENTORY } from "./mock-data";

export const inventoryRouter = createRouter({
  list: publicQuery.input(z.object({ search: z.string().optional(), lowStock: z.boolean().optional() }).optional()).query(async ({ input }) => {
    let items = INVENTORY.filter(i => i.isActive);
    if (input?.search) items = items.filter(i => i.name.toLowerCase().includes(input.search!.toLowerCase()));
    if (input?.lowStock) items = items.filter(i => parseFloat(i.quantity) <= parseFloat(i.reorderPoint));
    return items;
  }),
  categories: publicQuery.query(async () => {
    return [...new Set(INVENTORY.map(i => i.category))].filter(Boolean);
  }),
});
