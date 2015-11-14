Posts = new Mongo.Collection('posts');
getCurrentFace = function() {
	let user = Meteor.user();
	let faceName = null
	if (user && user.profile) {
	  faceName = user.profile.currentFaceName;
	}
    if (!faceName) {
		throw new Meteor.Error(422, 'User does not have a face.');
	}
	return faceName;
}
Meteor.methods({
  'posts.insert': (body) => {
    check(body, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!body) {
      throw new Meteor.Error(422, 'Body should not be blank');
    }
	let faceName = getCurrentFace();

    let post = {
      body: body,
      faceName: faceName,
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
    let faceName = getCurrentFace();

    if (faceName !== Posts.findOne({ _id: post._id }).faceName) {
      throw new Meteor.Error(422, 'You can only remove your own posts');
    }

    Posts.remove({ _id: _id });
  }
});
