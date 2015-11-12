Meteor.startup(() => {
  Accounts.validateNewUser((user) => {
    if (user.emails && user.emails[0].address.length !== 0) {
      return true;
    }
    throw new Meteor.Error(403, "E-Mail address should not be blank");
  });
  Accounts.validateNewUser((user) => {
    if (user.username && user.username.length >= 3) {
      return true;
    }
    throw new Meteor.Error(403, "Username must have at least 3 characters");
  });
  Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	if (options.profile) {
		user.profile = options.profile;
	}
	var preexisting_face = Faces.findOne({face_name: user.username });
	if (preexisting_face) {
		throw new Meteor.Error(422, 'Username already exists.');
	}
	Faces.insert({ face_name: user.username, user_id: user._id });
	user.profile.current_face_name = user.username;
	user.profile.face_names= [user.username]
	return user
  });
});
