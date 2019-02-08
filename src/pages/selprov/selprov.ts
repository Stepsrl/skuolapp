import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';
import { SelCityPage } from '../selcity/selcity';

/**
 * Generated class for the SelprovPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-selprov',
  templateUrl: 'selprov.html',
})
export class SelprovPage {
  private regactivelists: any;
 // private reglists: any;
  showLevel1 = null;
  showLevel2 = null;
  private codregione: string;
  private codelezione: string;
  private elezione:any;
  private regione:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelprovPage');

    this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
    this.getLocalData();
  }

  ionViewWillEnter(){

    this.codregione = this.navParams.data.regione;
    this.codelezione = this.navParams.data.elezione;
    this.getLocalData();
  }

  getLocalData() {
   // this.http.get('../assets/mock/regioni.json').map(res => res.json()).subscribe(data => {
    this.http.get('assets/mock/regioni.json').map(res => res.json()).subscribe(data => {
      // console.log(data.regioni);
      //this.reglists= data.regioni;
     // this.reglists= data.elezioni;
      //this.reglists= data.elezioni.filter(item => item.code === this.code);
      //console.log("seleziona:"+this.codelezione);
      if (this.codelezione){
        this.elezione = data.elezioni.filter(item => (item.code === this.codelezione && item.active === 'S'))[0];
        //console.log(this.elezione);
        if (this.elezione) {
          this.regione = this.elezione.regioni.filter(item => (item.code === this.codregione && item.active === 'S'))[0];
          if (this.regione) {
            this.regactivelists = this.regione.capoluoghi.filter(item => (item.active === 'S'));
          }
        }
      }



      // console.log(this.reglists);
     // this.getRegActive();
    });

  }


  goCountry(elezione, regione, provincia){
    console.log("seleziona:"+elezione+"-"+regione+"-"+provincia);
    this.navCtrl.push(SelCityPage, {"elezione":elezione,"regione": regione, "provincia": provincia});
  }

  goReg(cod){
    console.log(cod);
    this.navCtrl.push(SelCityPage, {"code": cod});
    //this.getLocalDataReg(cod);
  }

  getLocalDataReg(cod) {
    //this.http.get('../assets/mock/comuni'+cod+'.json').map(res => res.json()).subscribe(data => {
    this.http.get('assets/mock/comuni'+cod+'.json').map(res => res.json()).subscribe(data => {
      //console.log(data.regioni);
      this.regactivelists= data.comuni;
    });

  }
  /*getRegActive(){
    //console.log(JSON.stringify(this.reglists));
    //console.log("attivi:"+this.reglists);

    this.regactivelists=[];
    this.reglists.forEach( e => { console.log("elem:"+e)
      if (e.code == this.code && e.active=='S'){
        var regioni = e.regioni;
        regioni.forEach(r => {
          if (r.active=='S'){
            this.regactivelists.push(r);
          }
        });


        // console.log("attivo:"+r)
      }
    });


  }
*/
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  }
  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  }

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  }
}
