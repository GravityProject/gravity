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
      
    $('[data-id=body]').css('height', '39px');
  },

  'click [data-id=all]': (event, template) => {
    template.filter.set('all');
  },

  'click [data-id=following]': (events, template) => {
    template.filter.set('following');
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

  activeIfFilterIs: (filter) => {
    if (filter === Template.instance().filter.get()) {
      return 'active';
    }
  },

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Template.instance().postsCount.get();
  }
});

Template.feed.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  this.postsCount = new ReactiveVar(0);

  this.autorun(() => {
    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.postsCount.set(Counts.get('posts.all'));
  });
});

Template.feed.onRendered(() => {
  autosize($('[data-id=body]'));
});
