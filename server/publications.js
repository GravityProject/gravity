Meteor.publish('posts', function (query) {
  check(query, String);

  if (this.userId) {
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
      return Posts.find({}, { sort: { createdAt: -1 } });
    }
  } else {
    return [];
  }
});
