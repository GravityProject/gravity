Template.header.events({
  'click [data-id=sign-out]': function() {
    Meteor.logout(function(error) {
      if (error) {
        alert(error.reason);
      } else {
        FlowRouter.go('/sign-in');
      }
    });
  }
});
