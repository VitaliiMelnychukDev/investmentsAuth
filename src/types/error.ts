export enum UserError {
  CreateUserFail = 'CreateUserFail',
  UserEmailExists = 'UserEmailExists',
  ActivateUserFail = 'ActivateUserFail',
  SetUserRoleFail = 'SetUserRoleFail',
  UserNotFound = 'UserNotFound',
  GetUsersFail = 'GetUsersFail',
}

export enum AuthError {
  LoginUserFail = 'LoginUserFail',
  RefreshTokenFail = 'RefreshTokenFail',
  LogoutFail = 'LogoutFail',
}

export enum TokenError {
  TokenIsNotValid = 'TokenIsNotValid',
}
