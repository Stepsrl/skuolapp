import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, App, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { FirebaseProvider } from '../../providers/firebase';
import * as firebase from "firebase";

import { SocialSharing } from '@ionic-native/social-sharing';
import { MessagePage } from "../message/message";
import { Observable } from 'rxjs';

/**
 * Generated class for the GenitoriPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
    selector: 'page-genitori',
    templateUrl: 'genitori.html',
})
export class GenitoriPage {
    @ViewChild(Content) content: Content;
    myscool: any;
    //private alunno: any;
    myCodice: string;
    friends: any;
    friendRequests: Observable<any>;
    searchFriend: any;
    tab: any;
    title: any;
    requestsSents: Observable<any>;
    friendRequestCount = 0;

    private alert: any;
    private account: any;

    accounts: any = [];
    excludedIds: any = [];
    searchUser: any;

    private codice: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public dataProvider: DataProvider,
        public loadingProvider: LoadingProvider, private socialSharing: SocialSharing, public alertProvider: AlertProvider,
        public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider) {


        this.myCodice = this.reverseString(firebase.auth().currentUser.uid);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GenitoriPage');
        this.tab = "friends";
        this.title = "Friends";
        this.content.resize();
        this.myscool = this.navParams.data.scuola;
        // this.alunno = this.navParams.data.alunno;
        //     console.log("Scuola:"+JSON.stringify(this.myscool));
        /*
         console.log("classe:"+JSON.stringify(this.myscool));
         console.log("alunno:"+JSON.stringify(this.alunno));
         console.log ("scuola cod:"+this.myscool.codice_scuola);
         console.log ("scuola indi:"+this.myscool.indirizzo.id);
         console.log ("scuola sez:"+this.myscool.sezione.id);
         console.log ("scuola classe:"+this.myscool.classe.id);
 
         console.log ("scuola alunno:"+this.alunno.id);
         */
        //      this.codice = this.myscool.codice_scuola + '_'+this.myscool.indirizzo.id+'_'+this.myscool.sezione.id+'_'+this.myscool.classe.id+'_'+this.alunno.id;
        if (firebase.auth().currentUser.uid.startsWith("DDD-")) {
            this.codice = this.myscool.scuola.codice_scuola + '_' + this.myscool.indirizzo.id + '_' + this.myscool.sezione.id + '_' + this.myscool.classe.id;
        } else {
            this.codice = firebase.auth().currentUser.uid;
        }

        //  console.log("codice:"+this.codice);
        this.searchFriend = '';
        //this.dataProvider.getRequests(firebase.auth().currentUser.uid).snapshotChanges().subscribe((requestsRes) => {
        /* this.dataProvider.getRequests(this.codice).snapshotChanges().subscribe((requestsRes) => {
             //console.log("REQ:"+JSON.stringify(requestsRes));
             if (requestsRes != null && requestsRes != undefined) {
                 let requests = requestsRes.payload.val();
                //  console.log("REQ:"+JSON.stringify(requests));
                 if (requests != null) {
                     if (requests.friendRequests != null && requests.friendRequests != undefined)
                         this.friendRequestCount = requests.friendRequests.length;
                     else this.friendRequestCount = 0
                 }
                 else this.friendRequestCount = 0;
                 //console.log("friends:" + this.friendRequestCount);
             } else {
                 this.friendRequestCount = 0;
             }
         });*/
        this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges().subscribe((requestsRes) => {
            if (requestsRes)
                this.friendRequestCount = requestsRes.length;
            else
                this.friendRequestCount = 0;
        });

        this.getFriendsNew();
    }

    ionViewWillEnter() {
        this.content.resize();
        this.myscool = this.navParams.data.scuola;


        // console.log("classe:"+JSON.stringify(this.myscool));
    }


    segmentChanged($event) {
        if (this.tab == 'friends') {
            this.title = "Friends";
            //this.getFriends();
            this.getFriendsNew();
        }
        else if (this.tab == 'requests') {
            this.title = "Friend Requests";
            //this.getFriendRequests();
            this.getFriendSchool();

        }
        else if (this.tab == 'search') {
            this.title = "Find New Friends";
            this.findNewFriends();
        }
    }

    getFriends() {
        this.loadingProvider.show();
        this.friends = [];
        // Get user data on
        // database and get list of friends.
        // this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {
        this.dataProvider.getUser(this.codice).snapshotChanges().subscribe((account) => {

            //     this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
            //console.log(this.codice+"--"+JSON.stringify(account));
            if (account.payload.val() != null && account.payload.val().friends != null) {
                for (var i = 0; i < account.payload.val().friends.length; i++) {
                    //  console.log("acc:"+account.payload.val().friends[i]);
                    this.dataProvider.getUser(account.payload.val().friends[i].user).snapshotChanges().subscribe((friend) => {
                        // console.log(this.codice+"--"+JSON.stringify(friend));
                        if (friend.key != null) {
                            let friendData = { $key: friend.key, ...friend.payload.val() };
                            this.addOrUpdateFriend(friendData);
                        }
                    });
                }
            } else {
                this.friends = [];
            }
            this.loadingProvider.hide();
        });
    }
    // Add or update friend data for real-time sync.
    addOrUpdateFriend(friend) {
        // console.log("update:"+JSON.stringify(friend))
        if (!this.friends) {
            this.friends = [friend];
        } else {
            var index = -1;
            for (var i = 0; i < this.friends.length; i++) {
                if (this.friends[i].$key == friend.$key) {
                    index = i;
                }
            }
            if (index > -1) {
                this.friends[index] = friend;
            } else {
                this.friends.push(friend);
            }
        }
        // console.log(this.friends);
    }
    /*
        getFriendSchool() {
            this.friendRequests = [];
            this.requestsSent = [];
    
            this.loadingProvider.show();
            // Get user info
            //console.log("friends:"+this.friendRequestCount);
           // this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {
                //  this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
                //if(account != null) {
                  //  this.account = account.payload.val();
                    if(this.codice != null) {
                        //console.log(this.codice);
                        // Get friendRequests and requestsSent of the user.
     //-->this.dataProvider.getRequests(this.codice).snapshotChanges().subscribe((requestsRes) => {
                        this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges().subscribe((requestsRes) => {
                            // friendRequests.
                           // console.log("friends req:"+JSON.stringify(requestsRes));
                           console.log(requestsRes.keys);
     //-->let requests = requestsRes.payload.val();
                           let requests = requestsRes.keys;
                            if (requests != null) {
                                if (requests.friendRequests != null && requests.friendRequests != undefined) {
                                    this.friendRequests = [];
                                    this.friendRequestCount = requests.friendRequests.length;
                                    requests.friendRequests.forEach((userId) => {
                                        //console.log("uid:"+userId);
                                        this.dataProvider.getUser(userId).snapshotChanges().subscribe((sender) => {
                                            sender = {$key: sender.key, ...sender.payload.val()};
                                           // console.log("uid:"+JSON.stringify(sender));
                                             this.addOrUpdateFriendRequest(sender);
                                        });
                                    });
                                } else {
                                    this.friendRequests = [];
                                }
                                // requestsSent.
                                if (requests.requestsSent != null && requests.requestsSent != undefined) {
                                    this.requestsSent = [];
                                    requests.requestsSent.forEach((userId) => {
                                        this.dataProvider.getUser(userId).snapshotChanges().subscribe((receiver) => {
                                            receiver = {$key: receiver.key, ...receiver.payload.val()};
                                            //  this.addOrUpdateRequestSent(receiver);
                                        });
                                    });
                                } else {
                                    this.requestsSent = [];
                                }
                            }
                            this.loadingProvider.hide();
                        });
                    }
               // }
               // this.loadingProvider.hide();
           // });
        }*/


    /* Add or update friend request only if not yet friends.
    addOrUpdateFriendRequest(sender) {
        if (!this.friendRequests) {
            this.friendRequests = [sender];
        } else {
            var index = -1;
            for (var i = 0; i < this.friendRequests.length; i++) {
                if (this.friendRequests[i].$key == sender.$key) {
                    index = i;
                }
            }
            if (index > -1) {
                if (!this.isFriends(sender.$key))
                    this.friendRequests[index] = sender;
            } else {
                if (!this.isFriends(sender.$key))
                    this.friendRequests.push(sender);
            }
        }
    }*/


    // Checks if user is already friends with this user.
    isFriends(userId) {
        if (this.account && this.account.friends) {
            if (this.account.friends.indexOf(userId) == -1) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    // Accept Friend Request.
    acceptFriendRequest(friendRequest) {

        this.alert = this.alertCtrl.create({
            title: 'Conferma Richiesta',
            message: 'Vuoi confermare <b>' + friendRequest.richiedente + '</b> ?',
            buttons: [
                {
                    text: 'Accetta',
                    handler: () => {
                        //associa ad alunno
                        //this.selectAlunno(genitoreKey, this.myscool.scuola.studenti);
                        this.confirmClassRequest(friendRequest, this.myscool.scuola.studenti);
                    }
                },
                {
                    text: 'Rifiuta e elimina',
                    role: 'destructive',
                    handler: () => {
                        //this.firebaseProvider.deleteFriendRequest(friendRequest);
                        this.deleteClassRequest(friendRequest);
                    }
                },
                {
                    text: 'Annulla',
                    role: 'cancel',
                    handler: data => { }
                },
            ]
        }).present();
    }


    /*
    selectAlunno(user, alunni) {
        let alert = this.alertCtrl.create();
        alert.setTitle('Seleziona Alunno');
        alert.setMessage('');

        alunni.forEach(r => {
            alert.addButton({
                text: r.nome,
                handler: () => {
                   // console.log("alunno"+r.id);
                   // console.log("user:"+JSON.stringify(user));
                    //this.firebaseProvider.acceptFriendRequest(user.$key, this.codice, r);
                    this.firebaseProvider.acceptParentRequest(user, this.codice, r);
                    this.getFriendRequests();
                }
            });
        });

        alert.addButton('Annulla');

        alert.present();
    }
    */
    confirmClassRequest(friendRequest, listaAlunni) {
        console.log(this.myscool.scuola);

        let alert = this.alertCtrl.create();
        alert.setTitle('Conferma Alunno');
        alert.setMessage("Genitore: " + friendRequest.richiedente + "<br/>" + "Alunno indicato: " + friendRequest.studente);

        //TODO: controllare se le lista è già ordinata
        
        /*let sortedListaAlunni = listaAlunni.sort((str1,str2) => {
            if (str1 > str2) {
                return 1;
            }        
            if (str1 < str2) {
                return -1;
            }        
            return 0;
        });*/

        listaAlunni.forEach(alunno => {
            alert.addInput({
                type: 'radio',
                label: alunno.nome, //visualizzato
                value: alunno.nome, //passato con data
                //cerco di preimpostare selezionato il nome inserito nella nota. se non va bene si puo mettere tranquillamente false (tutti deselesionati)
                checked: friendRequest.studente.toString().toLowerCase() == alunno.nome.toString().toLowerCase()
            })
        });

        
        alert.addButton({
            text: 'Annulla',
            role: 'cancel',
        })
        alert.addButton({
            text: 'Conferma',
            handler: data => {
                if (!data || data == "") {
                    console.log("Nessun alunno selezionato")
                    return false
                }
                let nomeAlunnoSelezionato = data
                let pendingsList = this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.scuola.classe_id);
                let confirmedObject = this.dataProvider.getConfirmedRequestObj(this.myscool.scuola.codice_scuola, this.myscool.scuola.classe_id, friendRequest.key);

                confirmedObject.set({
                    "richiedente": friendRequest.richiedente.toString(),
                    "studente": nomeAlunnoSelezionato.toString()
                }).then((success) => {
                    console.log("OK:Aggiunta confirmed request " + "richiedente: " + friendRequest.richiedente.toString(),
                        "studente " + nomeAlunnoSelezionato.toString())

                    pendingsList.remove(friendRequest.key);
                    
                    let userNode_GenitoreClasse = this.dataProvider.getUserGenitoreClasseObj(friendRequest.key, this.myscool.scuola.classe_id);
                    userNode_GenitoreClasse.set({
                        "scuola" : this.myscool.scuola.codice_scuola,
                        "studente" : nomeAlunnoSelezionato.toString()

                        //[nomeAlunnoSelezionato.toString()]: this.myscool.scuola.codice_scuola.toString()
                    });


                    this.getFriendRequests();
                }).catch((error) => {
                    console.log("ERR:Aggiunta confirmed request " + "richiedente: " + friendRequest.richiedente.toString(),
                        "studente " + nomeAlunnoSelezionato.toString())
                });
            }
        });
        alert.present();


        /*
                let pendingsList = this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.scuola.classe_id);
                let confirmedObject = this.dataProvider.getConfirmedRequestObj(this.myscool.scuola.codice_scuola, this.myscool.scuola.classe_id, friendRequest.key);
        
                confirmedObject.set({
                    "richiedente": friendRequest.richiedente.toString(),
                    "studente": friendRequest.studente.toString()
                }).then((success) => {
                    console.log("OK:Aggiunta confirmed request " + "richiedente: " + friendRequest.richiedente.toString(),
                        "studente " + friendRequest.studente.toString())
        
                    pendingsList.remove(friendRequest.key);
        
                    let userNode_GenitoreClasse = this.dataProvider.getUserGenitoreClasseObj(friendRequest.key, this.myscool.scuola.classe_id);
                    userNode_GenitoreClasse.set({
                        [friendRequest.studente.toString()] : this.myscool.scuola.codice_scuola.toString()
                    });
        
                    this.getFriendRequests();
                }).catch((error) => {
                    console.log("ERR:Aggiunta confirmed request " + "richiedente: " + friendRequest.richiedente.toString(),
                        "studente " + friendRequest.studente.toString())
                });
                */
    }
    deleteClassRequest(friendRequest) {
        console.log(this.myscool.scuola);

        let pendingsList = this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.scuola.classe_id);
        pendingsList.remove(friendRequest.key)
            .then((success) => {
                console.log("OK:Rimozione e elimina " + "richiedente: " + friendRequest.richiedente.toString(),
                    "studente " + friendRequest.studente.toString())

                this.getFriendRequests();
            }).catch((error) => {
                console.log("ERR:Rimozione e elimina " + "richiedente: " + friendRequest.richiedente.toString(),
                    "studente " + friendRequest.studente.toString())
            });
    }




    getFriendRequests() {
        //this.friendRequests = [];
        //this.requestsSent = [];

        this.loadingProvider.show();
        // Get user info
        console.log("friends:" + this.friendRequestCount + "-codice:" + this.codice);
        this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {
            //  this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
            console.log("AA:" + JSON.stringify(account));
            if (account != null) {
                this.account = account.payload.val();
                if (this.account != null) {
                    console.log("Accoutn:" + this.account + "-codice:" + this.codice);
                    // Get friendRequests and requestsSent of the user.
                    this.dataProvider.getRequests(this.account.userId).snapshotChanges().subscribe((requestsRes) => {
                        // friendRequests.
                        let requests = requestsRes.payload.val();
                        if (requests != null) {
                            if (requests.friendRequests != null && requests.friendRequests != undefined) {
                                //this.friendRequests = [];
                                this.friendRequestCount = requests.friendRequests.length;
                                requests.friendRequests.forEach((userId) => {
                                    this.dataProvider.getUser(userId).snapshotChanges().subscribe((sender) => {
                                        sender = { $key: sender.key, ...sender.payload.val() };
                                        //this.addOrUpdateFriendRequest(sender);
                                    });
                                });
                            } else {
                                //this.friendRequests = [];
                            }
                            // requestsSent.
                            if (requests.requestsSent != null && requests.requestsSent != undefined) {
                                //this.requestsSent = [];
                                requests.requestsSent.forEach((userId) => {
                                    this.dataProvider.getUser(userId).snapshotChanges().subscribe((receiver) => {
                                        receiver = { $key: receiver.key, ...receiver.payload.val() };
                                        //  this.addOrUpdateRequestSent(receiver);
                                    });
                                });
                            } else {
                                //this.requestsSent = [];
                            }
                        }
                        this.loadingProvider.hide();
                    });
                }
            }
            this.loadingProvider.hide();
        });
    }

    findNewFriends() {
        //this.requestsSent = [];
        //this.friendRequests = [];
        // Initialize
        this.loadingProvider.show();
        this.searchUser = '';
        // Get all users.
        this.dataProvider.getUsers().snapshotChanges().subscribe((accounts) => {
            this.loadingProvider.hide();
            this.accounts = accounts.map(c => {
                if (c.key != null && c.key != undefined && c.payload.val() != null) {
                    return { $key: c.key, ...c.payload.val() }
                }
            });
            //  console.log(this.accounts);

            this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
                // Add own userId as exludedIds.
                //  console.log(account.payload.val());
                this.excludedIds = [];
                this.account = account.payload.val();
                if (this.excludedIds.indexOf(account.key) == -1) {
                    this.excludedIds.push(account.key);
                }
                // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
                if (account.payload.val() != null) {
                    console.log(account.payload.val().friends);
                    if (account.payload.val().friends != null) {
                        account.payload.val().friends.forEach(friend => {
                            if (this.excludedIds.indexOf(friend) == -1) {
                                this.excludedIds.push(friend);
                            }
                        });
                    }
                }
                // Get requests of the currentUser.
                this.dataProvider.getRequests(account.key).snapshotChanges().subscribe((requests) => {
                    //console.log("ciao:"+requests);
                    if (requests.payload.val() != null) {
                        this.requestsSents = requests.payload.val().requestsSent;
                        this.friendRequests = requests.payload.val().friendRequests;
                    }
                });
            });

        });
    }

    // Send friend request.
    sendFriendRequest(user) {
        this.alert = this.alertCtrl.create({
            title: 'Send Friend Request',
            message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => { }
                },
                {
                    text: 'Send',
                    handler: () => {
                        this.firebaseProvider.sendFriendRequest(user.$key);
                    }
                }
            ]
        }).present();
    }

    /* Get the status of the user in relation to the logged in user.
    getStatus(user) {
        // Returns:
        // 0 when user can be requested as friend.
        // 1 when a friend request was already sent to this user.
        // 2 when this user has a pending friend request.
        if (this.requestsSent) {
            for (var i = 0; i < this.requestsSent.length; i++) {
                if (this.requestsSent[i] == user.$key) {
                    return 1;
                }
            }
        }
        if (this.friendRequests) {
            for (var j = 0; j < this.friendRequests.length; j++) {
                if (this.friendRequests[j] == user.$key) {
                    return 2;
                }
            }
        }
        return 0;
    }*/


    // Proceed to chat page.
    message(userId) {
        this.app.getRootNav().push(MessagePage, { userId: userId });
    }

    whatsappShare() {
        var msg = "Collegati con Skuolapp: " + this.myCodice;
        this.socialSharing.shareViaWhatsApp(msg, null, null);
    }
    reverseString(str) {
        // Step 1. Use the split() method to return a new array
        var splitString = str.split(""); // var splitString = "hello".split("");
        // ["h", "e", "l", "l", "o"]

        // Step 2. Use the reverse() method to reverse the new created array
        var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
        // ["o", "l", "l", "e", "h"]

        // Step 3. Use the join() method to join all elements of the array into a string
        var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
        // "olleh"

        //Step 4. Return the reversed string
        return joinArray; // "olleh"
    }

    getFriendSchool() {
        //this.friendRequests = [];
        //this.requestsSent = [];
        //let i = 0;
        this.loadingProvider.show();
        // Get user info
        if (this.codice != null) {
            /*this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges().subscribe((requestsRes) => {
                requestsRes.forEach( (userId) => {
                console.log(userId.payload.val());
                this.friendRequests[i++] = userId;
            });*/

            this.friendRequests = this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges().
                map(request => request.map(c => ({ key: c.key, ...c.payload.val() })));

            // requestsSent.
            /*                   if (requests.requestsSent != null && requests.requestsSent != undefined) {
                                    this.requestsSent = [];
                                    requests.requestsSent.forEach((userId) => {
                                        this.dataProvider.getUser(userId).snapshotChanges().subscribe((receiver) => {
                                            receiver = {$key: receiver.key, ...receiver.payload.val()};
                                            //  this.addOrUpdateRequestSent(receiver);
                                        });
                                    });
                                } else {
                                    this.requestsSent = [];
                                }*/
            this.loadingProvider.hide();
        };

    }

    getFriendsNew(){        
        this.loadingProvider.show();

        if (this.codice != null) {
            this.requestsSents = this.dataProvider.getConfirmedRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges().
                map(request => request.map(c => ({ key: c.key, ...c.payload.val() })));
            console.log(this.requestsSents);
            this.loadingProvider.hide();
        };
    }
}
