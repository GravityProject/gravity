Template.signUp.events({
  'submit [data-id=sign-up-form]': (event, template) => {
    event.preventDefault();

    let user = {
      email: template.find('[data-id=email]').value,
      username: template.find('[data-id=username]').value,
      password: template.find('[data-id=password]').value,
      passwordRepetition: template.find('[data-id=password-repetition]').value
    };

    if (user.password !== user.passwordRepetition) {
      Bert.alert( "Passwords don't match", 'danger', 'growl-top-right' );
    } else {
      Accounts.createUser({ email: user.email, username: user.username, password: user.password }, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          FlowRouter.go('/');
        }
      });
    }
  }
});
