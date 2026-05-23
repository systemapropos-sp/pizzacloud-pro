import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { tables } from "@db/schema";
import { eq } from "drizzle-orm";
const TENANT_ID = 1;
export const tableRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(tables).where(eq(tables.tenantId, TENANT_ID));
  }),
  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.enum(["available", "occupied", "reserved", "cleaning"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(tables).set({ status: input.status }).where(eq(tables.id, input.id));
      return { success: true };
    }),
});
