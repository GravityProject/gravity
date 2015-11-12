Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { biography: 1 } });
  }
});

Meteor.publishComposite('posts', function (query, limit) {
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

Meteor.publish('users.profile', function (_id) {
  check(_id, String);

  if (this.userId) {
    return Meteor.users.find({ _id: _id });
  } else {
    return [];
  }
});

Meteor.publish('faces', function () {
	return Faces.find();
});
Meteor.publish('votes', function () {
	return Votes.find();
});
