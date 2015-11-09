Template.signIn.events({
  'submit [data-id=sign-in-form]': (event, template) => {
    event.preventDefault();

    let user = {
      email: template.find('[data-id=email]').value,
      password: template.find('[data-id=password]').value
    };

    Meteor.loginWithPassword(user.email, user.password, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        FlowRouter.go('/');
      }
    });
  }
});
