Meteor.methods({
  'users.updateProfile': (user) => {
    check(user, {
      biography: String,
      socialMedia: Object
    });

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { biography: user.biography, socialMedia: user.socialMedia } } );
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
