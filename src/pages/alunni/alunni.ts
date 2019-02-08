import { Component , ViewChild} from '@angular/core';
import {NavController, NavParams, Content, LoadingController, ToastController, App} from 'ionic-angular';
import firebase from "firebase";
import {FirstproviderProvider} from "../../providers/firstprovider/firstprovider";
import {MessagePage} from "../message/message";
import {DataProvider} from "../../providers/data";
import {SelelezPage} from "../selelez/selelez";
import {AngularFireDatabase} from "angularfire2/database";
import { Observable } from 'rxjs';

/**
 * Generated class for the AlunniPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-alunni',
  templateUrl: 'alunni.html',
})
export class AlunniPage {
    @ViewChild(Content) content: Content;
    myscool: any;
    private list: any;
     mylist: any;
     parentsConfirmedList: Observable<any>;
    private messaggio: string;
    private classe: string;
    isDocente:string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public loadingCtrl: LoadingController, public user_provid: FirstproviderProvider
        , public dataProvider: DataProvider, public toastCtrl: ToastController,public angularfire: AngularFireDatabase) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AlunniPage');
    }

    ionViewWillEnter() {
        this.content.resize();
        this.myscool = this.navParams.data.scuola;
      //  console.log("classealunni:" + JSON.stringify(this.myscool));
        //console.log("classealunni:" + JSON.stringify(this.myscool));
       // console.log("professori:" + JSON.stringify(this.myscool.classe.professori));
        this.classe = this.myscool.scuola.codice_scuola + '_' + this.myscool.indirizzo.id + '_' + this.myscool.sezione.id + '_' + this.myscool.classe.id;

        this.list = this.myscool.scuola.studenti;
        console.log("lista:" + JSON.stringify(this.list));

        console.log("PROFESSORI: " +JSON.stringify(this.myscool.scuola.professori));

        if (this.list === null || this.list == undefined) {
            this.loadServer();
        } else {
            this.mylist = this.list;
        }

        if (firebase.auth().currentUser.uid.startsWith("DDD-")) {
          this.isDocente ="S";
          this.loadConfirmedParents();
        } else {
            this.isDocente="N";
        }

      /*  console.log("parenti:" + JSON.stringify(this.mylist));
        if (!firebase.auth().currentUser.uid.startsWith("DDD-")) {
            //visualizza solo la lista degli alunni collegati al genitore
            let lista=[];
            this.mylist.forEach(r => {
                if (r.parents != null && r.parents.length>0){
                    let cerca = 0;
                    //console.log ("parnts:"+JSON.stringify(r.parents)) ;
                    while (cerca < r.parents.length){
                        if (r.parents[cerca].$key == firebase.auth().currentUser.uid){
                            cerca = 9999;
                        }
                        cerca++;
                    }
                    if (cerca > 9998){

                        lista.push(r);
                    }

                }
            });
            this.mylist = lista;
        }
        let lista=[];
        this.mylist.forEach(r => {
            console.log("lista:"+JSON.stringify(r));
            if (r.parents != null && r.parents.length>0){
                let cerca = 0;
                while (cerca < r.parents.length){

                    let parente = r.parents[cerca];
                    console.log("parenti:"+JSON.stringify(parente));
                    parente.unreadMessagesCount=0;
                        console.log('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.classe+"/"+r.id+"/"+parente.$key);
                        firebase.database().ref('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.classe + "/" + r.id + "/" + parente.$key).once('value').then((snap) => {
                            if (snap.val() != null) {
                               firebase.database().ref('/conversations/' + snap.val().conversationId + '/messages').on('value', snap2 => {
                                    if (snap2.val() != null) {
                                       parente.unreadMessagesCount = snap2.val().length - snap.val().messagesRead;
                                    }
                                });
                            }

                        });
                            cerca++;
                }
            }
        });*/
    }

    chat() {


    }
    /* Proceed to chat page.
    message(userId, professore={"id":0}) {
       // this.app.getRootNav().push(MessagePage, { userId: userId, classe: this.classe, professore: professore });

        this.navCtrl.push(MessagePage, { userId: userId, classe: this.myscool, professore: professore });
    }
*/

    loadServer() {


        let mylist = [];
        //let friendsuid = [];
        if (firebase.auth().currentUser.uid.startsWith("DDD-")) {
//se insegnante
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
                "classe_id": this.myscool.classe.id
            }
            this.user_provid.postAdminData(dati, "classe").then((result) => {

                loading.dismiss();
//console.log(JSON.stringify(result));
                if (Object(result).status == "success") {

                    this.messaggio = null;
                 //   console.log("enter server:" + JSON.stringify(result));
                    //let scuola = Object(result).docente.scuola;

                    let classi = Object(result).classe.studenti;

                    // console.log("rirotrno:" + JSON.stringify(Object(result).docente));
                    //console.log("scuola:" + JSON.stringify(scuola));
                   // console.log("classi:" + JSON.stringify(classi));
                    //this.listasindaci = Object(result).elezioni.sindaci;
                    //localStorage.setItem(firebase.auth().currentUser.uid+'-'+cod, JSON.stringify(this.listasindaci));
                    //localStorage.setItem(this.master+'-'+cod, JSON.stringify(this.listasindaci));
                    //this.getVoti();
                    //console.log("lista-PRE:" + JSON.stringify(this.mylist));
//let scuolaTemp;
                    classi.forEach(r => {
                        //carica i parenti del alunno
                        let parents = [];
                        // Get user data on
                        // database and get list of friends.
                        // this.dataProvider.getCurrentClass(this.codice).snapshotChanges().subscribe((account) => {
                        this.dataProvider.getUser(r.id).snapshotChanges().subscribe((account) => {

                            //     this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
//console.log(JSON.stringify(r)+"--"+r.id+"--"+JSON.stringify(account));
                            if (account.payload.val()!= null && account.payload.val().parents != null) {
                                for (var i = 0; i < account.payload.val().parents.length; i++) {
                                    //  console.log("acc:"+account.payload.val().friends[i]);
                                    this.dataProvider.getUser(account.payload.val().parents[i].user).snapshotChanges().subscribe((parent) => {
                                        // console.log(this.codice+"--"+JSON.stringify(friend));
                                        if(parent.key != null){
                                            let friendData = { $key: parent.key, ... parent.payload.val()};
                                            parents.push(friendData);
                                        }
                                    });
                                }
                            } else {
                                parents = [];
                            }
                            //this.loadingProvider.hide();
                            r.parents = parents;
                            mylist.push(r);
                        });

                    });
                    this.myscool.classe.alunni = mylist;

                     console.log("lista-POST:" + JSON.stringify(this.myscool));
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
        } else {


        }
    }

    loadConfirmedParents(){
        this.parentsConfirmedList = this.dataProvider.getConfirmedRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges()
                .map(request => request.map(c => ({'id':c.key, ...c.payload.val()})));

        this.parentsConfirmedList.forEach(c => console.log(c)); //non cancellare firebase è troppo veloce 
    }

    startConversation(item, isProf){
        this.navCtrl.push(MessagePage, { classe: this.myscool, itemDest : item , isProf : isProf});
    }
}
