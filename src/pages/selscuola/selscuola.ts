import { Component , ViewChild} from '@angular/core';
import {  NavController, NavParams , LoadingController, AlertController, ToastController, Content} from 'ionic-angular';
import {Http} from '@angular/http';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';

import { SelindPage } from '../selind/selind';

/**
 * Generated class for the SelscuolaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-selscuola',
  templateUrl: 'selscuola.html',
})
export class SelscuolaPage {
  @ViewChild(Content) content: Content;
  private scuolelist:any;

  private comune:any;
  private codComune:any;
  private datiscuole:any;
  private messaggio:string;

  constructor(public navCtrl: NavController, public user_provid: FirstproviderProvider,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController,
              public navParams: NavParams, public http: Http, public events:Events, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelscuolaPage');
  }

  ionViewWillEnter(){
    this.content.resize();
    /*this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
    this.codprovincia = this.navParams.data.provincia;
    var lista = localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData');
    // console.log("lista scelte:"+JSON.stringify(lista));
    if (lista === undefined || lista === null){
      this.list = [];
    } else {
      this.list = JSON.parse(lista);
    }
    */
    this.scuolelist = [];
//console.log("comune scelta:"+JSON.stringify(this.navParams.data));
    this.codComune = this.navParams.data.comune;
    this.comune = this.navParams.data.ogg;
   // this.getLocalDataReg(this.codelezione,this.codregione,this.codprovincia);

    this.getLocalDataReg();

  }

  goSkuola(item){
    //console.log("scuola selezionata:"+JSON.stringify(item));
   // this.navCtrl.push(SelindPage, {"scuola": item});
    if (item.gradi!== undefined && item.gradi!== null) {

      this.scuolelist = Object(item).gradi;

    } else if (item.scuole!== undefined && item.scuole!== null) {

      this.scuolelist = Object(item).scuole;

    } else if (item.codice_scuola!== undefined && item.codice_scuola!== null) {
      this.navCtrl.push(SelindPage, {"scuola": item});
    }

  }

  getLocalDataReg() {
    //  localStorage.setItem(firebase.auth().currentUser.uid+'-'+cod, "");
    //  localStorage.clear();
    var cod = this.codComune;
     console.log("find:"+cod);
    this.datiscuole = [];
    var listacandidati = "";
    if(this.codComune) {

      listacandidati = localStorage.getItem(firebase.auth().currentUser.uid+'-'+cod);
      //listacandidati = localStorage.getItem(this.master+'-'+this.codComune);
    //  console.log("candidatilocali:"+JSON.stringify(listacandidati));
      if (listacandidati !== undefined && listacandidati !== null && listacandidati !== "null" ) {
        // console.log("candidatilocali:"+JSON.stringify(listacandidati));

        this.datiscuole = JSON.parse(listacandidati);
        //console.log("candidatilocali:"+JSON.stringify(this.datisindaci));
        //this.getVoti();
      } else {
        //carica da Json

        //console.log("candidatilocali:caricajson");
        //this.http.get('../assets/mock/sindaci.json').map(res => res.json(),

        // this.userData = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid+'-userData'));


        // this.elezione.elezione+"-"+this.elezione.code
        this.http.get('assets/mock/sindaci.json').map(res => res.json(),
                error => console.log("errore")).subscribe(data => {
             // this.datiscuole = data.elezioni.filter(item => (item.codelezione === this.codComune))[0];
              if (this.scuolelist && this.scuolelist.length > 0) {
              //  console.log("carica scuole:"+JSON.stringify(this.scuolelist));
                //this.listasindaci = this.scuolelist.sindaci;
                // localStorage.setItem(firebase.auth().currentUser.uid+'-'+cod, JSON.stringify(this.listasindaci));
               // localStorage.setItem(this.master+'-'+cod, JSON.stringify(this.listasindaci));
                //this.getVoti();
              } else {
                //cerca sul server
              //  console.log("carica scuole server:");
                //chiama api di mario
                let loading = this.loadingCtrl.create({
                  content: "Please Wait..."
                });
                loading.present();
                this.scuolelist = [];
                this.messaggio = "Nessun dato presente";
                //http://www.placeafe.it/apis_contavoti/liste_by_comune.php
                let dati = {
                  "username" :"apiusername",
                "password" :"apipassword",
                "codice_comune" : cod
                }
                this.user_provid.postAdminData(dati, "scuole").then((result) => {

                  loading.dismiss();

                  if (Object(result).status == "success") {

                    this.messaggio = null;
                  //  console.log("enter server:"+JSON.stringify(result));
                    this.scuolelist = Object(result).scuole;
                    //this.listasindaci = Object(result).elezioni.sindaci;
                    //localStorage.setItem(firebase.auth().currentUser.uid+'-'+cod, JSON.stringify(this.listasindaci));
                    //localStorage.setItem(this.master+'-'+cod, JSON.stringify(this.listasindaci));
                    //this.getVoti();
                  } else {
                    console.log("error server:"+JSON.stringify(result));
                    let toast = this.toastCtrl.create({

                      message: "No Network",
                      duration: 2000
                    })
                    toast.present();

                  }

                }, (err) => {
                  console.log("error server:"+JSON.stringify(err));
                  let toast = this.toastCtrl.create({
                    message: "No Network",
                    duration: 2000
                  })
                  toast.present();
                  loading.dismiss();
                });



              }
            });
      }
    }

  }
  /*
    name='username' value='apiusername'>
    name='password' value='apipassword'>
    name='codice_comune' value='3-15-51-80'> Boscoreale

   */


}
