export interface IRole {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  adminRole?: string;
  permissions?: IPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface IPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateRoleData {
  name: string;
  description: string;
  adminRole?: string;
}

export interface ICreatePermissionData {
  name: string;
  description: string;
  resource: string;
  action: string;
  module: string;
}
