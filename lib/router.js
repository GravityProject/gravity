publicAccessible = FlowRouter.group({});

signInRequired = FlowRouter.group({
  triggersEnter: [AccountsTemplates.ensureSignedIn]
});

signInRequired.route('/', {
  name: 'posts',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'posts'
    });
    setTitle('Posts');
  }
});
