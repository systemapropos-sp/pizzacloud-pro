import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { staff } from "@db/schema";
import { eq } from "drizzle-orm";
const TENANT_ID = 1;
export const staffRouter = createRouter({
  list: publicQuery.input(z.object({ role: z.string().optional() }).optional()).query(async ({ input }) => {
    const db = getDb();
    const conds = [eq(staff.tenantId, TENANT_ID)];
    if (input?.role) conds.push(eq(staff.role, input.role as any));
    return db.select().from(staff).where(eq(staff.tenantId, TENANT_ID));
  }),
});
