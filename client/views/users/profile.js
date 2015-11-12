Template.profile.helpers({
  user: () => {
    return Meteor.users.findOne({ _id: FlowRouter.getParam('_id') });
  },

  posts: function () {
    return Posts.find({}, { sort: { createdAt: -1 } });
  }
});

Template.profile.onCreated(function () {
  this.autorun(() => {
    this.subscribe('users.profile', FlowRouter.getParam('_id'));
  });
});
