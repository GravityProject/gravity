publicAccessible = FlowRouter.group({});

signInRequired = FlowRouter.group({
  triggersEnter: [
    () => {
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        FlowRouter.go('signIn');
      } else if (Meteor.user()) {
        FlowRouter.go('/');
      }
    }
  ]
});

publicAccessible.route('/sign-up', {
  name: 'signUp',
  action: () => {
    setTitle('Sign up');
    BlazeLayout.render('layout', {
      main: 'signUp'
    });
  }
});

publicAccessible.route('/sign-in', {
  name: 'signIn',
  action: () => {
    setTitle('Sign in');
    BlazeLayout.render('layout', {
      main: 'signIn'
    });
  }
});

publicAccessible.route('/sign-out', {
  name: 'signOut',
  action: () => {
    Meteor.logout(() => {
      FlowRouter.go('signIn');
    });
  }
});

signInRequired.route('/', {
  name: 'home',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'home'
    });
    setTitle('Home');
  }
});
