import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { inventory } from "@db/schema";
import { eq, and, like } from "drizzle-orm";
const TENANT_ID = 1;
export const inventoryRouter = createRouter({
  list: publicQuery.input(z.object({ search: z.string().optional(), lowStock: z.boolean().optional() }).optional()).query(async ({ input }) => {
    const db = getDb();
    const conds = [eq(inventory.tenantId, TENANT_ID), eq(inventory.isActive, true)];
    if (input?.search) conds.push(like(inventory.name, `%${input.search}%`));
    const results = await db.select().from(inventory).where(and(...conds));
    if (input?.lowStock) return results.filter(i => parseFloat(i.quantity ?? "0") <= parseFloat(i.reorderPoint ?? "0"));
    return results;
  }),
  categories: publicQuery.query(async () => {
    const db = getDb();
    const items = await db.select({ category: inventory.category }).from(inventory).where(eq(inventory.tenantId, TENANT_ID));
    return [...new Set(items.map(i => i.category))].filter(Boolean);
  }),
});
