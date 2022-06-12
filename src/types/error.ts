export enum AccountError {
  CreateAccountFail = 'CreateAccountFail',
  AccountEmailExists = 'AccountEmailExists',
  ActivateAccountFail = 'ActivateAccountFail',
  SetAccountRoleFail = 'SetAccountRoleFail',
  AccountNotFound = 'AccountNotFound',
  GetAccountsFail = 'GetAccountsFail',
}

export enum AuthError {
  LoginAccountFail = 'LoginAccountFail',
  RefreshTokenFail = 'RefreshTokenFail',
  LogoutFail = 'LogoutFail',
}

export enum TokenError {
  TokenIsNotValid = 'TokenIsNotValid',
}
