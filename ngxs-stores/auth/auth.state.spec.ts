/** @format */

import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { firstValueFrom, of } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { AuthState } from "./auth.state";
import { AuthActions } from "./auth.actions";

xdescribe("AuthState", () => {
  let store: Store;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jasmine.createSpy("signUp"),
    login: jasmine.createSpy("login"),
    sendForgotPassCode: jasmine.createSpy("sendForgotPassCode"),
    forgotPasswordSubmit: jasmine.createSpy("forgotPasswordSubmit"),
    logout: jasmine.createSpy("logout"),
    refreshToken: jasmine.createSpy("refreshToken"),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuthState])],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });

    store = TestBed.inject(Store);
    authService = TestBed.inject(AuthService);
  });

  describe("SignUp", () => {
    it("should sign up", async () => {
      const action = new AuthActions.SignUp("user1", "password");
      const mockResponse = { message: "Sign up successfull" }; // Replace with the expected response
      mockAuthService.signUp.and.returnValue(of(mockResponse));

      firstValueFrom(await store.dispatch(action));
      expect(mockAuthService.signUp).toHaveBeenCalledWith("user1", "password");
    });

    it("should throw an error when sign up fails", (done) => {
      const action = new AuthActions.SignUp("user1", "password");
      const mockError = new Error("Failed to sign up");
      mockAuthService.signUp.and.throwError(mockError.message);

      store.dispatch(action).subscribe({
        error: (err) => {
          expect(err.message).toEqual(mockError.message);
          done();
        },
      });

      expect(mockAuthService.signUp).toHaveBeenCalledWith("user1", "password");
    });
  });
});
