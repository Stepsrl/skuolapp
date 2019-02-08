import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
//import { SelCountryPage } from '../selcountry/selcountry';
import { SelelezPage } from '../selelez/selelez';
/**
 * Generated class for the ComemptyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-comempty',
  templateUrl: 'comempty.html',
})
export class ComemptyPage {
  userData:any
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userData = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid+'-userData'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComemptyPage');
  }
  addList() {
    this.navCtrl.push(SelelezPage);

  }
}
