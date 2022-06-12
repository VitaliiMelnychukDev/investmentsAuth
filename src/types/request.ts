import { ITokenPayload } from './token';

export interface AuthorizedRequest {
  account: ITokenPayload;
}

export const enum Header {
  Authorization = 'authorization',
}
