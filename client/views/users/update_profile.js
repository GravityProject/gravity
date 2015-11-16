Template.updateProfile.onCreated(function() {
  this.autorun(() => {
    this.subscribe('faces');
  });	
});
Template.updateProfile.helpers({
  user: () => {
	return Meteor.user();
    return Meteor.users.findOne({ _id: FlowRouter.getParam('_id') });
  },
  initial: ()=> {
    let user = Meteor.user() || {}
	let profile = user.profile || {}
	let currentFaceName = profile.currentFaceName;
	if (!currentFaceName) {
		return '?'
	}
	return currentFaceName.charAt(0);
  },
  posts: function () {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },

  faces: function () {
	 let fx = Faces.find().fetch();
	 let u = Meteor.user() || { profile: { currentFaceName: null }};
	 let selected = u.profile.currentFaceName;
	 return Faces.find({ userId: Meteor.userId() }).map(function(face) {
		 if (face.faceName == selected) {
			 face.selectOption = 'selected';
		 } else {
			 face.selectOption = '';
		 }
		 return face;
	 })
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
  },
  'click button#add_face': (event, template) => {
    event.preventDefault();
	let faceInput = template.find('input#faceInput').value;
	if (faceInput.length < 4) {
		Bert.alert('Face Names must exceed 4 characters', 'warning', 'growl-top-right');
		return
    }	
	Meteor.call('users.addNewFace', faceInput, (error, result) => {
		if (error) {
			Bert.alert(error.reason, 'danger', 'growl-top-right');
		} else {
			Bert.alert('Face name: '+ faceInput + ' added.', 'success', 'growl-top-right');
		}
	});
	return
  },
  'change #face_selector': (event, template) => {
	  event.preventDefault();
	  let change_face_to = event.target.value;
	  if (change_face_to) {
		Meteor.call('users.setCurrentFace', change_face_to, (error, result) => {
		  if (error) {
		    Bert.alert(error.reason, 'danger', 'growl-top-right');
		  } else {
			Bert.alert('Current face set to: ' + change_face_to + '.', 'info', 'growl-top-right');
		  }
		});
	  }
	  return
  }
});
