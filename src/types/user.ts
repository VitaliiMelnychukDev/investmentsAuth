export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Bank = 'bank',
  Company = 'company',
}

export const userRoles: UserRole[] = [
  UserRole.Admin,
  UserRole.Bank,
  UserRole.Company,
  UserRole.User,
];

export interface IUpdateUser {
  email?: string;

  name?: string;

  password?: string;

  role?: UserRole;

  activated?: boolean;
}

export interface IUser {
  id: number;

  email: string;

  name: string;

  role: UserRole;

  activated: boolean;
}

export const defaultRole: UserRole = UserRole.User;
