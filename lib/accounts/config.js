AccountsTemplates.configure({
  defaultLayout: 'layout',
  defaultLayoutRegions: {
    header: 'header'// ,
    // footer: '_footer'
  },
  defaultContentRegion: 'main',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,
  sendVerificationEmail: true,
  lowercaseUsername: false,

  // enforceEmailVerification: true,
  confirmPassword: true,
  continuousValidation: true,
  // displayFormLabels: true,
  // forbidClientAccountCreation: false,
  homeRoutePath: '/',
  // showAddRemoveServices: false,
  showPlaceholders: true,

  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: false,

  // privacyUrl: 'privacy',
  // termsUrl: 'terms',

  texts: {
    title: {
      changePwd: 'Change password',
      forgotPwd: 'Forgot password?',
      resetPwd: 'Reset password',
      signIn: 'Sign in',
      signUp: 'Sign up',
      verifyEmail: 'Verify Email'
    },
    button: {
      changePwd: 'Change password',
      enrollAccount: 'Enroll Text',
      forgotPwd: 'Send reset link',
      resetPwd: 'Reset Password',
      signIn: 'Sign in',
      signUp: 'Sign up'
    }
  }
});

// configuring useraccounts for login with both username or email
let pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: 'Email',
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email'
  },
  {
    _id: 'username',
    type: 'text',
    displayName: 'Username',
    required: true,
    minLength: 4
  },
  {
    _id: 'username_and_email',
    placeholder: 'Username or email',
    type: 'text',
    required: true,
    displayName: 'Login'
  },
  pwd
]);

// enable preconfigured Flow-Router routes by useraccounts:flow-router.
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
// AccountsTemplates.configureRoute('enrollAccount'); // for creating passwords after logging first time
