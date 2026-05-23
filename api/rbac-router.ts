import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { permissions, userPermissions } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const rbacRouter = createRouter({
  myPermissions: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    if (ctx.user.role === "superadmin") {
      const allPerms = await getDb().select().from(permissions);
      return allPerms.map(p => ({ ...p, granted: true }));
    }
    const db = getDb();
    const result = await db.select()
      .from(userPermissions)
      .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
      .where(and(eq(userPermissions.userId, ctx.user.id), eq(userPermissions.granted, true)));
    return result.map(r => ({ ...r.permissions, granted: true }));
  }),

  allPermissions: publicQuery.query(async () => {
    return getDb().select().from(permissions);
  }),

  grantPermission: publicQuery
    .input(z.object({ userId: z.number(), permissionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.insert(userPermissions).values({
        userId: input.userId,
        permissionId: input.permissionId,
        grantedBy: ctx.user?.id,
      }).onConflictDoNothing();
      return { success: true };
    }),

  revokePermission: publicQuery
    .input(z.object({ userId: z.number(), permissionId: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(userPermissions)
        .where(and(eq(userPermissions.userId, input.userId), eq(userPermissions.permissionId, input.permissionId)));
      return { success: true };
    }),
});
