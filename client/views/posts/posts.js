Template.posts.events({
  'submit [data-id=insert-post-form]': (event, template) => {
    event.preventDefault();

    let post = {
      body: template.find('[data-id=body]').value
    };

    Meteor.call('posts.insert', post, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Post successfully submitted', 'success', 'growl-top-right');
        template.find('[data-id=body]').value = '';
      }
    });
  },

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
  },

  'click [data-id=clear-form]': (event, template) => {
    template.find('[data-id=body]').value = '';
  },

  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    template.searchQuery.set(template.find('[data-id=search-query]').value);
  }, 300),

  'submit [data-id=search-posts-form]': (event, template) => {
    event.preventDefault();
  }
});

Template.posts.helpers({
  posts: () => {
    if (Template.instance().searchQuery.get()) {
      return Posts.find({}, { sort: [['score', 'desc']] });
    }
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  author: function () {
    return Meteor.users.findOne({ _id: this.authorId }).username;
  },

  belongsPostToUser: function () {
    return this.authorId === Meteor.userId();
  }
});

Template.posts.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);

  this.autorun(() => {
    this.subscribe('posts', this.searchQuery.get(), this.limit.get());
  });
});
