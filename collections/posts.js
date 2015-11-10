Posts = new Mongo.Collection('posts');

Meteor.methods({
  'posts.insert': (post) => {
    check(post, {
      body: String
    });

    if (!post.body) {
      throw new Meteor.Error(422, 'Body should not be blank');
    }

    _.extend(post, { authorId: Meteor.userId(), createdAt: new Date(), updatedAt: new Date() });

    return Posts.insert(post);
  },

  'posts.remove': (post) => {
    check(post, {
      _id: String
    });

    if (!post._id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }
    if (Meteor.userId() !== Posts.findOne({ _id: post._id }).authorId) {
      throw new Meteor.Error(422, 'You can only remove your own posts');
    }

    Posts.remove({ _id: post._id });
  }
});
