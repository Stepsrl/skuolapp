import { Component , ViewChild} from '@angular/core';
import {NavController, NavParams, Content, AlertController, ToastController} from 'ionic-angular';

import firebase from 'firebase';

/**
 * Generated class for the SelclassePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { ComlistPage } from '../comlist/comlist';
import {FirebaseProvider} from "../../providers/firebase";
export class Dato {
  id: string;
  nome: string;
}

@Component({
  selector: 'page-selclasse',
  templateUrl: 'selclasse.html',
})
export class SelclassePage {
  @ViewChild(Content) content: Content;

  private myscool:any;
  private messaggio:string;
  //private alert: any;
  private list : any;
  private item:any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public firebaseProvider: FirebaseProvider, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelclassePage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter SelclassePage');
    this.content.resize();
    this.myscool = this.navParams.data.scuola;
    this.item = this.navParams.data.item;
   // console.log("scuolaM:"+JSON.stringify(this.myscool.codice_scuola));
    //  console.log("indirizzoM:"+JSON.stringify(this.myscool.indirizzo));
    //  console.log("sezioneM:"+JSON.stringify(this.myscool.sezione));
              this.messaggio = "";
    this.getScuola();
  }

  getScuola(){
    this.list = [];
    if (this.item.classi){
      this.list = this.item.classi;
        //console.log("lista:"+JSON.stringify(this.item.classi));

        let listAssegante = [];
        if (localStorage.getItem(firebase.auth().currentUser.uid + '-ScomData') && localStorage.getItem(firebase.auth().currentUser.uid + '-ScomData') !== undefined && localStorage.getItem(firebase.auth().currentUser.uid + '-ScomData') !== null) {
            //create item
            //console.log("aggiunge");

            var listaAssegnate = localStorage.getItem(firebase.auth().currentUser.uid + '-ScomData');
            listAssegante = JSON.parse(listaAssegnate);
        }

            this.item.classi.forEach( (classe)=> {
            //segno quelle gia associate
//console.log("lista:"+JSON.stringify(list));
                    classe.segnato = "N";
                if (listAssegante != null) {
                    //console.log("lista Attuale:"+JSON.stringify(list));

                    listAssegante.forEach((childsnap) => {
                        if (childsnap) {
                            // console.log("scuola:"+JSON.stringify(childsnap));
                            if (this.myscool.codice_scuola == childsnap.codice_scuola && this.myscool.indirizzo.id ==childsnap.indirizzo.id && this.myscool.sezione.id == childsnap.sezione.id) {
                                /*console.log("scuola:" + JSON.stringify(childsnap.codice_scuola));
                                console.log("indirizzo:" + JSON.stringify(childsnap.indirizzo));
                                console.log("sezione:" + JSON.stringify(childsnap.sezione));
                                console.log("classe:" + JSON.stringify(childsnap.classe));
                                */
                                if (classe.id == childsnap.classe.id){
                                  //segno come gia assegnato
                                   // console.log("classe:" + JSON.stringify(classe));
                                    classe.segnato = "S";
                                    //console.log("classe:" + JSON.stringify(classe));

                                }
                            }


                        }

                        return false;
                    });


                }

                return false;
        }
        );
       // console.log("classi modificate:" + JSON.stringify(this.item.classi));


    }

  }

  addClasse(item){
    //console.log("Add classe:"+JSON.stringify(item));
      if (item.segnato == "N") {
          let indirizzo: Dato;
          indirizzo = new Dato;
          indirizzo.id = item.id;
          indirizzo.nome = item.nome;
          this.myscool.classe = item;
          this.myscool.scuola.indirizzi = null;
          this.myscool.stato = "requestSent";
          //console.log("scuola:"+JSON.stringify(this.myscool));

          
          this.sendFriendRequest(this.myscool);
          //this.navCtrl.setRoot(ComlistPage);
      }
  }

  // Send friend request.
    sendFriendRequest(classe) {
      //demo_4_c_55
        let codice= classe.codice_scuola+"_"+classe.indirizzo.id+"_"+classe.sezione.id+"_"+classe.classe.id;
        //console.log("codice:"+codice);

        let alert = this.alertCtrl.create({
            title: 'Segui Classe',
            message: 'Inserisci nome e cognome dello studente',
            inputs: [
              {
                name: 'note',
                placeholder: 'Nome Cognome'
              }
            ],
            buttons: [
                {
                    text: 'Annulla',
                    role: 'cancel',
                    handler: data => { }
                },
                {
                    text: 'Conferma',
                    handler: data => {
                      if (!data || !data.note || data.note == "") {
                        this.toastCtrl.create({
                          message: 'Il campo \"Nome Cognome\" non puo\' essere vuoto',
                          duration: 2000,
                          dismissOnPageChange: true,
                          position: 'top'                          
                        }).present();
                        
                        return false
                      }
                      
                      //this.firebaseProvider.sendFriendRequest(codice);
                      this.firebaseProvider.sendClassRequest(classe.codice_scuola, classe.classe.id, data.note);
                      this.store(classe);

                      this.navCtrl.setRoot(ComlistPage);
                    }
                }
            ]            
        });
        alert.handleOrientationChange
        alert.present();


    }

  store(val) {
    let list = [];
     // console.log("lista:"+JSON.stringify(val));

   //   codice_scuola":"SCUOLATEST","indirizzo":{"id":1,"nome":"Ragioneria"},"sezione":{"id":"A","nome":"A"},"classe":{"id":25,"nome":2


    if (localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData')) {
      //create item
      //console.log("aggiunge");

      var lista = localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData');
      list = JSON.parse(lista);
//console.log("lista:"+JSON.stringify(list));
      if (list != null) {
        //verificare se scuola gia' presente


        list.push(val);
        localStorage.setItem(firebase.auth().currentUser.uid+'-ScomData', JSON.stringify(list));
      }
      else {
        list = [];
        list.push(val);
        localStorage.setItem(firebase.auth().currentUser.uid+'-ScomData', JSON.stringify(list));
      }

    } else {
      // console.log("nuovo");
      list = [];
      list.push(val);
      localStorage.setItem(firebase.auth().currentUser.uid+'-ScomData', JSON.stringify(list));

    }
  }

}
