import { DataProvider } from './../../providers/data';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading';
import { ImageProvider } from '../../providers/image';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ImageModalPage } from '../image-modal/image-modal';

import { Camera } from '@ionic-native/camera';
import { Contacts } from '@ionic-native/contacts';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
  @ViewChild(Content) content: Content;
  //private userId: any;
  title: any;
  //private messages: any;
  private conversationId: any;
  //private updateDateTime: any;
  //private messagesToShow: any;
  //private startIndex: any = -1;
  // Set number of messages to show.
  //private numberOfMessages = 10;
  private loggedInUserId: any;
  //private userChat: any;
  //private classe: string;
  //private professore: any;
  myscool: any;

  private destinatario: any;

  private uidDocente: any;
  private uidGenitore: any;

  conversation: any = [];
  conversations: Observable<any>;
  offStatus: boolean = false;
  message: any;

  // MessagePage
  // This is the page where the user can chat with a friend.
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public angularfire: AngularFireDatabase,
    public loadingProvider: LoadingProvider, public alertCtrl: AlertController, public imageProvider: ImageProvider, public modalCtrl: ModalController,
    public camera: Camera, public keyboard: Keyboard, public actionSheet: ActionSheetController, public contacts: Contacts, public geolocation: Geolocation) { }

  ionViewDidLoad() {

    this.destinatario = this.navParams.get('itemDest');
    this.loggedInUserId = firebase.auth().currentUser.uid;
    this.myscool = this.navParams.get('classe');

    if (this.navParams.get('isProf')) { //chat con professore
      this.uidDocente = "DDD-" + this.destinatario.id;
      this.uidGenitore = this.loggedInUserId;
      this.title = this.destinatario.nome;
    }
    else { //chat con genitore
      this.uidDocente = this.loggedInUserId;
      this.uidGenitore = this.destinatario.id;
      this.title = this.destinatario.richiedente;
    }

    //this.userId = this.navParams.get('userId');
    //this.classe = this.navParams.get('classe');
    //this.professore = this.navParams.get('professore');
    // console.log("ionViewDidLoad classealunni:" + JSON.stringify(this.myscool));
    //this.classe = this.myscool.scuola.codice_scuola + '_' + this.myscool.indirizzo.id + '_' + this.myscool.sezione.id + '_' + this.myscool.classe.id;

    // console.log("classe:"+JSON.stringify(this.classe));
    //console.log("utente:"+JSON.stringify(this.userId));
    /* console.log("professore:"+JSON.stringify(this.professore));
    if (this.professore.name != undefined)
      this.title = this.userId.nome + "-" + this.professore.name;
    else
      this.title = this.userId.nome + "-" + this.professore.nome;


    if (this.userId.parents != null && this.userId.parents.length > 0) {
      if (this.userId.parents.length > 0) {
        //selezionare il contatto
        //  console.log("multiplo");
        this.userChat = this.userId.parents[0].$key;
        //this.userChat = this.userId.id;
      } else {
        //un solo contatto parte la chat
        //  console.log("singolo");
        this.userChat = this.userId.parents[0].$key;
        //this.userChat = this.userId.id;
      }


    } else {
      console.log("NESSUN CONTATTO PRESENTE");
    }
    if (firebase.auth().currentUser.uid.startsWith("DDD-")) {
      this.userChat = this.professore.$key;
    } else {
      this.userChat = "DDD-" + this.professore.id;
    }*/
    //console.log("userChat:"+JSON.stringify(this.userChat));
    // Get friend details.
    /*  this.dataProvider.getUser(this.userChat).snapshotChanges().subscribe((user) => {
        this.title = this.userId.nome + "-"+user.payload.val().name;
         // console.log("utente:"+JSON.stringify(user));
      });
      */
    // console.log("logged:"+JSON.stringify(this.loggedInUserId));

    /* Get conversationInfo with friend.
    this.angularfire.object('/accounts/' + this.loggedInUserId + '/conversations/' + this.classe + "/" + this.userId.id + "/" + this.userChat).snapshotChanges().subscribe((conversation) => {
      if (conversation.payload.exists()) {
        // User already have conversation with this friend, get conversation
        this.conversationId = conversation.payload.val().conversationId;

        // Get conversation
        this.dataProvider.getConversationMessages(this.conversationId).snapshotChanges().subscribe((messagesRes) => {

          let messages = messagesRes.payload.val();
          // console.log(messages);
          if (messages == null)
            messages = [];
          if (this.messages) {
            // Just append newly added messages to the bottom of the view.
            if (messages.length > this.messages.length) {
              let message = messages[messages.length - 1];

              this.dataProvider.getUser(message.sender).snapshotChanges().subscribe((user) => {
                //  console.log("img:"+JSON.stringify(user.payload.val().img));
                message.avatar = user.payload.val().img;
              });
              this.messages.push(message);
              this.messagesToShow.push(message);
            }
          } else {
            // Get all messages, this will be used as reference object for messagesToShow.
            this.messages = [];
            messages.forEach((message) => {
              this.dataProvider.getUser(message.sender).snapshotChanges().subscribe((user) => {
                message.avatar = user.payload.val().img;
              });
              this.messages.push(message);
            });
            // Load messages in relation to numOfMessages.
            if (this.startIndex == -1) {
              // Get initial index for numberOfMessages to show.
              if ((this.messages.length - this.numberOfMessages) > 0) {
                this.startIndex = this.messages.length - this.numberOfMessages;
              } else {
                this.startIndex = 0;
              }
            }
            if (!this.messagesToShow) {
              this.messagesToShow = [];
            }
            // Set messagesToShow
            for (var i = this.startIndex; i < this.messages.length; i++) {
              this.messagesToShow.push(this.messages[i]);
            }
            this.loadingProvider.hide();
          }
        });
      }
    });*/

    this.loadConversation();

    /* Update messages' date time elapsed every minute based on Moment.js.

    if (!this.updateDateTime) {
      this.updateDateTime = setInterval(function () {
        if (this.conversation) {
          this.conversation.forEach((message) => {
            let date = message.date;
            message.date = new Date(date);
          });
        }
      }, 60000);
    }*/
  }

  loadConversation() {
    this.conversations = this.dataProvider.getChatRoom(this.myscool.scuola.codice_scuola, this.myscool.classe.id, this.uidDocente, this.uidGenitore).valueChanges();
    this.conversations.subscribe(() => setTimeout(() => { 
      if(this.content._scroll) this.content.scrollToBottom(300); 
    }, 500));
  }


  /*
  ionViewDidEnter() {
    this.scrollBottom();
  }
  // Load previous messages in relation to numberOfMessages.
  loadPreviousMessages() {
    var that = this;
    // Show loading.
    this.loadingProvider.show();
    setTimeout(function () {
      // Set startIndex to load more messages.
      if ((that.startIndex - that.numberOfMessages) > -1) {
        that.startIndex -= that.numberOfMessages;
      } else {
        that.startIndex = 0;
      }
      // Refresh our messages list.
      that.messages = null;
      that.messagesToShow = null;

      that.scrollTop();

      // Populate list again.
      that.ionViewDidLoad();
    }, 1000);
  }
*/
  /* Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    this.setMessagesRead();
  }

   Check if currentPage is active, then update user's messagesRead.
  setMessagesRead() {
    firebase.database().ref('/conversations/' + this.conversationId + '/messages').once('value', snap => {
      // console.log(snap.val());
      if (snap.val() != null) {
        this.angularfire.object('/accounts/' + this.loggedInUserId + '/conversations/' + this.classe + "/" + this.userId.id + "/" + this.userChat).update({
          messagesRead: snap.val().length
        });
      }
    });
  }*/




  /* Scroll to bottom of page after a short delay.
  scrollBottom() {
    var that = this;
    setTimeout(function () {
      that.content.scrollToBottom();
    }, 300);
    this.setMessagesRead();
  }

  // Scroll to top of the page after a short delay.
  scrollTop() {
    var that = this;
    setTimeout(function () {
      that.content.scrollToTop();
    }, 300);
  }*/




  // Check if the user is the sender of the message.
  isSender(message) {
    if (message.sender == this.loggedInUserId) {
      return true;
    } else {
      return false;
    }
  }

  sendMessage(type) {
    let newData = this.dataProvider.getChatRoomRef(this.myscool.scuola.codice_scuola, this.myscool.classe.id, this.uidDocente, this.uidGenitore).push();
    newData.set({
      type: type,
      sender: this.loggedInUserId,
      message: this.message,
      sendDate: Date()
    });
    this.message = '';
  }

  /* Send message, if there's no conversation yet, create a new conversation.
  send(type) {
    if (this.message) {
      // console.log("send classealunni:" + JSON.stringify(this.myscool));
      // User entered a text on messagebox
      if (this.conversationId) {
        let messages = JSON.parse(JSON.stringify(this.messages));
        messages.push({
          date: new Date().toString(),
          sender: this.loggedInUserId,
          type: type,
          message: this.message
        });

        // Update conversation on database.
        this.dataProvider.getConversation(this.conversationId).update({
          messages: messages
        });
        // Clear messagebox.
        this.message = '';
        this.scrollBottom();
      } else {
        //console.log("else");
        // console.log("send else classealunni:" + JSON.stringify(this.myscool));
        // New Conversation with friend.
        var messages = [];
        messages.push({
          date: new Date().toString(),
          sender: this.loggedInUserId,
          type: type,
          message: this.message
        });
        var users = [];
        users.push(this.loggedInUserId);
        users.push(this.userChat);
        // Add conversation.
        this.angularfire.list('conversations').push({
          dateCreated: new Date().toString(),
          messages: messages,
          users: users
        }).then((success) => {
          let conversationId = success.key;
          this.message = '';
          // Add conversation reference to the users.
          this.angularfire.object('/accounts/' + this.loggedInUserId + '/conversations/' + this.classe + "/" + this.userId.id + "/" + this.userChat).update({
            conversationId: conversationId,
            messagesRead: 1
          });
          this.angularfire.object('/accounts/' + this.userChat + '/conversations/' + this.classe + "/" + this.userId.id + "/" + this.loggedInUserId).update({
            conversationId: conversationId,
            messagesRead: 0
          });
        });
        // console.log("send 2 classealunni:" + JSON.stringify(this.myscool));
        this.scrollBottom();
      }
    }
  }*/

  viewUser(userId) {
    // this.navCtrl.push("UserInfoPage", { userId: userId.$key });
  }


  attach() {
    let action = this.actionSheet.create({
      title: 'Choose attachments',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.CAMERA).then((url) => {
            this.message = url;
            this.sendMessage("image");
          });
        }
      }, {
        text: 'Photo Library',
        handler: () => {
          this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
            this.message = url;
            this.sendMessage("image");
          });
        }
      },
      {
        text: 'Video',
        handler: () => {
          this.imageProvider.uploadVideoMessage(this.conversationId).then(url => {
            this.message = url;
            this.sendMessage("video");
          });
        }
      }
        , {
        text: 'Location',
        handler: () => {
          this.geolocation.getCurrentPosition({
            timeout: 5000
          }).then(res => {
            let locationMessage = "Location:<br> lat:" + res.coords.latitude + "<br> lng:" + res.coords.longitude;
            let mapUrl = "<a href='https://www.google.com/maps/search/" + res.coords.latitude + "," + res.coords.longitude + "'>View on Map</a>";

            let confirm = this.alertCtrl.create({
              title: 'Your Location',
              message: locationMessage,
              buttons: [{
                text: 'cancel',
                handler: () => {
                  console.log("canceled");
                }
              }, {
                text: 'Share',
                handler: () => {
                  this.message = locationMessage + "<br>" + mapUrl;
                  this.sendMessage("location");
                }
              }]
            });
            confirm.present();
          }, locationErr => {
            console.log("Location Error" + JSON.stringify(locationErr));
          });
        }
      }, {
        text: 'Contact',
        handler: () => {
          this.contacts.pickContact().then(data => {
            let name;
            if (data.displayName !== null) name = data.displayName;
            else name = data.name.givenName + " " + data.name.familyName;
            this.message = "<b>Name:</b> " + name + "<br><b>Mobile:</b> <a href='tel:" + data.phoneNumbers[0].value + "'>" + data.phoneNumbers[0].value + "</a>";
            this.sendMessage("contact");
          }, err => {
            console.log(err);
          })
        }
      }, {
        text: 'cancel',
        role: 'cancel',
        handler: () => {
          console.log("cancelled");
        }
      }]
    });
    action.present();
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
