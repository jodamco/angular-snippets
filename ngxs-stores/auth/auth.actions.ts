export namespace AuthActions {
	export class SignUp {
		static readonly type = '[Auth] Create a new account'
		constructor(public user: string, public password: string) {}
	}
	export class Login {
		static readonly type = '[Auth] Realizes login'
		constructor(public user: string, public password: string) {}
	}
	export class CompletePass {
		static readonly type = '[Auth] Execute Complete Password challenge'
		constructor(public password: string) {}
	}
	export class SendCode {
		static readonly type = '[Auth] Send code to request new password'
		constructor(public user: string) {}
	}
	export class SubmitNewPassword {
		static readonly type = '[Auth] Submit new password using the verification code sent through "SendCode" action'
		constructor(public password: string, public verificationCode: string) {}
	}
	export class Logout {
		static readonly type = '[Auth] Logout and clear auth data'
		constructor() {}
	}
	export class RenewToken {
		static readonly type = '[Auth] Renew auth token'
	}
}