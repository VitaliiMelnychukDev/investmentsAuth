export enum AccountRole {
  Admin = 'admin',
  User = 'user',
  Bank = 'bank',
  Company = 'company',
}

export const accountRoles: AccountRole[] = [
  AccountRole.Admin,
  AccountRole.Bank,
  AccountRole.Company,
  AccountRole.User,
];

export interface IUpdateAccount {
  email?: string;

  name?: string;

  password?: string;

  role?: AccountRole;

  activated?: boolean;
}

export interface IAccount {
  id: number;

  email: string;

  name: string;

  role: AccountRole;

  activated: boolean;
}

export const defaultRole: AccountRole = AccountRole.User;
