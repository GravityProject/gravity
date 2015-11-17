Template.feed.events({
  'submit [data-id=insert-post-form]': (event, template) => {
    event.preventDefault();

    Meteor.call('posts.insert', template.find('[data-id=body]').value, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Post successfully submitted', 'success', 'growl-top-right');
        template.find('[data-id=body]').value = '';
      }
    });
  },

  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    template.searchQuery.set(template.find('[data-id=search-query]').value);
    template.limit.set(20);
  }, 300),

  'submit [data-id=search-posts-form]': (event, template) => {
    event.preventDefault();
  }
});

Template.feed.helpers({
  posts: () => {
    const instance = Template.instance();
    if (instance.searchQuery.get()) {
      return Posts.find({}, { sort: [['score', 'desc']] });
    }
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Counts.get('posts.all');
  }
});

Template.feed.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);

  this.autorun(() => {
    this.subscribe('posts.all', this.searchQuery.get(), this.limit.get());
  });
});

Template.feed.onRendered(() => {
  autosize($('[data-id=body]'));
});
