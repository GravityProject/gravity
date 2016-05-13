Template.feed.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  this.postsCount = new ReactiveVar(0);

  this.autorun(() => {
    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.postsCount.set(Counts.get('posts.all'));
  });
});

Template.feed.onRendered(() => {
  autosize($('[data-id=body]'));

  // Set submit button to disabled since text field is empty
  $('input[type=submit]').addClass('disabled');
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
  },
  // Settings for autocomplete in post field
  settings: () => {
    return {
      position: 'bottom',
      limit: 5,
      rules: [{
        token: '@',
        collection: Meteor.users,
        field: 'username',
        template: Template.userList,
        filter: { _id: { $ne: Meteor.userId() }}
      }]
    };
  }
});

Template.feed.events({
  'keyup [data-id=body]': (event, template) => {
    // If body section has text enable the submit button, else disable it
    if (template.find('[data-id=body]').value.toString().trim() !== '') {
      $('input[type=submit]').removeClass('disabled');
    } else {
      $('input[type=submit]').addClass('disabled');
    }

    // When shift and enter are pressed, submit form
    if (event.shiftKey && event.keyCode === 13) {
      $('[data-id=insert-post-form]').submit();
    }
  },

  'submit [data-id=insert-post-form]': (event, template) => {
    event.preventDefault();

    // Only continue if button isn't disabled
    if (!$('input[type=submit]').hasClass('disabled')) {
      let body = template.find('[data-id=body]').value;

      // If a user is mentioned in the post add span with class to highlight their username
      if(body.indexOf('@') !== -1) {
        for(let x = 0; x < body.length; x++) {
          if(body[x] === '@') {
            let u = body.slice(x + 1, body.indexOf(' ', x));
            let mentionedUser = Meteor.users.findOne({username: u});

            // If a valid user
            if(mentionedUser) {
              // Add opening and closing span tags
              body = body.slice(0, x) + '<a href="/users/' + mentionedUser._id + '">' + body.slice(x, body.indexOf(' ', x)) + '</a>' +
                     body.slice(body.indexOf(' ', x));

              // Increment by number of characters in openeing span tag
              // so the same mention doesn't get evaluated multiple times
              x+= 16;
            }
          }
        }
      }

      Meteor.call('posts.insert', body, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Post successfully submitted', 'success', 'growl-top-right');
          template.find('[data-id=body]').value = '';
          $('[data-id=body]').css('height', '39px');
          $('input[type=submit]').addClass('disabled');
        }
      });
    }
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
