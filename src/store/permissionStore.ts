import { create } from "zustand";

interface PermissionState {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
  hasPermission: (key: string) => boolean;
  hasAnyPermission: (keys: string[]) => boolean;
  hasAllPermissions: (keys: string[]) => boolean;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  setPermissions: (perms) => set({ permissions: perms }),
  hasPermission: (key) => {
    const perms = get().permissions;
    return perms.includes(key) || perms.some(p => p === "*" || p.startsWith("tenant:manage") || p.startsWith("system:"));
  },
  hasAnyPermission: (keys) => keys.some(k => get().hasPermission(k)),
  hasAllPermissions: (keys) => keys.every(k => get().hasPermission(k)),
}));

export function useCan(permission: string) {
  return usePermissionStore(s => s.hasPermission(permission));
}

export function useCanAny(permissions: string[]) {
  return usePermissionStore(s => s.hasAnyPermission(permissions));
}
