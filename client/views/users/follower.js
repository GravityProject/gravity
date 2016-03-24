Template.follower.helpers({
  users: () => {
    return Meteor.users.find({ _id: { $ne: Meteor.userId() } }, { sort: { username: 1 } });
  }
});

Template.follower.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.follower');
  });
});
