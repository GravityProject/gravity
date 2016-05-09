Meteor.publish(null, function() {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { biography: 1, followingIds: 1 } });
  }
});

Meteor.publish('userStatus', function() {
  return Meteor.users.find({'status.online': true });
});

Meteor.publishComposite('posts.all', function(query, filter, limit) {
  check(query, String);
  check(filter, String);
  check(limit, Number);

  if (this.userId) {
    let currentUser = Meteor.users.findOne({ _id: this.userId });

    let parameters = {
      find: {},
      options: {}
    };

    if (filter === 'following') {
      if (currentUser.followingIds && currentUser.followingIds.length !== 0) {
        parameters.find.authorId = { $in: currentUser.followingIds };
      } else {
        parameters.find.authorId = { $in: [] };
      }
    }

    return {
      find: () => {
        if (query) {
          parameters.find.$text = { $search: query };
          parameters.options = {
            fields: { score: { $meta: 'textScore' } },
            sort: { score: { $meta: 'textScore' } },
            limit: limit
          };
        } else {
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
    };
  } else {
    return [];
  }
});

Meteor.publishComposite('users.profile', function(_id, limit) {
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
            Counts.publish(this, 'users.profile', Posts.find({ authorId: user._id }), { noReady: true });
            return Posts.find({ authorId: user._id }, { sort: { createdAt: -1 }, limit: limit });
          }
        }
      ]
    };
  } else {
    return [];
  }
});

Meteor.publish('users.all', function(query, limit) {
  check(query, String);
  check(limit, Number);

  if (this.userId) {
    if (query) {
      Counts.publish(this, 'users.all', Meteor.users.find({ $text: { $search: query } }), { noReady: true });
      return Meteor.users.find(
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
      Counts.publish(this, 'users.all', Meteor.users.find(), { noReady: true });
      return Meteor.users.find({}, { sort: { createdAt: -1 }, limit: limit });
    }
  } else {
    return [];
  }
});

Meteor.publish('users.following', function() {
  if (this.userId) {
    let currentUser = Meteor.users.findOne({ _id: this.userId });

    if (currentUser.followingIds && currentUser.followingIds.length !== 0) {
      return Meteor.users.find({ _id: { $in: currentUser.followingIds } }, { sort: { username: 1 } });
    } else {
      return [];
    }
  } else {
    return [];
  }
});

Meteor.publish('users.follower', function() {
  if (this.userId) {
    let currentUser = Meteor.users.findOne({ _id: this.userId });

    return Meteor.users.find({ followingIds: { $in: [currentUser._id] } }, { sort: { username: 1 } });
  } else {
    return [];
  }
});

Meteor.publish('messages.all', function() {
  if (this.userId) {
    let currentUser = Meteor.users.findOne({_id: this.userId});

    return Messages.find({ $or: [{ originatingFromId: currentUser._id }, {originatingToId: currentUser._id }] });
  } else {
    return [];
  }
});

Meteor.publish('jobs.all', function(query, limit) {
  check(query, String);
  check(limit, Number);

  if (this.userId) {
    if (query) {
      Counts.publish(this, 'jobs.all', Jobs.find({title: { $regex: '.*' + query + '.*', $options: 'i' } }), { noReady: true });
      return Jobs.find({ title: { $regex: '.*' + query + '.*', $options: 'i' } }, { sort: { createdOn: -1 }, limit: limit });
    } else {
      Counts.publish(this, 'jobs.all', Jobs.find({}), { noReady: true });
      return Jobs.find({}, { sort: { createdOn: -1 }, limit: limit });
    }
  } else {
    return [];
  }
});
