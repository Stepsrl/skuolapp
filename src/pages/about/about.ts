import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

//import { AppVersion } from '@ionic-native/app-version';
//import { Storage } from '@ionic/storage';
/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
private version:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.version ="v.1.0"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');

    this.version = localStorage.getItem('version');
  /*  if (!document.URL.startsWith('http')) {
      this.appVersion.getVersionNumber().then(versione => {
        this.version = versione;
      });
    } else {
      this.version = "brow. 1.1";
    }
    */

  }

}
