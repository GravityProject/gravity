Posts = new Mongo.Collection('posts');
getCurrentFace = function() {
	var user = Meteor.user();
	var face_name = null
	if (user && user.profile) {
	  face_name = user.profile.current_face_name;
	}
    if (!face_name) {
		throw new Meteor.Error(422, 'User does not have a face.');
	}
	return face_name;
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
	var face_name = getCurrentFace();

    let post = {
      body: body,
      face_name: face_name,
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
    var face_name = getCurrentFace();

    if (face_name !== Posts.findOne({ _id: post._id }).face_name) {
      throw new Meteor.Error(422, 'You can only remove your own posts');
    }

    Posts.remove({ _id: _id });
  }
});
