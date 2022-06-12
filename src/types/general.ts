import { AuthMessage, AccountMessage } from './message';

type Message = AccountMessage | AuthMessage;

export interface IResponseNoData {
  success?: boolean;
  message?: Message;
}

export interface IResponse<T> extends IResponseNoData {
  data: T;
}
