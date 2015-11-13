Meteor.methods({
  'users.addNewFace': (face_input)=> {
    check(face_input, String);
	var user_id = Meteor.userId();
	if (!user_id) {
		throw new Meteor.Error(401, 'You need to be signed in to continue.');
	}
	var preexisting_face = Faces.findOne({ face_name: face_input });
	if (preexisting_face) {
	  throw new Meteor.Error(401, 'Requested Face Name already exists');
	}
	
	face_id = Faces.insert({ face_name: face_input, user_id: user_id}); 
  },
  'users.setCurrentFace': (face_name) => {
	check(face_name, String);
	var user_id = Meteor.userId()
	if (!user_id){
	  throw new Meteor.Error(401, 'You must be authenticated to continue.');
	} else {
	  var existing_face = Faces.findOne({ face_name: face_name });
	  if (existing_face) {
	    if (existing_face.user_id == user_id) {
	      Meteor.users.update({ _id: user_id }, { $set: { 'profile.current_face_name': face_name }});
		} else {
		  throw new Meteor.Error(401, 'Face Name belongs to different user.');
		}
	  } else {
	    throw new Meteor.Error(401, 'Face name is not presently existing.');
	  }
	}
  },
  'users.updateProfile': (user) => {
    check(user, {
      biography: String
    });

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue.');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { biography: user.biography } } )
  },

  'users.follow': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (Meteor.userId() === _id) {
      throw new Meteor.Error(422, 'You can not follow yourself');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $addToSet: { followingIds: _id } });
  },

  'users.unfollow': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (Meteor.userId() === _id) {
      throw new Meteor.Error(422, 'You can not unfollow yourself');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $pull: { followingIds: _id } });
  }
});
