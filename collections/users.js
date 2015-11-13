Meteor.methods({
  'users.updateProfile': (user) => {
    check(user, {
      biography: String
    });

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { biography: user.biography } } )
  }
});
