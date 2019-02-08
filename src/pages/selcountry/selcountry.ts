import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
//import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {Http} from '@angular/http';
//import { SelCityPage } from '../selcity/selcity';

import { SelprovPage } from '../selprov/selprov';

/**
 * Generated class for the SelCountryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-selcountry',
  templateUrl: 'selcountry.html',
})

export class SelCountryPage {
  private elezione:any;
  private regactivelists: any;
  private reglists: any;
  showLevel1 = null;
  showLevel2 = null;
  private codelezione: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.codelezione = this.navParams.data.code;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelCountryPage');
    this.codelezione = this.navParams.data.code;
    this.getLocalData();
  }

  ionViewWillEnter(){
    this.codelezione = this.navParams.data.code;
    this.getLocalData();
  }

  getLocalData() {
   // this.http.get('../assets/mock/regioni.json').map(res => res.json()).subscribe(data => {
    this.http.get('assets/mock/regioni.json').map(res => res.json()).subscribe(data => {
     // console.log(data.regioni);
      //this.reglists= data.regioni;
     // this.reglists= data.elezioni;
      this.elezione = data.elezioni.filter(item => (item.code === this.codelezione && item.active === 'S'))[0];
      this.regactivelists= this.elezione.regioni.filter(item => (item.active === 'S'));


     // this.regactivelists = this.reglists.regioni;
     // console.log(this.regactivelists);
      //console.log(this.regactivelists);
     // this.getRegActive();
    });

  }

  goCountry(elezione, regione){
  //  console.log("seleziona:"+elezione+"-"+regione);
    this.navCtrl.push(SelprovPage, {"elezione":elezione,"regione": regione});
  }



  /*  goReg(cod){
      console.log(cod);
      this.navCtrl.push(SelCityPage, {"code": cod});
      //this.getLocalDataReg(cod);
    }
  */
/*  getLocalDataReg(cod) {
    this.http.get('../assets/mock/comuni'+cod+'.json').map(res => res.json()).subscribe(data => {
      //console.log(data.regioni);
      this.regactivelists= data.comuni;
    });

  }
  */
  getRegActive(){
    //console.log(JSON.stringify(this.reglists));
    //console.log("attivi:"+this.reglists);

    this.regactivelists=[];
    this.reglists.forEach( e => {
     // console.log("elem:"+e)
    //if (e.code == this.code && e.active=='S'){
      var regioni = e.regioni.filter(item => (item.active === 'S'));
      this.regactivelists = regioni;
      /*regioni.forEach(r => {
        //if (r.active=='S'){
          this.regactivelists.push(r);
        //}
      });
*/

     // console.log("attivo:"+r)
    //}
    });


  }

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
