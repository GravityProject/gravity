Posts = new Mongo.Collection('posts');

Meteor.methods({
  'posts.insert': (body) => {
    check(body, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!body) {
      throw new Meteor.Error(422, 'Body should not be blank');
    }

    let post = {
      body: body,
      authorId: Meteor.userId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return Posts.insert(post);
  },

  'posts.remove': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }
    if (Meteor.userId() !== Posts.findOne({ _id: _id }).authorId) {
      throw new Meteor.Error(422, 'You can only remove your own posts');
    }

    Posts.remove({ _id: _id });
  }
});
