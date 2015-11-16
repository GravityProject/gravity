Template.profile.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  }
});

Template.profile.helpers({
  user: () => {
    return Meteor.users.findOne({ _id: FlowRouter.getParam('_id') });
  },

  posts: function () {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Counts.get('posts.all');
  }
});

Template.profile.onCreated(function () {
  this.limit = new ReactiveVar(20);

  this.autorun(() => {
    this.subscribe('users.profile', FlowRouter.getParam('_id'), this.limit.get());
  });
});
