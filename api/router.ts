import { createRouter, publicQuery } from "./middleware";
import { authRouter } from "./auth-router";
import { menuRouter } from "./menu-router";
import { orderRouter } from "./order-router";
import { kitchenRouter } from "./kitchen-router";
import { posRouter } from "./pos-router";
import { inventoryRouter } from "./inventory-router";
import { staffRouter } from "./staff-router";
import { tableRouter } from "./table-router";
import { analyticsRouter } from "./analytics-router";
import { rbacRouter } from "./rbac-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  menu: menuRouter,
  order: orderRouter,
  kitchen: kitchenRouter,
  pos: posRouter,
  inventory: inventoryRouter,
  staff: staffRouter,
  table: tableRouter,
  analytics: analyticsRouter,
  rbac: rbacRouter,
});

export type AppRouter = typeof appRouter;
