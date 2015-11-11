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
