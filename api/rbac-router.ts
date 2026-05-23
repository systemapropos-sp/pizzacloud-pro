import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { PERMISSIONS_MOCK } from "./mock-data";

// Simple in-memory permission grants for demo
const userGrants = new Map<number, Set<number>>();

export const rbacRouter = createRouter({
  myPermissions: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    // Superadmin gets all permissions
    if (ctx.user.role === "superadmin") {
      return PERMISSIONS_MOCK.map(p => ({ ...p, granted: true }));
    }
    // Return all permissions marked as granted for demo
    return PERMISSIONS_MOCK.map(p => ({ ...p, granted: true }));
  }),

  allPermissions: publicQuery.query(async () => {
    return [...PERMISSIONS_MOCK];
  }),

  grantPermission: publicQuery
    .input(z.object({ userId: z.number(), permissionId: z.number() }))
    .mutation(async ({ input }) => {
      if (!userGrants.has(input.userId)) userGrants.set(input.userId, new Set());
      userGrants.get(input.userId)!.add(input.permissionId);
      return { success: true };
    }),

  revokePermission: publicQuery
    .input(z.object({ userId: z.number(), permissionId: z.number() }))
    .mutation(async ({ input }) => {
      userGrants.get(input.userId)?.delete(input.permissionId);
      return { success: true };
    }),
});
