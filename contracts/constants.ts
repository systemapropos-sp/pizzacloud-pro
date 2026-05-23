export const Paths = {
  home: "/",
  login: "/login",
  oauthCallback: "/api/oauth/callback",
  app: "/app",
} as const;

export const Session = {
  cookieName: "__kimi_session",
  headerName: "x-kimi-session",
  maxAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required. Please log in.",
  insufficientRole: "You do not have permission to access this resource.",
  notFound: "Resource not found.",
  serverError: "An unexpected error occurred.",
} as const;

export const PERMISSIONS = {
  POS_SELL: "pos:sell",
  POS_REFUND: "pos:refund",
  POS_DISCOUNT: "pos:discount",
  POS_REPORTS: "pos:reports",
  KITCHEN_VIEW: "kitchen:view",
  KITCHEN_UPDATE: "kitchen:update",
  KITCHEN_MANAGE: "kitchen:manage",
  MENU_VIEW: "menu:view",
  MENU_CREATE: "menu:create",
  MENU_UPDATE: "menu:update",
  MENU_DELETE: "menu:delete",
  ORDERS_VIEW: "orders:view",
  ORDERS_CREATE: "orders:create",
  ORDERS_UPDATE: "orders:update",
  ORDERS_CANCEL: "orders:cancel",
  INVENTORY_VIEW: "inventory:view",
  INVENTORY_MANAGE: "inventory:manage",
  STAFF_VIEW: "staff:view",
  STAFF_MANAGE: "staff:manage",
  ADMIN_DASHBOARD: "admin:dashboard",
  ADMIN_SETTINGS: "admin:settings",
  ADMIN_ANALYTICS: "admin:analytics",
  TENANT_MANAGE: "tenant:manage",
  SYSTEM_SETTINGS: "system:settings",
} as const;

export const MODULE_ACCESS: Record<string, string[]> = {
  pos: [PERMISSIONS.POS_SELL, PERMISSIONS.POS_REFUND, PERMISSIONS.POS_DISCOUNT, PERMISSIONS.POS_REPORTS],
  kitchen: [PERMISSIONS.KITCHEN_VIEW, PERMISSIONS.KITCHEN_UPDATE, PERMISSIONS.KITCHEN_MANAGE],
  menu: [PERMISSIONS.MENU_VIEW, PERMISSIONS.MENU_CREATE, PERMISSIONS.MENU_UPDATE, PERMISSIONS.MENU_DELETE],
  orders: [PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_CREATE, PERMISSIONS.ORDERS_UPDATE, PERMISSIONS.ORDERS_CANCEL],
  inventory: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_MANAGE],
  staff: [PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_MANAGE],
  admin: [PERMISSIONS.ADMIN_DASHBOARD, PERMISSIONS.ADMIN_SETTINGS, PERMISSIONS.ADMIN_ANALYTICS],
};

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  customer: [],
  cashier: [PERMISSIONS.POS_SELL, PERMISSIONS.POS_REFUND, PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_CREATE],
  chef: [PERMISSIONS.KITCHEN_VIEW, PERMISSIONS.KITCHEN_UPDATE, PERMISSIONS.MENU_VIEW],
  manager: [PERMISSIONS.POS_SELL, PERMISSIONS.POS_REFUND, PERMISSIONS.POS_DISCOUNT, PERMISSIONS.POS_REPORTS, PERMISSIONS.KITCHEN_VIEW, PERMISSIONS.KITCHEN_UPDATE, PERMISSIONS.KITCHEN_MANAGE, PERMISSIONS.MENU_VIEW, PERMISSIONS.MENU_CREATE, PERMISSIONS.MENU_UPDATE, PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_CREATE, PERMISSIONS.ORDERS_UPDATE, PERMISSIONS.ORDERS_CANCEL, PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_MANAGE, PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_MANAGE, PERMISSIONS.ADMIN_DASHBOARD, PERMISSIONS.ADMIN_ANALYTICS],
  admin: Object.values(PERMISSIONS).filter((p) => !p.startsWith("tenant:") && !p.startsWith("system:")),
  superadmin: Object.values(PERMISSIONS),
};
