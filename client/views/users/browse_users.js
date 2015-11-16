Template.browseUsers.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  }
});

Template.browseUsers.helpers({
  users: () => {
    return Meteor.users.find({ _id: { $ne: Meteor.userId() } }, { sort: { createdAt: -1 } });
  },

  hasMoreUsers: () => {
    return Template.instance().limit.get() <= Counts.get('users.all');
  }
});

Template.browseUsers.onCreated(function () {
  this.limit = new ReactiveVar(20);

  this.autorun(() => {
    this.subscribe('users.all', this.limit.get());
  });
});
