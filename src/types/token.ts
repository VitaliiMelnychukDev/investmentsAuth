import { UserRole } from './user';

export type ITokens = {
  accessToken: string;
  refreshToken: string;
};

export type ITokenPayload = {
  userId: number;
  email: string;
  role: UserRole;
  name: string;
};
