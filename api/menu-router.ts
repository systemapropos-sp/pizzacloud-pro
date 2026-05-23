import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { CATEGORIES, MENU_ITEMS } from "./mock-data";

export const menuRouter = createRouter({
  categories: publicQuery.query(async () => {
    return CATEGORIES.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }),

  items: publicQuery
    .input(z.object({ categoryId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      let items = MENU_ITEMS.filter(i => i.isAvailable);
      if (input?.categoryId) items = items.filter(i => i.categoryId === input.categoryId);
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }),

  itemById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return MENU_ITEMS.find(i => i.id === input.id) ?? null;
    }),

  popular: publicQuery.query(async () => {
    return MENU_ITEMS.filter(i => i.isAvailable && i.isPopular);
  }),
});
