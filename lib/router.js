publicAccessible = FlowRouter.group({});

signInRequired = FlowRouter.group({
  triggersEnter: [AccountsTemplates.ensureSignedIn]
});

signInRequired.route('/', {
  name: 'feed',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'feed'
    });
    setTitle('Feed');
  }
});

signInRequired.route('/post/:post_id', {
  name: 'thread',
  action: ()=> {
    BlazeLayout.render('layout', {
      main: 'thread'
	});
  }
});

signInRequired.route('/update-profile', {
  name: 'updateProfile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'updateProfile'
    });
    setTitle('Update profile');
  }
});

signInRequired.route('/users/:_id', {
  name: 'profile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'profile'
    });
    setTitle('Profile');
  }
});
signInRequired.route('/face/:face_name', {
  name: 'face',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'face'
    });
    setTitle('Face');
  }
});
