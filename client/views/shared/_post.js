Template.post.events({
  'click [data-id=remove-post]': function (event, template) {
    if (confirm('do you really want to remove this post? This can not be undone!')) {
      Meteor.call('posts.remove', this._id, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Post successfully removed', 'success', 'growl-top-right');
        }
      });
    }
  }
});

Template.post.helpers({
  author: function () {
    return Meteor.users.findOne({ _id: this.authorId });
  },

  belongsPostToUser: function () {
    return this.authorId === Meteor.userId();
  }
});
