Template.followButton.events({
  'click [data-id=follow]': function(event, template) {
    Meteor.call('users.follow', this.user._id, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert(`You are now following @${this.user.username}`, 'success', 'growl-top-right');
      }
    });
  },

  'click [data-id=unfollow]': function(event, template) {
    Meteor.call('users.unfollow', this.user._id, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert(`You have unfollowed @${this.user.username}`, 'success', 'growl-top-right');
      }
    });
  }
});

Template.followButton.helpers({
  isThisUserNotCurrentUser: function() {
    return this.user._id !== Meteor.userId();
  },

  isCurrentUserFollowingThisUser: function() {
    return Meteor.user().followingIds && Meteor.user().followingIds.indexOf(this.user._id) > -1;
  }
});
