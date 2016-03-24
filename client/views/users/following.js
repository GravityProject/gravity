Template.following.helpers({
  users: () => {
    if (Meteor.user().followingIds && Meteor.user().followingIds.length !== 0) {
      return Meteor.users.find({ _id: { $in: Meteor.user().followingIds } }, { sort: { username: 1 } });
    } else {
      return [];
    }
  }
});

Template.following.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.following');
  });
});
