import { ITokenPayload } from './token';

export class AuthorizedRequest {
  user: ITokenPayload;
}

export const enum Header {
  Authorization = 'authorization',
}
