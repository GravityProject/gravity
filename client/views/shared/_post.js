Template.post.events({
  'click [data-id=remove-post]': function(event, template) {
    let self = this;

    // Sweet Alert delete confirmation
    swal({
      title: 'Delete post?',
      text: 'Are you sure that you want to delete this post?',
      type: 'error',
      showCancelButton: true,
      closeOnConfirm: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#da5347'
    }, function() {
      Meteor.call('posts.remove', self._id, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Post successfully removed', 'success', 'growl-top-right');
        }
      });
    });
  }
});

Template.post.helpers({
  author: function() {
    return Meteor.users.findOne({ _id: this.authorId });
  },

  belongsPostToUser: function() {
    return this.authorId === Meteor.userId();
  },
  formatDate: function(date) {
    let currDate = moment(new Date()),
        msgDate = moment(new Date(date));

    let diff = currDate.diff(msgDate, 'days');

    if (diff === 0 && currDate.day() === msgDate.day()) {
      let hourDiff = currDate.diff(msgDate, 'hours'),
          minDiff = currDate.diff(msgDate, 'minutes');
      if (hourDiff > 0) {
        if (hourDiff === 1) {
          return (hourDiff + ' hr');
        } else {
          return (hourDiff + ' hrs');
        }
      } else if (minDiff > 0) {
        if (minDiff === 1) {
          return (minDiff + ' min');
        } else {
          return (minDiff + ' mins');
        }
      } else {
        return 'Just now';
      }
    } else if (diff <= 1 && currDate.day() !== msgDate.day()) {
      return ('Yesterday at ' + moment(date).format('h:mm a'));
    } else {
      if (currDate.year() !== msgDate.year()) {
        return moment(date).format('MMMM DD, YYYY');
      } else {
        return (moment(date).format('MMMM DD') + ' at ' + moment(date).format('h:mm a'));
      }
    }
  }
});
