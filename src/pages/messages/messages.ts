import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { MessagePage } from '../message/message';
import * as firebase from 'firebase';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  private conversations: any;
  private updateDateTime: any;
  public searchFriend: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularfire: AngularFireDatabase, public loadingProvider: LoadingProvider,
              public app: App, public dataProvider: DataProvider) { }

  ionViewDidLoad() {
    this.loadingProvider.show();

    // Get info of conversations of current logged in user.
    this.dataProvider.getConversations().snapshotChanges().subscribe((conversationsInfoRes) => {
      
      let conversations = [];
      conversations = conversationsInfoRes.map(c => ({ key: c.key, ...c.payload.val()}));
      
      console.log(conversations);

      if (conversations.length > 0) {
        conversations.forEach((conversation) => {
          console.log(conversation);
          if (conversation) {
            // Get conversation partner info.
            this.dataProvider.getUser(conversation.key).snapshotChanges().subscribe((user) => {
              conversation.friend = user.payload.val();
              // Get conversation info.
              
              this.dataProvider.getConversation(conversation.conversationId).snapshotChanges().subscribe((obj) => {
                // Get last message of conversation.
                console.log(obj.payload.val());
                if(obj.payload.val() != null){
                  let lastMessage = obj.payload.val().messages[obj.payload.val().messages.length - 1];
                  conversation.date = lastMessage.date;
                  conversation.sender = lastMessage.sender;
                  // Set unreadMessagesCount
                  conversation.unreadMessagesCount = obj.payload.val().messages.length - conversation.messagesRead;
                  console.log(obj.payload.val().messages.length +"-"+conversation.messagesRead);
                  console.log(conversation.unreadMessagesCount);
                  // Process last message depending on messageType.
                  if (lastMessage.type == 'text') {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You: ' + lastMessage.message;
                    } else {
                      conversation.message = lastMessage.message;
                    }
                  } else {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You sent a photo message.';
                    } else {
                      conversation.message = 'has sent you a photo message.';
                    }
                  }
                  // Add or update conversation.
                  this.addOrUpdateConversation(conversation);
                }
              });
            });
          }
          
        });
        
        this.loadingProvider.hide();
      }
      else {
        this.conversations = [];
        this.loadingProvider.hide();
      }
    });

    // Update conversations' last active date time elapsed every minute based on Moment.js.
    var that = this;
    if (!that.updateDateTime) {
      that.updateDateTime = setInterval(function() {
        if (that.conversations) {
          that.conversations.forEach((conversation) => {
            let date = conversation.date;
            conversation.date = new Date(date);
          });
        }
      }, 60000);
    }
  }

  // Add or update conversation for real-time sync based on our observer, sort by active date.
  addOrUpdateConversation(conversation) {
    if (!this.conversations) {
      this.conversations = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversations.length; i++) {
        if (this.conversations[i].key == conversation.key) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversations[index] = conversation;
      } else {
        this.conversations.push(conversation);
      }
      // Sort by last active date.
      this.conversations.sort((a: any, b: any) => {
        let date1 = new Date(a.date);
        let date2 = new Date(b.date);
        if (date1 > date2) {
          return -1;
        } else if (date1 < date2) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  // Open chat with friend.
  message(userId) {
    this.app.getRootNav().push(MessagePage, { userId: userId });
  }

  // Return class based if conversation has unreadMessages or not.
  hasUnreadMessages(conversation) {
    if (conversation.unreadMessagesCount > 0) {
      return 'bold';
    } else
      return '';
  }
}
