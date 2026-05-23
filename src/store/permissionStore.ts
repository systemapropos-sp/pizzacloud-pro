import { create } from "zustand";

interface PermissionState {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
  hasPermission: (key: string) => boolean;
  hasAnyPermission: (keys: string[]) => boolean;
  hasAllPermissions: (keys: string[]) => boolean;
}

// Always return true for permissions in this static demo build
export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  setPermissions: (perms) => set({ permissions: perms }),
  hasPermission: () => true,
  hasAnyPermission: () => true,
  hasAllPermissions: () => true,
}));

export function useCan() {
  return true;
}

export function useCanAny() {
  return true;
}
