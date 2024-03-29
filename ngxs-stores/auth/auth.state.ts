/** @format */

import { Injectable } from "@angular/core";
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from "@ngxs/store";
import { StateReset } from "ngxs-reset-plugin";
import { checkIntegrityOf, notNull } from "../../../core/utils/validator";
import { AuthActions } from "./auth.actions";
import { AuthStateModel } from "./auth.state.model";
import { AuthService } from "../../services/auth.service";
import { firstValueFrom } from "rxjs";

@State<AuthStateModel>({
  name: "authStore",
  defaults: {
    chalenge: { isOnChalenge: false, data: null },
    authToken: {
      accessToken: "",
      idToken: "",
      refreshToken: "",
    },
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  /**
   * @ignore
   */
  constructor(
    private readonly authService: AuthService,
    private readonly store: Store
  ) {}

  async ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    await this.checkAuthTokens(ctx);
    this.setTokenRefresher();
  }

  private async checkAuthTokens(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState().authToken;

    if (
      !checkIntegrityOf(state.accessToken) ||
      !checkIntegrityOf(state.idToken)
    ) {
      await firstValueFrom(this.store.dispatch(new AuthActions.RenewToken()));
    } else if (!state.refreshToken)
      await firstValueFrom(this.store.dispatch(new AuthActions.Logout()));
  }

  private setTokenRefresher() {
    setInterval(
      () => this.store.dispatch(new AuthActions.RenewToken()),
      1000 * 60 * 5
    );
  }

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return checkIntegrityOf(state.authToken.accessToken)
      ? state.authToken.accessToken
      : null;
  }

  @Selector()
  static idToken(state: AuthStateModel): string | null {
    return checkIntegrityOf(state.authToken.idToken)
      ? state.authToken.idToken
      : null;
  }

  @Selector()
  static refreshToken(state: AuthStateModel): string | null {
    return checkIntegrityOf(state.authToken.refreshToken)
      ? state.authToken.refreshToken
      : null;
  }

  @Action(AuthActions.SignUp)
  async signUp(
    _: StateContext<AuthStateModel>,
    action: AuthActions.SignUp
  ): Promise<any> {
    try {
      await this.authService.signUp(action.user, action.password);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Action(AuthActions.Login)
  async login(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.Login
  ): Promise<any> {
    const response = await this.authService.login(action.user, action.password);

    if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
      ctx.patchState({ chalenge: { isOnChalenge: true, data: response } });
      return;
    }

    this.setTokenByResponse(ctx, response);
    return;
  }

  @Action(AuthActions.CompletePass)
  async completePass(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.CompletePass
  ): Promise<any> {
    const chalengeData = ctx.getState().chalenge.data;

    if (!notNull(chalengeData)) {
      throw new Error("Senha não definida");
    }

    const response = await this.authService.completeChalenge(
      { ...chalengeData },
      action.password
    );
    ctx.patchState({ chalenge: { isOnChalenge: false, data: null } });

    this.setTokenByResponse(ctx, response);
  }

  private setTokenByResponse(
    ctx: StateContext<AuthStateModel>,
    cognitoResponse: any
  ): void {
    let tokenList = [
      cognitoResponse.signInUserSession.accessToken.jwtToken,
      cognitoResponse.signInUserSession.idToken.jwtToken,
      cognitoResponse.signInUserSession.refreshToken.token,
    ];
    this.setToken(ctx, tokenList);
  }

  private setToken(
    ctx: StateContext<AuthStateModel>,
    tokenList: string[]
  ): void {
    if (tokenList.length !== 3) {
      throw new Error("Token de autenticação inexistente");
    }

    ctx.patchState({
      authToken: {
        accessToken: tokenList[0],
        idToken: tokenList[1],
        refreshToken: tokenList[2],
      },
    });
  }

  @Action(AuthActions.SendCode)
  async sendCode(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.SendCode
  ): Promise<any> {
    await this.authService.sendForgotPassCode(action.user);
    ctx.patchState({ chalenge: { isOnChalenge: true, data: action.user } });
  }

  @Action(AuthActions.SubmitNewPassword)
  async submitNewPassword(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.SubmitNewPassword
  ): Promise<any> {
    const username = ctx.getState().chalenge.data;
    const password = action.password;
    const verificationCode = action.verificationCode;

    if (
      !(notNull(username) && notNull(password) && notNull(verificationCode))
    ) {
      throw new Error(
        "Nome de usuário, senha ou código de verificação não definido"
      );
    }

    await this.authService.forgotPasswordSubmit(
      username,
      password,
      verificationCode
    );
    ctx.patchState({ chalenge: { isOnChalenge: false, data: null } });
  }

  @Action(AuthActions.Logout)
  async logout(_: StateContext<AuthStateModel>): Promise<void> {
    const response = await this.authService.logout();
    await firstValueFrom(this.store.dispatch(new StateReset(AuthState)));
    return response;
  }

  @Action(AuthActions.RenewToken)
  async renewToken(ctx: StateContext<AuthStateModel>): Promise<void> {
    const sessionData = await this.authService.refreshToken();
    this.setToken(ctx, [
      sessionData.accessToken.jwtToken,
      sessionData.idToken.jwtToken,
      sessionData.refreshToken.token,
    ]);
  }
}
