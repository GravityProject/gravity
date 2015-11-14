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
        if (query) {
          return Posts.find(
            {
              $text: {
                $search: query
              }
            },
            {
              fields: {
                score: {
                  $meta: 'textScore'
                }
              },
              sort: {
                score: {
                  $meta: 'textScore'
                }
              },
              limit: limit
            }
          );
        } else {
          return Posts.find({}, { sort: { createdAt: -1 }, limit: limit });
        }
      },
      children: [
        {
          find: (post) => {
            return Meteor.users.find({ _id: post.authorId });
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
