/** @format */

import { Injectable } from "@angular/core";
import { Amplify, Auth } from "aws-amplify";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor() {
    Amplify.configure({
      Auth: {
        region: "",
        userPoolId: "",
        userPoolWebClientId: "",
        mandatorySignIn: true,
        authenticationFlowType: "",
      },
    });
  }

  public async signUp(user: string, password: string): Promise<any> {
    try {
      const response = await Auth.signUp({
        username: user,
        password: password,
        attributes: {
          email: user,
        },
      });
      return response;
    } catch (error: any) {
      if (error.code === "TooManyRequestsException") {
        throw Error(
          "O Limite de tentativas de criação de conta excedido. Tente novamente mais tarde."
        );
      } else if (error.code === "InvalidPasswordException") {
        throw Error("Senha escolhida não é válida");
      } else if (error.code === "UsernameExistsException") {
        throw Error("O e-mail fornecido já possui cadastro");
      } else {
        throw error;
      }
    }
  }

  public async signIn(user: string, password: string): Promise<any> {
    try {
      const response = await Auth.signIn(user, password);
      return response;
    } catch (error: any) {
      if (error.code === "UserNotFoundException") {
        throw Error("Usuário não encontrado");
      } else if (error.code === "NotAuthorizedException") {
        throw Error("Usuário ou senha incorretos");
      } else {
        throw error;
      }
    }
  }

  public async completeNewPassword(
    chalengeData: string,
    password: string
  ): Promise<any> {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const response = await Auth.completeNewPassword(
        cognitoUser,
        password,
        []
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async forgotPassword(username: string): Promise<any> {
    try {
      const response = await Auth.forgotPassword(username);
      return response;
    } catch (error: any) {
      if (error.code === "LimitExceededException")
        throw Error(
          "Limite de tentativas de criação de conta excedido. Tente novamente mais tarde."
        );
      else
        throw Error(
          `Não foi possível enviar o código de confirmação. Erro: ${error.code}`
        );
    }
  }

  public async forgotPasswordSubmit(
    username: string,
    newPassword: string,
    verificationCode: string
  ): Promise<any> {
    try {
      const response = await Auth.forgotPasswordSubmit(
        username,
        verificationCode,
        newPassword
      );
      return response;
    } catch (error) {
      if (error.code === "CodeMismatchException")
        throw Error(
          "O código de segurança fornecido não confere. Verifique o código digitado e tente novamente."
        );
      else
        throw Error(
          `Não foi possível redefinir sua senha. Erro: ${error.code}`
        );
    }
  }

  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const response = await Auth.changePassword(
        cognitoUser,
        currentPassword,
        newPassword
      );
      return response;
    } catch (error) {
      throw Error(error);
    }
  }

  public async signOut(): Promise<any> {
    try {
      const response = await Auth.signOut();
      return response;
    } catch (error) {
      throw Error(error);
    }
  }

  public async refreshSession(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const currentSession = await Auth.currentSession();
        const cognitoUser = await Auth.currentAuthenticatedUser();

        cognitoUser.refreshSession(
          currentSession.getRefreshToken(),
          (err: any, session: unknown) => {
            if (err) reject(err);
            resolve(session);
          }
        );
      } catch (error) {
        throw Error(error);
      }
    });
  }
}
