Template.post.events({
  'click [data-id=remove-post]': function (event, template) {
    let post = {
      _id: this._id
    };

    if (confirm('do you really want to remove this post? This can not be undone!')) {
      Meteor.call('posts.remove', post, (error, result) => {
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
