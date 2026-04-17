import type { UserRole } from "./user";

export interface IRolePermission {
  role: UserRole;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateRolePermissionPayload {
  permissions: string[];
}
