import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories, menuItems } from "@db/schema";
import { eq, and, asc } from "drizzle-orm";

const TENANT_ID = 1;

export const menuRouter = createRouter({
  categories: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories)
      .where(and(eq(categories.tenantId, TENANT_ID), eq(categories.isActive, true)))
      .orderBy(asc(categories.sortOrder));
  }),

  items: publicQuery
    .input(z.object({ categoryId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conds = [eq(menuItems.tenantId, TENANT_ID), eq(menuItems.isAvailable, true)];
      if (input?.categoryId) conds.push(eq(menuItems.categoryId, input.categoryId));
      return db.select().from(menuItems).where(and(...conds)).orderBy(asc(menuItems.name));
    }),

  itemById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const r = await db.select().from(menuItems).where(eq(menuItems.id, input.id));
      return r[0] ?? null;
    }),

  popular: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(menuItems)
      .where(and(eq(menuItems.tenantId, TENANT_ID), eq(menuItems.isAvailable, true), eq(menuItems.isPopular, true)));
  }),
});
