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

  'click [data-id=clear-form]': (event, template) => {
    template.find('[data-id=body]').value = '';
  },

  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    template.searchQuery.set(template.find('[data-id=search-query]').value);
    //Reset the limit of posts when the search query change
    template.limit.set(20);
  }, 300),

  'submit [data-id=search-posts-form]': (event, template) => {
    event.preventDefault();
  }
});

Template.feed.helpers({
  posts: () => {
    //Declare a const to store current instance of template for reusability
    const instance = Template.instance();

    if (instance.searchQuery.get()) {
      return Posts.find({}, { sort: [['score', 'desc']] }, {limit: instance.loaded.get()});
    }
    return Posts.find({}, { sort: { createdAt: -1 } }, {limit: instance.loaded.get()});
  },
  //check if there is any extra posts yet to be loaded
  hasMorePosts: () => {
    const instance = Template.instance();

    return instance.limit.get() <= Counts.get('posts.all');
  }
});

Template.feed.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);
  //Declare a reactiveVar to store the number of loaded posts
  this.loaded = new ReactiveVar(0);

  this.autorun(() => {
    //Get the subscription handler
    let subs = this.subscribe('posts.all', this.searchQuery.get(), this.limit.get());
    //Set number of loaded posts to the value of current limit when the subscription is ready
    if(subs.ready())
    {
      this.loaded.set(this.limit.get());
    }
  });
});
