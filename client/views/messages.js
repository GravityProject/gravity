/* Function to check if view passed in is the current view */
function isCurrentView(v) {
  if(Session.get('currentView') === v) {
     return true;
  } else {
    return false;
  }
}

/* Function to get the userId of the other user (not current user) */
function getOtherUserId(fromId, toId) {
  if(fromId === Meteor.userId())
  {
    return toId;
  } else {
    return fromId;
  }  
}

/* Function to get the username of the other user (not current user) */
function getOtherUsername(fromName, toName) {
  if(fromName === Meteor.user().username)
  {
    Session.set('originating', 'from');
    return toName;
  } else {
    Session.set('originating', 'to');
    return fromName;
  } 
}

/* Function to format the passed in date */
function performFormatting(date) {
  let currDate = moment(new Date()),
      msgDate = moment(new Date(date));
      
  let diff = currDate.diff(msgDate, 'days');

  if(diff === 0 && currDate.day() === msgDate.day()) {
    return moment(date).format('h:mm a');
  } else if(diff < 7 && currDate.day() !== msgDate.day()) {
    return moment(date).format('dddd');
  } else {
    if(currDate.year() != msgDate.year()) {
      return moment(date).format('MM/DD/YY');
    } else {
      return moment(date).format('MMM DD');   
    }
  }
}

/* Helper function available to all templates that calls getOtherUsername */
Template.registerHelper('getOtherUsername', function(fromName, toName) {
  return getOtherUsername(fromName, toName);
});

/* On messages template created */
Template.messages.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);
  this.usersCount = new ReactiveVar(0);
    
  this.autorun(() => {
    //Set subscriptions 
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.usersCount.set(Counts.get('users.all'));
    this.subscribe('messages.all');
      
    //Set session variables 
    Session.set('currentView', 'allMessages');
    Session.set('selectedMsg', '');
    Session.set('originating', '');
    $('#allMessagesButton').addClass('active');
  });
});

/* messages template helpers */
Template.messages.helpers({
  showAllMessages: () => {
    return isCurrentView('allMessages');
  },
  showSingleMessage: () => {
    return isCurrentView('singleMessage');
  },
  showCompose: () => {
    return isCurrentView('compose');
  }
});

/* messages template events */
Template.messages.events({
  'click #allMessagesButton, click #composeButton': (event, template) => {
    //Set template based on button that was clicked 
    $('button').removeClass('active');
    $('#' + event.target.id).addClass('active');
    Session.set('currentView', event.target.id.toString().replace('Button', ''));
  }
});

/* allMessages helpers */
Template.allMessages.helpers({
  getAllMessages: () => {
    //Find all messages that current user is involved in
    return Messages.find({$or: [{ 'originatingFromId': Meteor.userId(), 'conversation.originatingFromDeleted': false }, {'originatingToId': Meteor.userId(), 'conversation.originatingToDeleted': false}]}, {sort: {'conversation.sentOn': -1} });
  },
  messagesEmpty: () => {
    //Check if current user has any messages 
    if(Messages.find({$or: [{ 'originatingFromId': Meteor.userId(), 'conversation.originatingFromDeleted': false }, {'originatingToId': Meteor.userId(), 'conversation.originatingToDeleted': false}]}).count() === 0) {
      return true;
    } else {
      return false;
    }
  },
  formatDate: (conversation) => {
    if(conversation.length > 0)
    {
      let date = conversation[conversation.length - 1].sentOn;
        
      return performFormatting(date);
    }
  },
  getMostRecentBody: (conversation) => {
    if(conversation.length > 0) {
      return conversation[conversation.length - 1].body;
    }
  },
  getMostRecentRead: (conversation) => {
    //Determine if message has been read 
    if(conversation.length > 0) {
      if(conversation[conversation.length - 1].to.userId === Meteor.userId()) {
        if(!conversation[conversation.length - 1].to.read) {
          return 'notRead';
        }
      }
    }
    
    return '';
  }
});

/* allMessages template events */
Template.allMessages.events({
  'click .msg': (event, template) => {
    //Make sure selected message exists
    let selectedMsg = Messages.findOne({_id: event.currentTarget.id});
    if(selectedMsg) {
      if(selectedMsg.conversation[selectedMsg.conversation.length - 1].to.userId === Meteor.userId()) {
        //Check if most recent message is TO the current user
        if(!selectedMsg.conversation[selectedMsg.conversation.length - 1].to.read) {
          //Update read field to true
          Meteor.call('messages.updateRead', selectedMsg._id, true, (error, result) => {
            //Do nothing 
          });
        }
        
      }
    }
     
    //Set current view to singleMssage template 
    $('button').removeClass('active');
    Session.set('selectedMsg', event.currentTarget.id);
    Session.set('currentView', 'singleMessage');
  },
  'click .remove-message': (event, template) => {
    event.stopPropagation();
    
    //Sweet Alert delete confirmation
    swal({
      title: 'Delete message?',
      text: 'Are you sure that you want to delete this message?',
      type: 'error',
      showCancelButton: true,
      closeOnConfirm: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#da5347'
    }, function() {
      //Get the id of the message to be deleted 
      let msgId = event.currentTarget.parentNode.parentNode.id;
      
      //Make sure message exists 
      let msg = Messages.findOne({ '_id': msgId } );
      let whoDeleted;
    
      //If message exists 
      if(msg) {
        //Set deleted correctly 
        if(msg.originatingFromId === Meteor.userId()) {
          whoDeleted = 'from';
        } else {
          whoDeleted = 'to';
        }
    
        //Remove selected message 
        Meteor.call('messages.remove', msgId, whoDeleted, (error, result) => {
          if(error) {
            Bert.alert('Message couldn\'t be deleted.', 'danger', 'growl-top-right');
          } else {
            Bert.alert('Message deleted', 'success', 'growl-top-right');
          }
        });
      } else {
        Bert.alert('Message couldn\'t be deleted.', 'danger', 'growl-top-right');
      }   
    });
  }
});

/* singleMessage template on rendered */
Template.singleMessage.onRendered(function() {
  //Move to bottom of div so most recent message is shown 
  $('#singleMessageArea').scrollTop($('#singleMessageArea')[0].scrollHeight);
  
  //Set focus to the reply body text area 
  $('[data-id=reply-body]').focus();  
    
  //Set submit button to disabled since text field is empty 
  $('[data-id=reply-submit]').addClass('disabled');
});

/* singleMessage template helpers */
Template.singleMessage.helpers({
  getSingleMessage: () => {
    return Messages.findOne({ '_id': Session.get('selectedMsg') } );
  },
  showMessage: (originatingFromDeleted, originatingToDeleted) => {
    //Don't show messages that have been previously deleted 
    if(Session.equals('originating', 'from')) {
      return !originatingFromDeleted;
    } else {
      return !originatingToDeleted;
    }
  },
  fromOtherUser: (from, to) => {
    if(from.userId !== Meteor.userId()) {
      return true;
    } else {
      return false; 
    }
  },
  formatDate: (date) => {
    return performFormatting(date);
  }
});

/* singleMessage template events */
Template.singleMessage.events({
  'keyup [data-id=reply-body]': (event, template) => {
    //If reply section has text enable the submit button, else disable it
    if(template.find('[data-id=reply-body]').value.toString().trim() !== '') {
      $('[data-id=reply-submit]').removeClass('disabled');
    } else {
      $('[data-id=reply-submit]').addClass('disabled');
    }
  },
  'submit [data-id=reply-message-form]': (event, template) => {
    event.preventDefault();
       
    //Only continue if button isn't disabled
    if(!$('[data-id=reply-submit]').hasClass('disabled')) {
      let body = template.find('[data-id=reply-body]').value,
          currMessage = Messages.findOne({_id: Session.get('selectedMsg')}),
          toUserId = getOtherUserId(currMessage.originatingFromId, currMessage.originatingToId),
          fieldEmpty = false;
        
      //Make sure fields arent empty
      if(!body.toString().trim()) {
        fieldEmpty = true;
        Bert.alert('Please enter a message.', 'danger', 'growl-top-right');
      }
      if(!fieldEmpty && !toUserId) {
        fieldEmpty = true;
        Bert.alert('Error sending message.', 'danger', 'growl-top-right');
      }
       
      //Continue if the fields aren't empty 
      if(!fieldEmpty) {
        //Add reply to the conversation array of the existing message 
        Meteor.call('messages.addMessage', Session.get('selectedMsg'), toUserId, body, (error, result) => {
          if(error) {
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          } else {
            //Display success message and reset form values 
            Bert.alert('Message sent', 'success', 'growl-top-right');
            template.find('[data-id=reply-body]').value = '';
              
            //Scroll to bottom of message area, set focus back to reply text area, and disable submit button 
            $('#singleMessageArea').scrollTop($('#singleMessageArea')[0].scrollHeight);
            $('[data-id=reply-body]').focus();  
            $('[data-id=reply-submit]').addClass('disabled');
          }
        }); 
      }
    }
  } 
});

/* compose template on rendered */
Template.compose.onRendered(function() {
  //Set focus to the to text area 
  $('[data-id=message-to]').focus(); 
    
  //Set submit button to disabled since text fields are empty 
  $('[data-id=message-submit]').addClass('disabled');
});

/* compose template helpers */
Template.compose.helpers({
  //Settings for autocomplete To field 
  settings: () => {
    return {
      position: 'bottom',
      limit: 5,
      rules: [
        {
          collection: Meteor.users,
          field: 'username',
          template: Template.userList,
          filter: { _id: { $ne: Meteor.userId() }}
        }
      ]
    };
  }
});

/* compose template events */
Template.compose.events({
  'keyup [data-id=message-to], keyup [data-id=message-body]': (event, template) => {
    //If to and body sections have text enable the submit button, else disable it
    if(template.find('[data-id=message-to]').value.toString().trim() !== '' && 
    template.find('[data-id=message-body]').value.toString().trim() !== '') {
      $('[data-id=message-submit]').removeClass('disabled');
    } else {
      $('[data-id=message-submit]').addClass('disabled');
    }
  },
    
  'submit [data-id=send-message-form]': (event, template) => {
    event.preventDefault(); 
    
    //Only continue if button isn't disabled
    if(!$('[data-id=message-submit]').hasClass('disabled')) {
      //Get text from To and Body fields
      let to = template.find('[data-id=message-to]').value.toString().trim(),
          body = template.find('[data-id=message-body]').value,
          fieldEmpty = false;
      
      //Verify that both fields contain text
      if(!to) {
        fieldEmpty = true; 
        Bert.alert('Please enter a username in the To field.', 'danger', 'growl-top-right'); 
      }
      if(!fieldEmpty && !body.toString().trim()) {
        fieldEmpty = true; 
        Bert.alert('Please enter a message.', 'danger', 'growl-top-right'); 
      }
    
      //Continue if the fields aren't empty 
      if(!fieldEmpty) {
        //Try to find user in Users collection
        let toUser = Meteor.users.findOne({username: to});
    
        //If user was found then it is a valid user 
        if(toUser) {
          //If user is not the current user then send the message 
          if(toUser._id != Meteor.userId())
          {
            //If message between these two users already exists, add this message to the current conversation, else create a new message 
            let existingMessage = Messages.findOne({$or: [{'originatingFromId': Meteor.userId()}, {'originatingToId': Meteor.userId()}], $or: [{'originatingFromId': toUser._id}, {'originatingToId': toUser._id}]});
            
            if(existingMessage) {
              //Add message to existing conversation 
              Meteor.call('messages.addMessage', existingMessage._id, toUser._id, body, (error, result) => {
                if(error) {
                  Bert.alert(error.reason, 'danger', 'growl-top-right');
                } else {
                  //Display success message and reset form values 
                  Bert.alert('Message sent', 'success', 'growl-top-right');
                  template.find('[data-id=message-to]').value = '';
                  template.find('[data-id=message-body]').value = '';
              
                  //Switch the to allMessages view 
                  $('button').removeClass('active');
                  $('#allMessagesButton').addClass('active');
                  Session.set('currentView', 'allMessages');
                }
              });
            } else {
              //Create new message 
              Meteor.call('messages.insert', toUser._id, toUser.username, body, (error, result) => {
                if(error) {                
                  Bert.alert(error.reason, 'danger', 'growl-top-right');
                } else {
                  //Display success message and reset form values 
                  Bert.alert('Message sent', 'success', 'growl-top-right');
                
                  //Switch the to allMessages view 
                  $('button').removeClass('active');
                  $('#allMessagesButton').addClass('active');
                  Session.set('currentView', 'allMessages');
                }
              });
            }
          } else {
            //Can't send a message to yourself, display error
            Bert.alert('Sorry, you can only send messages to other users.', 'danger', 'growl-top-right');
          }
        } else {
          //Wasn't a valid user, display error
          Bert.alert('Sorry, we can\'t find that user.  Please verify the username and try again.', 'danger', 'growl-top-right');
        }  
      }
    }  
  }
});

