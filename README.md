# Angular Snippets
A collection of snippets that can be used as base source code to implement services, stores and components into Angular applications

### CI/CD
- [Simple Buildspec](#user-content-simple-buildspec)

##### [Simple Buildspec](cicd/buildspec.yaml)
Simple yaml buildspec file suited for a pipeline

#### Components
- [Debounced Input](#user-content-debounced-input)

##### [Debounced Input](components/debounced-input.component.ts)
Simple debounced input using rxjs features


### NGXS Stores
- [Auth Store](#user-content-auth-store)

#### [Auth Store](ngxs-stores/auth/auth.state.ts)
Auth store definition to be used together with Auth service to provide auth and session features such as signUp, signIn, signOut, etc.

### Services 
- [Server Service](#user-content-server-service)
- [Auth Service](#user-content-auth-service)
- [Ionic Message Service](#user-content-ionic-message-service)


#### [Server service](services/server.service.ts)
Simple service to wrap up HTTP methods of Angular HTTPClient while also adding Bearer Auth to the request headers

#### [Auth service](services/amplify-auth.service.ts)
Service to wrap Amplify Auth functions and provide access to cognito features such as signUp, signIn, signOut, change password, etc.

#### [Ionic Message service](services/ionic-message.service.ts)
Service to wrap some Ionic message tools like toast, loading and dialog to provide consistent usage and customization.

### Utils
- [AWS Signature 4](#user-content-aws-signer)
- [Validator](#user-content-aws-signer)
- [Callback to promise](#user-content-callback-to-promise)

#### [AWS Signer](utils/aws-request-signer.ts)
Set of functions to generate AWS sign headers in order to use AWS Signature v4 as an auth method for HTTP requests.
See docs for [AWS Signer](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)

#### [Validator](utils/validator.ts)
Few pocket functions to validate common JS objects

#### [Callback To Promise](utils/callback-to-promise.ts)
Fn that converts a callback type fn into a promise