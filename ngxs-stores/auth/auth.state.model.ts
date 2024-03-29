/** @format */

export interface Token {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface AuthStateModel {
  chalenge: { isOnChalenge: boolean; data: any };
  authToken: Token;
}
