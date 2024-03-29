import { FirebaseProvider } from './../../providers/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, ViewController, AlertController, IonicPage } from 'ionic-angular';
import { LoginProvider } from '../../providers/login';
import { Validator } from '../../validator';

import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { ImageProvider } from '../../providers/image';

import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  
  emailPasswordForm: FormGroup;
  private emailForm: FormGroup;
  img = "http://placehold.it/80X80";

  constructor(public loadingProvider: LoadingProvider, public alertProvider: AlertProvider, 
    public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
    public loginProvider: LoginProvider,  public imageProvider: ImageProvider, 
    public formBuilder: FormBuilder,public alertCtrl: AlertController, public firebaseProvider : FirebaseProvider) 
    {
    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator,
      fullname: Validator.fullnameValidator,
      username: Validator.usernameValidator
    });
    this.emailForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator,
      fullname: Validator.fullnameValidator,
      username: Validator.usernameValidator
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){

    this.loadingProvider.show();
    firebase.auth().createUserWithEmailAndPassword(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"])
      .then((success) => {
        
        //oldway
        let user=firebase.auth().currentUser;
        let dateCreated= new Date();
        firebase.database().ref('accounts/'+user.uid).set({
          dateCreated,
          username: this.emailPasswordForm.value["username"],
          name: this.emailPasswordForm.value["fullname"],
          userId:user.uid,
          email:user.email,
          description:"I am available",
          provider:"Email",
          img:this.img
        });
        
        //newWay
        let username = this.emailPasswordForm.value["fullname"];
        localStorage.setItem(user.uid, username);
        firebase.database().ref('Test_Scuole/Users/Genitori/'+user.uid).set({
          info : {nome_cognome : username}
        });
        localStorage.setItem(user.uid, username)

        this.loadingProvider.hide();
        this.closeModel();
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  closeModel(){
    this.viewCtrl.dismiss();
  }
}
