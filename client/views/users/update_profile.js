Template.updateProfile.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);
  this.usersCount = new ReactiveVar(0);

  this.autorun(() => {
    // Set subscriptions
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.usersCount.set(Counts.get('users.all'));

    // Get current user's social media accounts
    let currentUser = Meteor.users.findOne({_id: Meteor.userId()});

    // Display social media links
    if (currentUser && currentUser.socialMedia) {
      $('#socialMediaAccounts').empty();
      for (var prop in currentUser.socialMedia) {
        let smLink = '<a id="' + prop + '" class="smAccount" href="' + currentUser.socialMedia[prop] + '"><img src="/img/' + prop + '.svg"/></a>';
        $(smLink).appendTo('#socialMediaAccounts');
      }
    }
  });
});

Template.updateProfile.onRendered(function() {
  $('input[type=submit]').addClass('disabled');
  Session.set('startingBio', $('[data-id=biography]').val());
});

Template.updateProfile.events({
  'keyup [data-id=biography], keyup [data-id=addSocialMedia]': (event, template) => {
    // If bio section has changed or social media section has text enable the submit button, else disable it
    if (template.find('[data-id=biography]').value !== Session.get('startingBio') || 
    template.find('[data-id=addSocialMedia]').value.toString().trim() !== '') {
      $('input[type=submit]').removeClass('disabled');
    } else {
      $('input[type=submit]').addClass('disabled');
    }
  },

  'submit [data-id=update-profile-form]': (event, template) => {
    event.preventDefault();

    // Only continue if button isn't disabled
    if (!$('input[type=submit]').hasClass('disabled')) {
      let user = {
        biography: template.find('[data-id=biography]').value,
        socialMedia: { }
      };

      // Get current social media accounts for this user
      user.socialMedia = Meteor.users.findOne({_id: Meteor.userId()}).socialMedia || {}; 

      let bioChanged = false,
          numSmAdded = 0,
          numInvalidSm = 0;
      if (user.biography !== Session.get('startingBio')) {
        bioChanged = true;
      }

      // Add social media accounts if any were entered
      let newSocialMedia = template.find('[data-id=addSocialMedia]').value.toString().split(',');
      for (let x = 0; x < newSocialMedia.length; x++) {
        newSocialMedia[x] = newSocialMedia[x].trim();

        if (newSocialMedia[x] !== '') {
          if (newSocialMedia[x].indexOf('http://') === -1 && newSocialMedia[x].indexOf('https://') === -1) {
            newSocialMedia[x] = 'http://' + newSocialMedia[x];
          }

          if (newSocialMedia[x].toLowerCase().indexOf('facebook') !== -1) {
            user.socialMedia.facebook = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('twitter') !== -1) {
            user.socialMedia.twitter = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('linkedin') !== -1) {
            user.socialMedia.linkedin = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('instagram') !== -1) {
            user.socialMedia.instagram = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('plus.google') !== -1) {
            user.socialMedia.googlePlus = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('github') !== -1) {
            user.socialMedia.github = newSocialMedia[x];
            numSmAdded++;
          } else if (newSocialMedia[x].toLowerCase().indexOf('youtube') !== -1) {
            user.socialMedia.youtube = newSocialMedia[x];
            numSmAdded++;
          } else {
            numInvalidSm++;
          }
        }
      }

      if (bioChanged || numSmAdded > 0) {
        Meteor.call('users.updateProfile', user, (error, result) => {
          if (error) {
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          } else {
            if (numInvalidSm > 0) {
              Bert.alert('Profile updated but some social media links were invalid', 'success', 'growl-top-right');
            } else {
              Bert.alert('Profile successfully updated', 'success', 'growl-top-right');
            }

            template.find('[data-id=addSocialMedia]').value = '';
          }
        });
      } else {
        Bert.alert('Invalid social media links', 'danger', 'growl-top-right');
      }
    }
  }
});
