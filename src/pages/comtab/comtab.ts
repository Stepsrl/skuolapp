import {Component, ViewChild} from '@angular/core';
import {Content, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import firebase from 'firebase';
import { ComemptyPage } from '../comempty/comempty';
import { ComlistPage } from '../comlist/comlist';
import {FirstproviderProvider} from "../../providers/firstprovider/firstprovider";
/**
 * Generated class for the ComtabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-comtab',
  templateUrl: 'comtab.html',
})
export class ComtabPage {

//  @ViewChild(Content) content: Content;
  rootPage;

 // private comList:any;
  private mylist:any;
    private messaggio:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user_provid: FirstproviderProvider,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }
    ionViewDidLoad() {
      //  this.content.resize();
        console.log('ionViewDidLoad ComtabPage');
        this.loadServer();
    }

  ionViewWillEnter() {
     // this.content.resize();
    console.log('ionViewWillEnter ComtabPage');

    //this.comList = localStorage.getItem('comData');
    //console.log(this.comList);
   // this.loadServer();

  }

  loadServer(){
    this.mylist = [];
    //let friendsuid = [];


     //carica le classi assegnate per il docente
      if (firebase.auth().currentUser.uid.startsWith("DDD-")) {

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
                  let scuola = Object(result).docente.scuola;

                  let classi = Object(result).docente.classi;

                 // console.log("scuola:" + JSON.stringify(scuola));
                 // console.log("classi:" + JSON.stringify(classi));
                  //this.listasindaci = Object(result).elezioni.sindaci;
                  //localStorage.setItem(firebase.auth().currentUser.uid+'-'+cod, JSON.stringify(this.listasindaci));
                  //localStorage.setItem(this.master+'-'+cod, JSON.stringify(this.listasindaci));
                  //this.getVoti();
                  classi.forEach( r => {
                     // console.log("assigns-3-:" + JSON.stringify(r));
                      // if (r.user === firebase.auth().currentUser.uid){
                      this.mylist.push(r);
                      // }

                  });
                 // console.log("lista-:" + JSON.stringify(this.mylist));
                  //console.log("lista:"+JSON.stringify(this.mylist));
                  if  (this.mylist !== null && this.mylist !== undefined && this.mylist.length>0) {
                      // if (!this.comList && this.comList !== undefined && this.comList !== null && this.comList.length > 0) {
                      this.rootPage = ComlistPage;
                  } else {
                      this.rootPage = ComemptyPage;
                  }

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
          let list;
          
          var lista = localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData');
          if (lista !== null  && lista !== "") {
              list = JSON.parse(lista);
          }


          //console.log("lista-:" + JSON.stringify(this.mylist));
          //console.log("lista:"+JSON.stringify(this.mylist));
          if ((list !== null && list !== undefined && list.length>0) || (this.mylist !== null && this.mylist !== undefined && this.mylist.length>0)) {
              // if (!this.comList && this.comList !== undefined && this.comList !== null && this.comList.length > 0) {
              this.rootPage = ComlistPage;
          } else {
              this.rootPage = ComemptyPage;
          }

      }

//      loading.dismiss();
   /* firebase.database().ref('/assigns').child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      if (snapshot) {
        //    let allfriends = snapshot.val();
//console.log(JSON.stringify(snapshot));
        snapshot.forEach( (childsnap) => {
          //if (childsnap)
          // console.log("assigns--:" + JSON.stringify(childsnap));
          if (childsnap) {
            let req = JSON.parse(childsnap.val().lista);
            // console.log("assigns-2-:" + JSON.stringify(req));
            req.forEach( r => {
              // console.log("assigns-3-:" + JSON.stringify(r));
             // if (r.user === firebase.auth().currentUser.uid){
                this.mylist.push(r);
             // }

            });
            // console.log("assigns-4-:" + JSON.stringify(this.mylist));
            // this.mylist = req;

          }
          // this.events.publish('friends');
          // this.myrequests.push(req);
          return false;
        });

      }

      var lista = localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData');
      if (lista !== null  && lista !== "") {
        list = JSON.parse(lista);
      }


        console.log("lista-:" + JSON.stringify(this.mylist));
      //console.log("lista:"+JSON.stringify(this.mylist));
      if ((list !== null && list !== undefined && list.length>0) || (this.mylist !== null && this.mylist !== undefined && this.mylist.length>0)) {
        // if (!this.comList && this.comList !== undefined && this.comList !== null && this.comList.length > 0) {
        this.rootPage = ComlistPage;
      } else {
        this.rootPage = ComemptyPage;
      }
    });
   */
  }

}
