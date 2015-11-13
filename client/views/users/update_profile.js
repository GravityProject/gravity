Template.updateProfile.events({
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
