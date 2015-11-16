Meteor.methods({
  'users.addNewFace': (faceInput)=> {
    check(faceInput, String);
	let userId = Meteor.userId();
	if (!userId) {
		throw new Meteor.Error(401, 'You need to be signed in to continue.');
	}
	let preexistingFace = Faces.findOne({ faceName: faceInput });
	if (preexistingFace) {
	  throw new Meteor.Error(401, 'Requested Face Name already exists');
	}
	
	faceId = Faces.insert({ faceName: faceInput, userId: userId}); 
  },
  'users.setCurrentFace': (faceName) => {
	check(faceName, String);
	let userId = Meteor.userId()
	if (!userId){
	  throw new Meteor.Error(401, 'You must be authenticated to continue.');
	} else {
	  let existingFace = Faces.findOne({ faceName: faceName });
	  if (existingFace) {
	    if (existingFace.userId == userId) {
	      Meteor.users.update({ _id: userId }, { $set: { 'profile.currentFaceName': faceName }});
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
