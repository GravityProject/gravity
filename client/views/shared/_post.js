Template.post.events({
  'click [data-id=remove-post]': function (event, template) {
    let self = this;
      
    //Sweet Alert delete confirmation
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
  author: function () {
    return Meteor.users.findOne({ _id: this.authorId });
  },

  belongsPostToUser: function () {
    return this.authorId === Meteor.userId();
  }
});
