import { Component } from '@angular/core';
import { App,  NavController, NavParams, LoadingController, ToastController , AlertController} from 'ionic-angular';
import firebase from 'firebase';

import { AboutPage } from '../about/about';
//import { PrivacyPage } from '../privacy/privacy';
import { ProfilePage } from '../profile/profile';
//import { SignEmailPage } from '../sign-email/sign-email';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import { FireauthProvider } from '../../providers/fireauth/fireauth';
import {LoginPage} from "../login/login";
/**
 * Generated class for the AccounttabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-accounttab',
  templateUrl: 'accounttab.html',
})
export class AccounttabPage {
userData:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
              public authservice: FireauthProvider, public app: App, private iab: InAppBrowser, public alertCtrl: AlertController) {
    //this.userData = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid+'-userData'));
      //public authservice: FireauthProvider,
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccounttabPage');
    this.userData = JSON.parse(localStorage.getItem(firebase.auth().currentUser.uid+'-userData'));
  }


  info(){
    this.navCtrl.push(ProfilePage);
  }
  about(){
    this.navCtrl.push(AboutPage);

  }
  privacy(){
    const browser = this.iab.create('http://www.skuolapp.it/informativa-app');
        browser.show()
    //this.navCtrl.push(PrivacyPage);
  }

  logout(){
    localStorage.setItem('enable', "false");
    localStorage.setItem('email', "");
    localStorage.setItem('password', "");
    //this.navCtrl.setRoot(SignEmailPage);
   // this.navCtrl.popToRoot();
   // this.app.getRootNavs()[0].setRoot(SignEmailPage);
   // this.navCtrl = this.app.getRootNavs()[0];
      const userId: string = firebase.auth().currentUser.uid;
      firebase
          .database()
          .ref(`/userProfile/${userId}`)
          .off();
      firebase.auth().signOut();

    this.app.getActiveNav().popToRoot();
    this.app.getRootNavs()[0].setRoot(LoginPage);
   // var nav = this.app.getRootNav();
   // nav.setRoot(LoginPage);

  }


  shownewcreatepass() {
    let createnewpass = this.alertCtrl.create({
      title: 'Cambia Password',
      message: "Inserire nuova password",
      inputs: [
        {
          name: 'new_password',
          placeholder: 'Nuova password',
          type: 'password'

        },
        {
          name: 'confirm_password',
          placeholder: 'Conferma password',
          type: 'password'

        }
      ],
      buttons: [
        {
          text: 'Chiudi',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if ((data.new_password != data.confirm_password) || (data.new_password.length < 5)) {

              let toast = this.toastCtrl.create({
                message: "confirm incorrect or over 5 letter. Try again",
                duration: 2000
              })
              toast.present();
              this.shownewcreatepass();


            } else {
              let createnewpass_data_post = { "new_password": "", "email": "", "status": "" };
              createnewpass_data_post.new_password = data.new_password;
             // createnewpass_data_post.email = this.userData.email;
              let status = "create_new_password";
             // createnewpass_data_post.status = status;
              let loading = this.loadingCtrl.create({
                content: "Please Wait..."
              });
              loading.present();


              this.authservice.passwordupdate(data.new_password);

             /* this.user_provid.postAdminData(this.userData, "login.php").then((result) => {//new create pass in server

                loading.dismiss();

                if (Object(result).status == "success") {


                  console.log("enter server");
                } else {
                  let toast = this.toastCtrl.create({

                    message: "No Network",
                    duration: 2000
                  })
                  toast.present();

                }

              }, (err) => {
                let toast = this.toastCtrl.create({
                  message: "No Network",
                  duration: 2000
                })
                toast.present();
                loading.dismiss();
              });
*/
              //toast.present();
              loading.dismiss();

            }



          }
        }
      ]

    });

    createnewpass.present();
  }



}
