import { Component } from '@angular/core';
import {  NavController, NavParams, AlertController } from 'ionic-angular';
//import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Http} from '@angular/http';
import firebase from 'firebase';
import { ComlistPage } from '../comlist/comlist';
import { SelscuolaPage } from '../selscuola/selscuola';
/**
 * Generated class for the SelCityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class EleSelect {
    code: string;
    elezione: any;
    comune:any;
    codMaster: string;
}


@Component({
  selector: 'page-selcity',
  templateUrl: 'selcity.html',
})
export class SelCityPage {

  private regactivelists: any;
  private reglists: any;
  showLevel1 = null;
  //private code:any;
private messaggio:string;
  private codregione: string;
  private codelezione: string;
  private codprovincia: string;
private list:any;
  private elezione:any;
 // private regione:any;
 // private provincia:any;
 //private comuni: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController) {

    this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
    this.codprovincia = this.navParams.data.provincia;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectCityPage');
    this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
    this.codprovincia = this.navParams.data.provincia;
    this.getLocalDataReg(this.codelezione,this.codregione,this.codprovincia);
  }

  ionViewWillEnter(){
    this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
    this.codprovincia = this.navParams.data.provincia;
      var lista = localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData');
     // console.log("lista scelte:"+JSON.stringify(lista));
      if (lista === undefined || lista === null){
          this.list = [];
      } else {
          this.list = JSON.parse(lista);
      }

//console.log("lista scelte:"+JSON.stringify(this.list));
      this.getLocalDataReg(this.codelezione,this.codregione,this.codprovincia);
  }

    addCom(ogg, cod) {
      //  console.log("coume:" + cod);
       // console.log("coume obj:" + JSON.stringify(ogg));
        //selezione sezione

        //ogg.SEZIONITOTALI
        this.showSezione(ogg, cod);

    }

    goSchool(ogg, cod){
        console.log("seleziona:"+ogg+cod);
        this.navCtrl.push(SelscuolaPage, {"ogg":ogg,"comune": cod});
    }


  addComune(ogg, cod){
  //  console.log("coume:"+cod);
  //  console.log("coume obj:"+JSON.stringify(ogg));
      //selezione sezione

      //ogg.SEZIONITOTALI
     // this.showSezione(ogg.SEZIONITOTALI);

      let createnewpass = this.alertCtrl.create({
          title: 'Aggiungi',
          message: "Aggiungi all'elenco dei preferiti?",
          buttons: [
              {
                  text: 'Conferma',
                  handler: data => {
                      let ele : EleSelect;
                      ele = new EleSelect;
                      ele.code =cod;
                      ele.elezione = this.codelezione;
                      ele.comune = ogg;
                      // localStorage.setItem('comData', "");
                      // this.getLocalDataReg(cod);
                      this.store(ele);
                      //console.log(JSON.stringify(localStorage.getItem('comData')));

                      this.navCtrl.setRoot(ComlistPage);


                  }
              },
              {
                  text: 'Annulla',
                  handler: data => {

                  }
              }
          ]
      });

      createnewpass.present();

  }
  store(val) {
    let list = [];
    if (localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData') && localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData') !== undefined && localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData') !== null) {
      //create item
      //console.log("aggiunge");

     var lista = localStorage.getItem(firebase.auth().currentUser.uid+'-ScomData');
        list = JSON.parse(lista);
//console.log("lista:"+JSON.stringify(list));
      if (list != null) {
          //verificare se comune gia' presente
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

  getLocalDataReg(codelezione, codregione, codprovincia) {
    var cod = codelezione+"-"+codregione+"-"+codprovincia;
     // console.log("find:"+cod);
    this.regactivelists = [];
     // var tempcomuni =[];
    if(cod) {
       // this.http.get('../assets/mock/comuni.json').map(res => res.json(),
      this.http.get('assets/mock/comuni.json').map(res => res.json(),
              error => console.log("errore")).subscribe(data => {
          //  console.log(data);
          //  console.log(data.elezioni);

           // this.elezione = data.elezioni.filter(item => (item.codelezione === cod))[0];
              this.elezione = data.elezioni.filter(item => (item.codelezione === codelezione))[0];
             if (this.elezione){
                // console.log("leezi:"+this.elezione);
               //  console.log("leezi:"+this.elezione.codelezione);
                // console.log("leezi:"+this.elezione.comuni);
               //  console.log("listacomuni:"+JSON.stringify(this.elezione.comuni));
                // tempcomuni = this.elezione.comuni;
    //             this.regactivelists= this.elezione.comuni.filter(item => (parseInt(item.regione) === parseInt(codregione) && parseInt(item.provincia)===parseInt(codprovincia)));
                 this.regactivelists= this.elezione.comuni.filter(item => (parseInt(item.regione) === parseInt(codregione) && item.provincia===codprovincia));

                // console.log("listacomuni:"+JSON.stringify(this.regactivelists));
                // console.log("cerca:"+r.REGIONE +"--"+codregione +";;"+ r.PROVINCIA+"::"+codprovincia);
                /* this.elezione.comuni.forEach( r => {
                     //console.log("elem:"+JSON.stringify(r));
                     console.log("cerca:"+r.REGIONE +"--"+codregione +";;"+ r.PROVINCIA+"::"+codprovincia);
                     console.log(parseInt(r.REGIONE) === parseInt(codregione));
                     console.log(r.PROVINCIA===codprovincia);
                        if(parseInt(r.REGIONE) === parseInt(codregione) && parseInt(r.PROVINCIA)===parseInt(codprovincia)){
                            console.log("push");
                            this.regactivelists.push(r);
                        }

                     // console.log("attivo:"+r)

                 });
                 console.log("listacomuni 2:"+JSON.stringify(this.regactivelists));
*/
                 // this.regactivelists =this.elezione.comuni;
             } else {
                 this.regactivelists = [];
                 this.messaggio = "Nessn dato presente";
             }


          });
    }

  }

  getRegActive(){
    //console.log(JSON.stringify(this.reglists));
    //console.log("attivi:"+this.reglists);

    this.regactivelists=[];
    this.reglists.forEach( r => {
    //  console.log("elem:"+r)
    if (r.active=='S'){
      this.regactivelists.push(r);
     // console.log("attivo:"+r)
    }
    });


  }

    showSezione(item, code) {
        let alert = this.alertCtrl.create();

        alert.setTitle('Sezione');
        let userData = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid+'-userData'));
        //var type = "";
        if (userData.user_type === "M") {

            alert.addInput({
                label: 'Master',
                value: 'M',
                type: 'radio', // here the error,
                checked: true
            });

            alert.addInput({
                label: 'Visualizza',
                value: 'V',
                type: 'radio', // here the error,
                checked: false
            });
        } else {

            for (let sss = 1; sss <= item.SEZIONITOTALI; sss++) {
                var testo = 'Sezione ' + sss;
                if(  this.cercaSezione(item, ''+sss) == 1 ) {
                    alert.addInput({
                        label: testo,
                        value: '' + sss,
                        type: 'radio' // here the error
                    });
                }
            }
        }
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
               // console.log(data);
                //alert.dismiss();
                //this.sezione=data;
                item.sezione = data;

                let ele : EleSelect;
                ele = new EleSelect;
                ele.code =code;
                ele.elezione = this.codelezione;
                ele.comune = item;
                if (data === "V"){
                    this.showNumber(ele, "Codice");
                    //ele.codMaster = "";
                } else {
                    this.store(ele);
                    this.navCtrl.setRoot(ComlistPage);
                }

                // localStorage.setItem('comData', "");
                // this.getLocalDataReg(cod);

                //console.log(JSON.stringify(localStorage.getItem('comData')));



               // this.addComune(item, code);
            }
        });

        alert.present();
    }

    cercaSezione(item, numSez){
        //cerca la sezione in quelle gia' selezionate
        var cod = item.ZONA+"-"+item.REGIONE+"-"+item.PROVINCIA+"-"+item.cod;
        var ret = 1;
        this.list.forEach( r => {

                if (r.code==cod && r.comune.sezione == numSez){
                    ret= 0;
                }
        });
        return ret;
    }

    showNumber(item, label) {
        let alert = this.alertCtrl.create();

        alert.setTitle(label);

        alert.addInput({
            name: 'numvoti',
            placeholder: label,
            type: 'string' // here the error
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                //console.log(JSON.stringify(item));
                item.master = this.reverseString(data.numvoti);
                item.displayName ="Visualizzazione";
                this.store(item);
                this.navCtrl.setRoot(ComlistPage);
               // this.setVoto(item, parseInt(data.numvoti));
            }
        });

        alert.present();
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
}
