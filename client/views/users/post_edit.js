Template.postEdit.onCreated(function() {
  var self = this;
  self.postSubReady = new ReactiveVar();
  self.autorun(function() {
    var postId = FlowRouter.getParam('postId');
    var subHandle = self.subscribe('singlePost', postId);
    self.postSubReady.set(subHandle.ready());
  });
});

Template.postEdit.helpers({
  authInProcess: function() {
    var postSubReady = Template.instance().postSubReady.get();
    return Meteor.loggingIn() || !postSubReady;
  },
  
  canShow: function() {
    var user = Meteor.user();
    if(!user) {
      return false;
    }

    var postId = FlowRouter.getParam('postId');
    var post = Posts.findOne({_id: postId});
    if(!post) {
      return false;
    }
    return post.authorId === user._id;
  },
  
  postBody: function() {
    var postId = FlowRouter.getParam('postId');
    return Posts.findOne({_id: postId}).body;
  }
});

Template.postEdit.events({
  'submit [data-id=edit-post-form]': (event, template) => {
    event.preventDefault();

     Meteor.call('posts.edit', FlowRouter.getParam('postId'), template.find('[data-id=post-body]').value, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Post successfully editet', 'success', 'growl-top-right');
        FlowRouter.go("/");
      }
    });
  }
});