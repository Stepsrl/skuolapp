import { DataProvider } from './../../providers/data';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Content, ToastController } from 'ionic-angular';
//import { SindaciPage } from '../sindaci/sindaci';
import firebase from 'firebase';
import { SelelezPage } from '../selelez/selelez';

import { MenuclassePage } from '../menuclasse/menuclasse';
import { FirebaseProvider } from "../../providers/firebase";
import { LoadingProvider } from "../../providers/loading";
//import {ComemptyPage} from "../comempty/comempty";
import { FirstproviderProvider } from "../../providers/firstprovider/firstprovider";


/**
 * Generated class for the ComlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
    selector: 'page-comlist',
    templateUrl: 'comlist.html',
})

export class ComlistPage {
    @ViewChild(Content) content: Content;
    //lista richieste in Pending
    list: any = [];
    private numRequestPending: number;
    //lista richieste confirmed
    listConfirmed: any = [];
    private numRequestConfirmed: number;
    //lista assegnate al docente
    mylist: any;
    //lista contenente le informazioni caricare dal localStorage
    listaStorage: any = [];

    uid;

    private friends: any;
    private friendRequests: any = [];
    private account: any;
    private requestsSent: any = [];
    private friendRequestCount = 0;
    private messaggio: string;
    className: string = 'toolbar-background2';

    firedata = firebase.database().ref('/voti');
    constructor(public navCtrl: NavController, public loadingProvider: LoadingProvider,
        public dataProvider: DataProvider, public alertCtrl: AlertController,
        public loadingCtrl: LoadingController, public firebaseProvider: FirebaseProvider,
        public navParams: NavParams, public toastCtrl: ToastController, public user_provid: FirstproviderProvider) {
        this.list = [];
        this.numRequestPending = 0;

        this.listConfirmed = [];
        this.numRequestConfirmed = 0;

        this.listaStorage = [];

        this.mylist = [];

        this.uid = firebase.auth().currentUser.uid;
    }

    ionViewDidLoad() {
        this.content.resize();
        this.listaStorage = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid + '-ScomData'));

        this.createSeparateClassView();
        this.setSubscribeParentOnClasse();
        //this.getFriendRequests();
    }

    ionViewWillEnter() {
        this.content.resize();
        this.listaStorage = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid + '-ScomData'));
        this.loadServer();
        //this.getFriendRequests();
    }

    ionViewWillLeave() {
        console.log('ionViewWillLeave ComlistPage');
        // firebase.database().ref('/assigns').child(firebase.auth().currentUser.uid).off();
    }

    //assegna list e listConfirmed partendo da listStorage
    createSeparateClassView() {
        if (this.listaStorage == null) { return; } //Fix Crash listaStorage.lenght su null

        for (let i = 0; i < this.listaStorage.length; i++) {

            if (this.listaStorage[i].stato == "requestConfirmed") {
                this.listConfirmed[this.numRequestConfirmed] = this.listaStorage[i];
                this.numRequestConfirmed++;
            }
            else {
                this.list[this.numRequestPending] = this.listaStorage[i];
                this.numRequestPending++;
            }
        }
    }

    getConfirmedClass(keyToFind) {
        for (let i = 0; i < this.listaStorage.length; i++) {

            if (this.listaStorage[i].classe.id == keyToFind && this.listaStorage[i].stato == "requestSent") {
                this.listaStorage[i].stato = "requestConfirmed";
                localStorage.setItem(firebase.auth().currentUser.uid + '-ScomData', JSON.stringify(this.listaStorage));

                this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
        }
    }



    setSubscribeParentOnClasse() {
        //add a subscribe for notify the accept of the professor for a class
        let temp = this.dataProvider.getCurrentParent(firebase.auth().currentUser.uid);
        temp.snapshotChanges().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                if (snapshot.key != "info") {
                    this.getConfirmedClass(snapshot.key);
                    let nomeStudente = snapshot.payload.val().studente;
                    this.dataProvider.saveStudentLocalIfNotPresent(snapshot.key, nomeStudente)
                }
            });
        });
    }

    selCom(item) {
        //   if (item.stato === "friend") {
        // firebase.database().ref('/assigns').child(firebase.auth().currentUser.uid).off();
        this.loadAlunni(item);
        // }
    }

    loadAlunni(scuola) {
        let mylist = [];
        //let friendsuid = [];
        //if (firebase.auth().currentUser.uid.startsWith("DDD-")) {

        // let codiceDocente = firebase.auth().currentUser.uid.substr(4);
        //
        console.log("carica dati docente:" + JSON.stringify(scuola));
        let scuolaTemp = scuola;

        let loading = this.loadingCtrl.create({
            content: "Please Wait..."
        });
        loading.present();

        this.messaggio = "Nessun dato presente";
        //http://www.placeafe.it/apis_contavoti/liste_by_comune.php
        let dati = {
            "username": "apiusername",
            "password": "apipassword",
            "classe_id": scuolaTemp.classe.id
        }
        this.user_provid.postAdminData(dati, "classe").then((result) => {

            loading.dismiss();
            //console.log(JSON.stringify(result));
            if (Object(result).status == "success") {
                this.messaggio = null;
                //  console.log("enter server:" + JSON.stringify(result));
                //let scuola = Object(result).docente.scuola;
                scuolaTemp.scuola = Object(result).classe;
                let studenti = Object(result).classe.studenti;

                studenti.forEach(r => {
                    //carica i parenti del alunno
                    let parents = [];
                    // Get user data on
                    // database and get list of friends.
                    // this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {
                    this.dataProvider.getUser(r.id).snapshotChanges().subscribe((account) => {
                        //     this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
                        //console.log("KKK."+JSON.stringify(r)+"--"+r.id+"--"+JSON.stringify(account));
                        if (account.payload.val() != null && account.payload.val().parents != null) {
                            for (var i = 0; i < account.payload.val().parents.length; i++) {
                                //  console.log("acc:"+account.payload.val().friends[i]);
                                let sub = this.dataProvider.getUser(account.payload.val().parents[i].user).snapshotChanges().subscribe((parent) => {
                                    //console.log("--"+JSON.stringify(parent));
                                    if (parent.key != null) {
                                        let friendData = { $key: parent.key, ...parent.payload.val() };
                                        // parents.push(friendData);
                                        var index = parents.findIndex(x => x.$key == parent.key);
                                        // here you can check specific property for an object whether it exist in your array or not
                                        if (index === -1) {
                                            parents.push(friendData);
                                        }
                                    }
                                });
                                // sub.unsubscribe();
                            }
                        } else {
                            parents = [];
                        }
                        this.loadingProvider.hide();
                        r.parents = parents;
                        mylist.push(r);
                    });
                });

                scuolaTemp.scuola.studenti = mylist;

                //Carico lista professori
                let professori = Object(result).classe.professori;
                let profList= [];
                professori.forEach(r => {
                    let parents = [];
                    this.dataProvider.getUser(r.id).snapshotChanges().subscribe((account) => {
                        if (account.payload.val() != null && account.payload.val().parents != null) {
                            for (var i = 0; i < account.payload.val().parents.length; i++) {
                                let sub = this.dataProvider.getUser(account.payload.val().parents[i].user).snapshotChanges().subscribe((parent) => {     
                                    if (parent.key != null) {
                                        let friendData = { $key: parent.key, ...parent.payload.val() };                       
                                        var index = parents.findIndex(x => x.$key == parent.key);                                   
                                        if (index === -1) {
                                            parents.push(friendData);
                                        }
                                    }
                                });
                            }
                        } else {
                            parents = [];
                        }
                        this.loadingProvider.hide();
                        r.parents = parents;
                        profList.push(r);
                    });
                });

                scuolaTemp.scuola.professori = profList;

                // console.log("lista-POST:" + JSON.stringify(scuola));
                this.navCtrl.push(MenuclassePage, { "scuola": scuolaTemp });

            } else {
                console.log("error server:" + JSON.stringify(result));
                let toast = this.toastCtrl.create({
                    message: "No Network",
                    duration: 2000
                })
                toast.present();
            }
        });
        // }
    }

    addList() {
        //console.log("seleziona page");
        // firebase.database().ref('/assigns').child(firebase.auth().currentUser.uid).off();
        this.navCtrl.push(SelelezPage);
    }

    assegnaStato(item, stato) { // crash length 0
        // console.log("item:" + JSON.stringify(item) );
        var codice = item.split("_");
        for (let i = 0; i < this.list.length; i++) {
            // console.log("Cerca:" + JSON.stringify(this.list[i]) );
            if (codice[0] == this.list[i].codice_scuola && codice[1] == this.list[i].indirizzo.id && codice[2] == this.list[i].sezione.id && codice[3] == this.list[i].classe.id) {

                // console.log("Aggiorna");
                this.list[i].stato = stato;

                //console.log("Lista 2:" + JSON.stringify(this.list));
                localStorage.setItem(firebase.auth().currentUser.uid + '-ScomData', JSON.stringify(this.listaStorage));
                return;
            }
        }
    }

    getFriends() {
        this.loadingProvider.show();
        this.friends = [];
        // Get user data on database and get list of friends.
        // this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {
        // this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {

        this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
            //console.log(account);
            if (account.payload.val() != null && account.payload.val().friends != null) {
                for (var i = 0; i < account.payload.val().friends.length; i++) {
                    this.dataProvider.getUser(account.payload.val().friends[i]).snapshotChanges().subscribe((friend) => {
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
        console.log(friend)
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
        console.log(this.friends);
    }
    getFriendRequests() {
        this.friendRequests = [];
        this.requestsSent = [];

        this.loadingProvider.show();
        // Get user info
        //this.dataProvider.getCurrentClass(this.myscool).snapshotChanges().subscribe((account) => {
        this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
            if (account != null) {
                // console.log("utente:"+JSON.stringify(account));

                this.account = account.payload.val();
                if (this.account != null) {
                    // console.log(this.account);
                    // Get friendRequests and requestsSent of the user.
                    this.dataProvider.getRequests(this.account.userId).snapshotChanges().subscribe((requestsRes) => {
                        // friendRequests.

                        let requests = requestsRes.payload.val();
                        if (requests != null) {
                            if (requests.friendRequests != null && requests.friendRequests != undefined) {
                                this.friendRequests = [];
                                // console.log("richieste:"+JSON.stringify(requests.friendRequests));

                                this.friendRequestCount = requests.friendRequests.length;
                                requests.friendRequests.forEach((userId) => {
                                    this.assegnaStato(userId, "friendRequest");
                                    this.dataProvider.getUser(userId).snapshotChanges().subscribe((sender) => {
                                        sender = { $key: sender.key, ...sender.payload.val() };
                                        // this.addOrUpdateFriendRequest(sender);
                                    });
                                });
                            } else {
                                this.friendRequests = [];
                            }
                            // requestsSent.
                            console.log("richieste sent1:" + JSON.stringify(requests.requestsSent));
                            if (requests.requestsSent != null && requests.requestsSent != undefined) {
                                this.requestsSent = [];
                                console.log("richieste sent:" + JSON.stringify(requests.requestsSent));
                                requests.requestsSent.forEach((userId) => {
                                    this.assegnaStato(userId, "requestSent");
                                    this.dataProvider.getUser(userId).snapshotChanges().subscribe((receiver) => {
                                        receiver = { $key: receiver.key, ...receiver.payload.val() };
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
            }
            this.loadingProvider.hide();
        });
    }

    // Cancel Friend Request sent.
    cancelFriendRequest(classe) {
        let codice = classe.codice_scuola + "_" + classe.indirizzo.id + "_" + classe.sezione.id + "_" + classe.classe.id;
        // console.log("cancel codice:"+codice);
        this.firebaseProvider.cancelFriendRequest(codice);
        /*   this.alert = this.alertCtrl.create({
               title: 'Friend Request Pending',
               message: 'Do you want to delete your friend request to <b>' + classe.scuola.nome + '</b>?',
               buttons: [
                   {
                       text: 'Cancel',
                       handler: data => { }
                   },
                   {
                       text: 'Delete',
                       handler: () => {
                           this.firebaseProvider.cancelFriendRequest(codice);
                          // this.getFriendRequests();
                       }
                   }
               ]
           }).present();
           */
    }

    removePref(item) {
        //console.log("rimuovi:" + JSON.stringify(item));
        //richiedere conferma
        let createnewpass = this.alertCtrl.create({
            title: 'Elimina',
            message: "Verranno eliminati tutti i dati!!!",
            buttons: [
                {
                    text: 'Elimina',
                    handler: data => {
                        //console.log("rimuovi:" + JSON.stringify(item));
                        //cerca nella lista quello da elimianre e salva
                        for (let i = 0; i < this.list.length; i++) {
                            // console.log("Cerca:" + JSON.stringify(this.list[i]) );
                            if (item.codice_scuola == this.list[i].codice_scuola && item.indirizzo.id == this.list[i].indirizzo.id && item.sezione.id == this.list[i].sezione.id && item.classe.id == this.list[i].classe.id) {
                                //elimina
                                this.list.splice(i, 1);
                                //elimina anche dalle requests o dalle amicizie

                                this.cancelFriendRequest(item);
                                //console.log("Lista 2:" + JSON.stringify(this.list));
                                localStorage.setItem(firebase.auth().currentUser.uid + '-ScomData', JSON.stringify(this.listaStorage));
                                return;
                            }
                        }
                        localStorage.setItem(firebase.auth().currentUser.uid + '-ScomData', JSON.stringify(this.listaStorage));
                    }
                },
                {
                    text: 'Annulla',
                    handler: data => { }
                }
            ]
        });

        createnewpass.present();
        //this.barlists.push({body: this.reqserve.myrecieptrequ[i], req_state: 2})
    }
    azzera(item) {
        //console.log("azzera:" + JSON.stringify(item));
        //richiedere conferma
        let createnewpass = this.alertCtrl.create({
            title: 'Azzera',
            message: "Verranno azzerati tutti i dati!!!",
            buttons: [
                {
                    text: 'Azzera',
                    handler: data => {
                        //console.log("rimuovi:" + JSON.stringify(item));
                        var cod = item.elezione + "-" + item.code;
                        //console.log("val3:"+val);
                        /*var dBRef =this.firedata.ref(firebase.auth().currentUser.uid+"/"+cod+"/"+item.comune.sezione+"/sindaci");
                        dBRef.once('value', snpsht=>{
                          snpsht.forEach(dp =>{
                            var key = dp.key;
                            dB.ref('posts/' +  key + '/PostDescription2').set(null);
                          })
                        })*/

                        var updatedUserData = {};
                        var promise = new Promise((resolve, reject) => {
                            if (item.comune.sezione !== 'M') {
                                var dBRef = this.firedata.child(firebase.auth().currentUser.uid + "/" + cod + "/" + item.comune.sezione + "/sindaci");
                                dBRef.once('value', snpsht => {
                                    if (snpsht && snpsht !== undefined && snpsht != null && snpsht.val()) {
                                        snpsht.forEach(dp => {
                                            var key = dp.key;
                                            updatedUserData[firebase.auth().currentUser.uid + "/" + cod + "/sindaci/" + key + "/" + item.comune.sezione] = null;
                                            return true;
                                        })
                                    }
                                })

                                dBRef = this.firedata.child(firebase.auth().currentUser.uid + "/" + cod + "/" + item.comune.sezione + "/liste");
                                dBRef.once('value', snpsht => {
                                    if (snpsht && snpsht !== undefined && snpsht != null && snpsht.val()) {
                                        snpsht.forEach(dp => {
                                            var key = dp.key;
                                            updatedUserData[firebase.auth().currentUser.uid + "/" + cod + "/liste/" + key + "/" + item.comune.sezione] = null;
                                            return true;
                                        })
                                    }

                                })
                                dBRef = this.firedata.child(firebase.auth().currentUser.uid + "/" + cod + "/" + item.comune.sezione + "/candidati");
                                dBRef.once('value', snpsht => {
                                    if (snpsht && snpsht !== undefined && snpsht != null && snpsht.val()) {
                                        snpsht.forEach(dp => {
                                            var key = dp.key;
                                            updatedUserData[firebase.auth().currentUser.uid + "/" + cod + "/candidati/" + key + "/" + item.comune.sezione] = null;
                                            return true;
                                        })
                                    }
                                })
                            }
                            if (item.comune.sezione === 'M') {
                                updatedUserData[firebase.auth().currentUser.uid + "/" + cod] = null;
                            } else {
                                updatedUserData[firebase.auth().currentUser.uid + "/" + cod + "/" + item.comune.sezione] = null;
                            }
                            // this.firedata = firebase.database(this.app2).ref('/voti');
                            // Do a deep-path update
                            this.firedata.update(updatedUserData).then(() => {
                                // this.events.publish('friends');
                                // console.log("update");
                                resolve(true);
                            }), ((err) => {
                                //console.log("errore");
                                reject(err);
                            })
                        });
                        return promise;
                    }
                },
                {
                    text: 'Annulla',
                    handler: data => { }
                }
            ]
        });

        createnewpass.present();
        //this.barlists.push({body: this.reqserve.myrecieptrequ[i], req_state: 2})
    }
    loadServer() {
        this.mylist = [];
        //let friendsuid = [];
        //console.log("carica dati docente:" + firebase.auth().currentUser.uid);

        var UIDAttuale = firebase.auth().currentUser.uid
        if (UIDAttuale.startsWith("DDD-")) {
            let codiceDocente = firebase.auth().currentUser.uid.substr(4);
            // console.log("carica dati docente:" + codiceDocente);

            let loading = this.loadingCtrl.create({
                content: "Please Wait..."
            });
            loading.present();

            this.messaggio = "Nessun dato presente";
            //http://www.placeafe.it/apis_contavoti/liste_by_comune.php
            let dati = {
                "username": "apiusername",
                "password": "apipassword",
                "doc_id": codiceDocente
            }
            this.user_provid.postAdminData(dati, "classi").then((result) => {
                loading.dismiss();
                //console.log(JSON.stringify(result));
                if (Object(result).status == "success") {

                    this.messaggio = null;
                    //  console.log("enter server:"+JSON.stringify(result));
                    //let scuola = Object(result).docente.scuola;

                    let classi = Object(result).docente.classi;

                    // console.log("rirotrno:" + JSON.stringify(Object(result).docente));
                    //console.log("scuola:" + JSON.stringify(scuola));
                    //console.log("classi:" + JSON.stringify(classi));
                    //this.listasindaci = Object(result).elezioni.sindaci;
                    //localStorage.setItem(firebase.auth().currentUser.uid+'-'+cod, JSON.stringify(this.listasindaci));
                    //localStorage.setItem(this.master+'-'+cod, JSON.stringify(this.listasindaci));
                    //this.getVoti();
                    //console.log("lista-PRE:" + JSON.stringify(this.mylist));
                    //let scuolaTemp;
                    classi.forEach(r => {
                        //console.log("assigns-3-:" + JSON.stringify(r));
                        // if (r.user === firebase.auth().currentUser.uid){
                        // scuolaTemp = {"scuola": r };
                        this.mylist.push(r);
                        // }
                    });
                    // console.log("lista-POST:" + JSON.stringify(this.mylist));
                    // console.log("lista:"+JSON.stringify(this.mylist));
                    /* if ((list !== null && list !== undefined && list.length>0) || (this.mylist !== null && this.mylist !== undefined && this.mylist.length>0)) {
                         // if (!this.comList && this.comList !== undefined && this.comList !== null && this.comList.length > 0) {
                         this.rootPage = ComlistPage;
                     } else {
                         this.rootPage = ComemptyPage;
                     }
                     */
                } else {
                    console.log("error server:" + JSON.stringify(result));
                    let toast = this.toastCtrl.create({
                        message: "No Network",
                        duration: 2000
                    })
                    toast.present();

                }
            });
        }
        else {
            //è un genitore
        }
        /*
      firebase.database().ref('/assigns').child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
        let loading = this.loadingCtrl.create({
          content: "Please Wait..."
        });
        loading.present();
        if (snapshot) {
          this.mylist = [];
          //    let allfriends = snapshot.val();
  //console.log(snapshot);
          snapshot.forEach( (childsnap) => {
            //if (childsnap)
            // console.log("assigns--:" + JSON.stringify(childsnap));
            if (childsnap) {
              let name = childsnap.val().displayName;
              let master = "";
              let req = JSON.parse(childsnap.val().lista);
              // console.log("assigns-2-:" + JSON.stringify(req));
              if (childsnap.val().master === firebase.auth().currentUser.uid) {
                name = " a "+name;
                master = childsnap.val().master;
              } else {
                name = " da "+name;
                master = childsnap.val().master;
              }
              req.forEach( r => {
                r.displayName = name;
                r.master = master;
                // console.log("assigns-3-:" + JSON.stringify(r));
                //if (r.user === firebase.auth().currentUser.uid){
                  this.mylist.push(r);
               // }
  
              });
             //  console.log("assigns-4-:" + JSON.stringify(this.mylist));
              // this.mylist = req;
  
            }
  
            this.mylist.sort(this.compare);
            // this.events.publish('friends');
            // this.myrequests.push(req);
  
            return false;
          });
          loading.dismiss();
        }
      });
      */
    }


    compare(a, b) {
        if (parseInt(a.comune.sezione) < parseInt(b.comune.sezione))
            return -1;
        if (parseInt(a.comune.sezione) > parseInt(b.comune.sezione))
            return 1;
        return 0;
    }
}
