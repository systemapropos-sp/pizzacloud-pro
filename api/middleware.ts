import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────
const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: ErrorMessages.unauthenticated });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// ─── ROLE MIDDLEWARE ───────────────────────────────────────────────────────
function requireRole(...roles: string[]) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || !roles.includes(ctx.user.role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: ErrorMessages.insufficientRole });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// ─── PERMISSION MIDDLEWARE (granular RBAC) ─────────────────────────────────
function requirePermission(permissionKey: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: ErrorMessages.unauthenticated });
    }
    // Superadmin has all permissions
    if (ctx.user.role === "superadmin") return next({ ctx: { ...ctx, user: ctx.user } });
    // Check user permissions
    const { getDb } = await import("./queries/connection");
    const { userPermissions, permissions } = await import("@db/schema");
    const { eq, and } = await import("drizzle-orm");
    const db = getDb();
    const hasPerm = await db.select()
      .from(userPermissions)
      .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
      .where(and(
        eq(userPermissions.userId, ctx.user.id),
        eq(permissions.key, permissionKey),
        eq(userPermissions.granted, true),
      ))
      .limit(1);
    if (hasPerm.length === 0) {
      throw new TRPCError({ code: "FORBIDDEN", message: `Permission '${permissionKey}' required` });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// ─── PROCEDURES ────────────────────────────────────────────────────────────
export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin", "superadmin"));
export const managerQuery = authedQuery.use(requireRole("manager", "admin", "superadmin"));
export const cashierQuery = authedQuery.use(requireRole("cashier", "manager", "admin", "superadmin"));
export const chefQuery = authedQuery.use(requireRole("chef", "manager", "admin", "superadmin"));

// Permission-based procedure
export const permissionQuery = (key: string) => authedQuery.use(requirePermission(key));
