import { ITokenPayload } from './token';

export interface IAuthorizedRequest {
  account: ITokenPayload;
}

export const enum Header {
  Authorization = 'authorization',
}
