Template.updateProfile.onCreated(function() {
  this.autorun(() => {
    this.subscribe('faces');
  });	
});
Template.updateProfile.helpers({
  user: () => {
    return Meteor.users.findOne({ _id: FlowRouter.getParam('_id') });
  },

  posts: function () {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  faces: function () {
	 var fx = Faces.find().fetch();
	 console.log('fx', fx);
	 var f = Faces.find({ user_id: Meteor.userId() }).fetch();
	 console.log('f', f);
	 return f
  }
});


Template.updateProfile.events({
  'submit [data-id=create-new-face-name]': (event, template) => {
    event.preventDefault();

    let user = {
      biography: template.find('[data-id=biography]').value
    };

    Meteor.call('users.updateProfile', user, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Profile successfully updated', 'success', 'growl-top-right');
      }
    });
  }
  'submit [data-id=update-profile-form]': (event, template) => {
    event.preventDefault();

    let user = {
      biography: template.find('[data-id=biography]').value
    };

    Meteor.call('users.updateProfile', user, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Profile successfully updated', 'success', 'growl-top-right');
      }
    });
  }
});
