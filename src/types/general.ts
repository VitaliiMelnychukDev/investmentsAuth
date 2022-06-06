import { AuthMessage, UserMessage } from './message';

type Message = UserMessage | AuthMessage;

export interface IResponseNoData {
  success?: boolean;
  message?: Message;
}

export interface IResponse<T> extends IResponseNoData {
  data: T;
}
