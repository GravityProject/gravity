Meteor.publishComposite('posts', function (query) {
  check(query, String);

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
              }
            }
          );
        } else {
          return Posts.find({}, {sort: {createdAt: -1}});
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
