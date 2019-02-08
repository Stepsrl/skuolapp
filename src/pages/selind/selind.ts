import { Component , ViewChild} from '@angular/core';
import {  NavController, NavParams ,  LoadingController, ToastController,Content} from 'ionic-angular';
//import {Http} from '@angular/http';
//import firebase from 'firebase';
//import { Events } from 'ionic-angular';

import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';

/**
 * Generated class for the SelindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { SelsezPage } from '../selsez/selsez';

export class Dato {
  id: string;
  nome: string;
}
export class MySkool {
  id: string;
  codice_scuola: string;
  scuola: any;
  indirizzo: any;
  sezione:any;
  classe: any;
}



@Component({
  selector: 'page-selind',
  templateUrl: 'selind.html',
})
export class SelindPage {
  @ViewChild(Content) content: Content;
  private scuola:any;
  private messaggio:string;
  private myscool:MySkool;
  private list : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public toastCtrl: ToastController, public loadingCtrl: LoadingController, public user_provid: FirstproviderProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelindPage');
  }


  ionViewWillEnter() {
    this.content.resize();
    this.scuola = this.navParams.data.scuola;
    this.myscool = new MySkool;
    this.myscool.scuola = this.scuola;
    console.log("scuola:"+JSON.stringify(this.myscool));
    this.getScuola();
  }

  getScuola(){
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    //this.scuoladett = [];
    this.messaggio = "Nessun dato presente";
    //http://www.placeafe.it/apis_contavoti/liste_by_comune.php
    let dati = {
      "username" :"apiusername",
      "password" :"apipassword",
      "codice_scuola" : this.scuola.codice_scuola
    }
    this.user_provid.postAdminData(dati, "scuola").then((result) => {

      loading.dismiss();

      if (Object(result).status == "success") {

        this.messaggio = null;
          console.log("enter server:"+JSON.stringify(result));
       // this.scuola.info = Object(result).scuola;
        this.myscool.scuola = Object(result).scuola;
        this.myscool.id = this.scuola.id;
        this.myscool.codice_scuola = this.scuola.codice_scuola;
       // console.log("dettaglio scuola:"+JSON.stringify(this.scuola));
        if (this.myscool.scuola.indirizzi){
          this.list = this.myscool.scuola.indirizzi[0];
        } else {
          this.list = [];
        }




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

  goSezione(item){
    console.log("Sezione:"+JSON.stringify(item));
    let indirizzo: Dato;
    indirizzo = new Dato;
    indirizzo.id = item.id;
    indirizzo.nome = item.nome;
    this.myscool.indirizzo = indirizzo;

    this.navCtrl.push(SelsezPage, {"scuola": this.myscool, "item":item});
  }

}
