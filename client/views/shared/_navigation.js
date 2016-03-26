/* On navigation template created */
Template.navigation.onCreated(function() {
  this.autorun(() => {
    // Set subscriptions
    this.subscribe('messages.all');
  });
});

Template.navigation.helpers({
  activeIfRouteNameIs: (routeName) => {
    if (FlowRouter.getRouteName() === routeName) {
      return 'active';
    }
    return '';
  },
  getUnreadCount: () => {
    let unreadMessageCount = 0;
    let messages = Messages.find({$or: [{ originatingFromId: Meteor.userId(), 'conversation.originatingFromDeleted': false }, {originatingToId: Meteor.userId(), 'conversation.originatingToDeleted': false}]}).forEach(function(msg) {
      for (let x = 0; x < msg.conversation.length; x++) {
        if (msg.conversation[x].to.userId === Meteor.userId() && !msg.conversation[x].to.read) {
          unreadMessageCount++;
        }
      }
    });

    if (unreadMessageCount > 0) {
      return ('(' + unreadMessageCount + ')');
    } else {
      return '';
    }
  }
});
