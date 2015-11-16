Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { biography: 1, followingIds: 1 } });
  }
});

Meteor.publishComposite('posts.all', function (query, limit) {
  check(query, String);
  check(limit, Number);

  if (this.userId) {
    return {
      find: () => {
        let parameters = {};
        if (query) {
          parameters.find =  { $text: { $search: query } };
          parameters.options = {
            fields: { score: { $meta: 'textScore' } },
              sort: { score: { $meta: 'textScore' } },
              limit: limit
          };
        }
        else {
          parameters.find = {};
          parameters.options = { sort: { createdAt: -1 }, limit: limit };
        }
        Counts.publish(this, 'posts.all', Posts.find(parameters.find), { noReady: true });
        return Posts.find(parameters.find, parameters.options);
      },
      children: [
        {
          find: (post) => {
            return Meteor.users.find({ _id: post.authorId }, { fields: { emails: 1, username: 1 } });
          }
        }
      ]
    }
  } else {
    return [];
  }
});

Meteor.publishComposite('users.profile', function (_id, limit) {
  check(_id, String);
  check(limit, Number);

  if (this.userId) {
    return {
      find: () => {
        return Meteor.users.find({ _id: _id });
      },
      children: [
        {
          find: (user) => {
            return Posts.find({ authorId: user._id }, { sort: { createdAt: -1 }, limit: limit });
          }
        }
      ]
    }
  } else {
    return [];
  }
});

Meteor.publish('users.all', function (limit) {
  check(limit, Number);

  if (this.userId) {
    return Meteor.users.find({}, { sort: { createdAt: -1 }, limit: limit });
  } else {
    return [];
  }
});
