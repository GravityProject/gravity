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
  }
});
