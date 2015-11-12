Meteor.methods({
  'users.updateProfile': (user) => {
    check(user, {
      biography: String
    });

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { biography: user.biography } } )
  }
});
