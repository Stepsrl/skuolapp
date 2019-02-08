import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingProvider } from './loading';
import { AlertProvider } from './alert';
import { DataProvider } from './data';
import * as firebase from 'firebase';
// import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/take';
import {GroupPage} from "../pages/group/group";

@Injectable()
export class FirebaseProvider {
    // Firebase Provider
    // This is the provider class for most of the Firebase updates in the app.

    constructor(public angularfire: AngularFireDatabase, public loadingProvider: LoadingProvider, public alertProvider: AlertProvider, public dataProvider: DataProvider) {
        console.log("Initializing Firebase Provider");
    }

    // Send friend request to userId.
    sendFriendRequest(userId) {
        let loggedInUserId = firebase.auth().currentUser.uid;
        this.loadingProvider.show();

        var requestsSent;
        // Use take(1) so that subscription will only trigger once.
        this.dataProvider.getRequests(loggedInUserId).snapshotChanges().take(1).subscribe((requests) => {
            console.log(requests.payload.val());
            if(requests.payload.val() != null && requests.payload.val().requestsSent != null)
                requestsSent = requests.payload.val().requestsSent;

            if (requestsSent == null || requestsSent == undefined) {
                requestsSent = [userId];
            } else {
                if(requestsSent.indexOf(userId) == -1)
                    requestsSent.push(userId);
            }
            // Add requestsSent information.
            this.angularfire.object('/requests/' + loggedInUserId).update({
                requestsSent: requestsSent
            }).then((success) => {
                var friendRequests;
                this.dataProvider.getRequests(userId).snapshotChanges().take(1).subscribe((requests) => {
                    if(requests.payload.val() != null && requests.payload.val().friendRequests !=null)
                       // friendRequests = requests.payload.val().friendRequests;

                    if (friendRequests == null) {
                        friendRequests = [loggedInUserId];
                    } else {
                        if(friendRequests.indexOf(userId) == -1)
                            friendRequests.push(loggedInUserId);
                    }
                    // Add friendRequest information.
                    this.angularfire.object('/requests/' + userId).update({
                        friendRequests: friendRequests
                    }).then((success) => {
                        this.loadingProvider.hide();
                        this.alertProvider.showFriendRequestSent();
                    }).catch((error) => {
                        this.loadingProvider.hide();
                    });
                });
            }).catch((error) => {
                this.loadingProvider.hide();
            });
        });
    }


    // Send request to join school class
    sendClassRequest(codice_scuola, id_classe, nota) {
        let loggedInUserId = firebase.auth().currentUser.uid;

        this.loadingProvider.show();

        //NOTE: per gli account test è null
        let nome_cognome_genitore = localStorage.getItem(loggedInUserId);

        this.dataProvider.getPendigRequestObj(codice_scuola, id_classe, loggedInUserId)
        .set({
            "richiedente":nome_cognome_genitore,
            "studente":nota
        }).then((success) => {
            console.log("OK:Aggiunta pending request "+"richiedente: "+nome_cognome_genitore,
            "studente "+nota)

            this.loadingProvider.hide();
            this.alertProvider.showAccountDeletedMessage
            this.alertProvider.showFriendRequestSent();
        }).catch((error) => {
            console.log("ERR:Aggiunta pending request "+"richiedente: "+nome_cognome_genitore,
            "studente "+nota)

            this.loadingProvider.hide();
        });
/*
        this.dataProvider.getPendigRequestObj(codice_scuola, id_classe, loggedInUserId)
            .set(nota).then((success) => {
                console.log("OK:Aggiunta pending request "+loggedInUserId+" : "+nota)

                this.loadingProvider.hide();
                this.alertProvider.showAccountDeletedMessage
                this.alertProvider.showFriendRequestSent();
            }).catch((error) => {
                console.log("ERR:Aggiunta pending request "+loggedInUserId+" : "+nota)

                this.loadingProvider.hide();
            });
            */

    }



    // Cancel friend request sent to userId.
    cancelFriendRequest(userId) {
        console.log("cancella request:"+userId);
        let loggedInUserId = firebase.auth().currentUser.uid;
        this.loadingProvider.show();

        var requestsSent;
        this.dataProvider.getRequests(loggedInUserId).snapshotChanges().take(1).subscribe((requests) => {
            if (requests && requests.payload!= null && requests.payload.val()!= null) {
               // console.log("cancella :"+JSON.stringify(requests));
                requestsSent = requests.payload.val().requestsSent;
                requestsSent.splice(requestsSent.indexOf(userId), 1);
                // Update requestSent information.
                this.angularfire.object('/requests/' + loggedInUserId).update({
                    requestsSent: requestsSent
                }).then((success) => {
                    var friendRequests;
                    this.dataProvider.getRequests(userId).snapshotChanges().take(1).subscribe((requests) => {
                        friendRequests = requests.payload.val().friendRequests;
                        //console.log(friendRequests);
                        friendRequests.splice(friendRequests.indexOf(loggedInUserId), 1);
                        // Update friendRequests information.
                        this.angularfire.object('/requests/' + userId).update({
                            friendRequests: friendRequests
                        }).then((success) => {
                            this.loadingProvider.hide();
                            this.alertProvider.showFriendRequestRemoved();
                        }).catch((error) => {
                            this.loadingProvider.hide();
                        });
                    });
                }).catch((error) => {
                    this.loadingProvider.hide();
                });
            }
        });
    }

    // Delete friend request.
    deleteFriendRequest(userId, classeID='') {
        //TODO: cancellare la richiesta dal nodo del nuovo database
        let loggedInUserId = firebase.auth().currentUser.uid;
        this.loadingProvider.show();
        loggedInUserId = classeID;
       // console.log("elimina:"+userId);
        var friendRequests;
        this.dataProvider.getRequests(loggedInUserId).snapshotChanges().take(1).subscribe((requests) => {
            friendRequests = requests.payload.val().friendRequests;
           // console.log(friendRequests);
            friendRequests.splice(friendRequests.indexOf(userId), 1);
            // Update friendRequests information.
            this.angularfire.object('/requests/' + loggedInUserId).update({
                friendRequests: friendRequests
            }).then((success) => {
                var requestsSent;
                this.dataProvider.getRequests(userId).snapshotChanges().take(1).subscribe((requests) => {
                    requestsSent = requests.payload.val().requestsSent;
                    requestsSent.splice(requestsSent.indexOf(loggedInUserId), 1);
                    // Update requestsSent information.
                    this.angularfire.object('/requests/' + userId).update({
                        requestsSent: requestsSent
                    }).then((success) => {
                        this.loadingProvider.hide();

                    }).catch((error) => {
                        this.loadingProvider.hide();
                    });
                });
            }).catch((error) => {
                this.loadingProvider.hide();
                //TODO ERROR
            });
        });
    }

    // Accept friend request.
    acceptFriendRequest(userId, classeID='', alunno={"id":0}) {
       // console.log("accept:"+userId+"-classe:"+classeID+"-alunno:"+JSON.stringify(alunno));

        let loggedInUserId = firebase.auth().currentUser.uid;

        if (classeID != '') {
            loggedInUserId = classeID;
        }

        // Delete friend request.
        this.deleteFriendRequest(userId, classeID);

        this.loadingProvider.show();
        this.dataProvider.getUser(loggedInUserId).snapshotChanges().take(1).subscribe((account) => {
            //console.log("account:"+JSON.stringify(account));
            // console.log("account:"+account.payload);
            var friends= [{"user":userId, "alunno":alunno}];
            if (account && account.payload && account.payload.val() != null ) {
               // console.log("account2:"+JSON.stringify(account.payload.val()));
                friends = account.payload.val().friends;
                if (!friends) {
                    friends = [{"user":userId, "alunno":alunno}];
                } else {
                    friends.push({"user":userId, "alunno":alunno});
                }

            }

            // Add both users as friends.
            this.dataProvider.getUser(loggedInUserId).update({
                friends: friends
            }).then((success) => {

                this.dataProvider.getUser(userId).snapshotChanges().take(1).subscribe((account) => {
                    var friends= [{"user":loggedInUserId, "alunno":alunno}];
                    //console.log("account3:"+JSON.stringify(account));
                    if (account && account.payload && account.payload.val() != null ) {
                        friends = account.payload.val().friends;
                        if (!friends) {
                            friends = [{"user":loggedInUserId, "alunno":alunno}];
                        } else {
                            friends.push({"user":loggedInUserId, "alunno":alunno});
                        }
                    }

                    this.dataProvider.getUser(userId).update({
                        friends: friends
                    }).then((success) => {
                        //aggiorna anche alunno collegato
                        this.dataProvider.getUser(alunno.id).snapshotChanges().take(1).subscribe((account) => {
                            var parents = [{"user": userId, "scuola": loggedInUserId}];
                            //console.log("account3:"+JSON.stringify(account));
                            if (account && account.payload && account.payload.val() != null) {
                                parents = account.payload.val().parents;
                                if (!parents) {
                                    parents = [{"user": userId, "scuola": loggedInUserId}];
                                } else {
                                    parents.push({"user": userId, "scuola": loggedInUserId});
                                }
                            }
                            this.dataProvider.getUser(alunno.id).update({
                                parents: parents
                            }).then((success) => {
                                this.loadingProvider.hide();
                            }).catch((error) => {
                                this.loadingProvider.hide();
                            });
                        });

                        this.loadingProvider.hide();
                    }).catch((error) => {
                        this.loadingProvider.hide();
                    });
                });
            }).catch((error) => {
                this.loadingProvider.hide();
            });

        });
    }

  /*  done() {
        this.loadingProvider.show();
        var messages = [];
        // Add system message that group is created.
        messages.push({
            date: new Date().toString(),
            sender: firebase.auth().currentUser.uid,
            type: 'system',
            message: 'This group has been created.',
            icon: 'md-chatbubbles'
        });
        // Add members of the group.
        var members = [];
        for (var i = 0; i < this.groupMembers.length; i++) {
            members.push(this.groupMembers[i].$key);
        }
        // Add group info and date.
        this.group.dateCreated = new Date().toString();
        this.group.messages = messages;
        this.group.members = members;
        this.group.name = this.groupForm.value["name"];
        this.group.description = this.groupForm.value["description"];
        // Add group to database.
        this.angularfire.list('groups').push(this.group).then((success) => {
            let groupId = success.key;
            // Add group reference to users.
            this.angularfire.object('/accounts/' + this.groupMembers[0].$key + '/groups/' + groupId).update({
                messagesRead: 1
            });
            for (var i = 1; i < this.groupMembers.length; i++) {
                this.angularfire.object('/accounts/' + this.groupMembers[i].$key + '/groups/' + groupId).update({
                    messagesRead: 0
                });
            }
            // Open the group chat of the just created group.
            this.navCtrl.popToRoot().then(() => {
                this.loadingProvider.hide();
                this.app.getRootNav().push(GroupPage, { groupId: groupId });
            });
        });
    }
    */
    // Accept friend request.
    acceptParentRequest(user, classeID='', alunno={"id":0, "nome":"", "data_nascita":""}) {
       //  console.log("accept:"+userId+"-classe:"+classeID+"-alunno:"+JSON.stringify(alunno));

        let userId = user.$key;
        let loggedInUserId = firebase.auth().currentUser.uid;

        if (classeID != '') {
            loggedInUserId = classeID;
        }

        // Delete friend request.
     //   this.deleteFriendRequest(userId, classeID);

        this.loadingProvider.show();
        this.dataProvider.getUser(loggedInUserId+"/"+alunno.id).snapshotChanges().take(1).subscribe((account) => {
            //console.log("account:"+JSON.stringify(account));
            // console.log("user:"+JSON.stringify(user));
            var parents= [{ "id":userId, "name":user.name}];
            if (account && account.payload && account.payload.val() != null ) {
       //  console.log("account2:"+JSON.stringify(account.payload.val()));
                let parent = account.payload.val().parents;
               // parents.push(parent);
                if (!parents) {
                    parents = [{"id":userId, "name":user.name}];
                } else {
                    parents.push( { "id":userId, "name":user.name});
                }

            }

            let alu = {"id": alunno.id, "nome":alunno.nome, "data_nascita": alunno.data_nascita };
           // console.log("parents:"+JSON.stringify(alu));
            // Add both users as friends.
            //loggedInUserId rappresenta la classe
            this.dataProvider.getUser(loggedInUserId+"/"+alunno.id+"/alunno").update(
                 alu
            ).then((success) => {
                parents.forEach(pp=>{
                    console.log("parente:"+loggedInUserId+"/"+alunno.id+"/parents/"+pp.id);
                    this.dataProvider.getUser(loggedInUserId+"/"+alunno.id+"/parents/"+pp.id).update( pp);
                });

               // console.log("scuola:"+JSON.stringify(success));
                this.dataProvider.getUser(userId).snapshotChanges().take(1).subscribe((account) => {
                    var friends= [{ "user":loggedInUserId, "alunno":alu}];
                  //  console.log("account3:"+JSON.stringify(account));
                    if (account && account.payload && account.payload.val() != null ) {
                        friends = account.payload.val().friends;
                        if (!friends) {
                            friends = [{ "user":loggedInUserId, "alunno":alu}];
                        } else {
                            friends.push({ "user":loggedInUserId, "alunno":alu});
                        }
                    }

                    this.dataProvider.getUser(userId).update({
                        friends: friends
                    }).then((success) => {
                        //aggiorna anche alunno collegato
                        this.dataProvider.getUser(alunno.id).snapshotChanges().take(1).subscribe((account) => {
                            var parents = [{"user": userId, "scuola": loggedInUserId}];
                            //console.log("account4:"+JSON.stringify(account));
                            if (account && account.payload && account.payload.val() != null) {
                                parents = account.payload.val().parents;
                                if (!parents) {
                                    parents = [{"user": userId, "scuola": loggedInUserId}];
                                } else {
                                    parents.push({"user": userId, "scuola": loggedInUserId});
                                }
                            }
                            this.dataProvider.getUser(alunno.id).update({
                                parents: parents
                            }).then((success) => {
                                this.loadingProvider.hide();
                            }).catch((error) => {
                                console.log("errore 21:"+JSON.stringify(error));
                                this.loadingProvider.hide();
                            });
                        });

                        this.loadingProvider.hide();
                    }).catch((error) => {
                        console.log("errore 2:"+JSON.stringify(error));
                        this.loadingProvider.hide();
                    });
                });
            }).catch((error) => {
                console.log("errore 22:"+JSON.stringify(error));
                this.loadingProvider.hide();
            });


            // Add both users as friends.
        /*    this.dataProvider.getUser(loggedInUserId).update({
                friends: friends
            }).then((success) => {

                this.dataProvider.getUser(userId).snapshotChanges().take(1).subscribe((account) => {
                    var friends= [{"user":loggedInUserId, "alunno":alunno}];
                    //console.log("account3:"+JSON.stringify(account));
                    if (account && account.payload && account.payload.val() != null ) {
                        friends = account.payload.val().friends;
                        if (!friends) {
                            friends = [{"user":loggedInUserId, "alunno":alunno}];
                        } else {
                            friends.push({"user":loggedInUserId, "alunno":alunno});
                        }
                    }

                    this.dataProvider.getUser(userId).update({
                        friends: friends
                    }).then((success) => {
                        //aggiorna anche alunno collegato
                        this.dataProvider.getUser(alunno.id).snapshotChanges().take(1).subscribe((account) => {
                            var parents = [{"user": userId, "scuola": loggedInUserId}];
                            //console.log("account3:"+JSON.stringify(account));
                            if (account && account.payload && account.payload.val() != null) {
                                parents = account.payload.val().parents;
                                if (!parents) {
                                    parents = [{"user": userId, "scuola": loggedInUserId}];
                                } else {
                                    parents.push({"user": userId, "scuola": loggedInUserId});
                                }
                            }
                            this.dataProvider.getUser(alunno.id).update({
                                parents: parents
                            }).then((success) => {
                                this.loadingProvider.hide();
                            }).catch((error) => {
                                this.loadingProvider.hide();
                            });
                        });

                        this.loadingProvider.hide();
                    }).catch((error) => {
                        this.loadingProvider.hide();
                    });
                });
            }).catch((error) => {
                this.loadingProvider.hide();
            });
*/
        });

    }
}
