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
	let preexistingFace = Faces.findOne({faceName : user.username });
	if (preexistingFace) {
		throw new Meteor.Error(422, 'Username already exists.');
	}
	Faces.insert({ faceName : user.username, userId: user._id });
	user.profile.currentFaceName = user.username;
	user.profile.faceName = [user.username]
	return user
  });
});
