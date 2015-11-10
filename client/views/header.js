Template.header.events({
  'click .user-logout-link': function() {
    Meteor.logout(function(error){
      if(error){
        alert(error.reason);
      } else {
        FlowRouter.go('/sign-in')
      }
    });
  },
});