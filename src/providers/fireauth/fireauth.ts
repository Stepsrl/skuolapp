import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
//import { usercreds } from '../../models/interface/usercreds';
import firebase from 'firebase';



/*
  Generated class for the FireauthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireauthProvider {
  //firedata = firebase.database().ref('/chatusers');
  firedata = firebase.database().ref('/users');
  //firedata = firebase.database();
  constructor(public afireauth: AngularFireAuth) {


  }
  login(credentials) {
    //console.log('call login firebase');
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {

        if (!this.afireauth.auth.currentUser.emailVerified) {
         // let user = firebase.auth().currentUser;
          //user.sendEmailVerification();
          //console.log("Verificare email");
         // this.afireauth.auth.se
          resolve({ success: false, message: "Email non verificata" });
        }
        resolve({ success: true });
      }).catch((err) => {
        console.log("erroreLogin:"+err);
        resolve(false);
        // reject(err);

      })
    })

    return promise;

  }



  signup(newuser) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {

        let user = firebase.auth().currentUser;
        user.sendEmailVerification();
        /*this.afireauth.auth.currentUser.updateProfile({
          displayName: "user" + newuser.birthday,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/fetxxx-395b5.appspot.com/o/mask-icon.png?alt=media&token=228e3ba3-deb1-4462-a1a0-4c636fee43a6'
        }).then(() => {
         photoURL: 'https://firebasestorage.googleapis.com/v0/b/fetxxx-395b5.appspot.com/o/mask-icon.png?alt=media&token=228e3ba3-deb1-4462-a1a0-4c636fee43a6',
        */
          //this.firedata.child(this.afireauth.auth.currentUser.uid).set({
           this.firedata.child(this.afireauth.auth.currentUser.uid).set({
                            uid: this.afireauth.auth.currentUser.uid,
                            displayName: newuser.username,
                            photoURL: '',
                            profile: {
                              "location": "m",
                              "user_type": newuser.user_type,
                              "asdf": this.asdf(newuser.password),
                              "profile": {}
                            },
                            user_type: newuser.user_type,
                            email: firebase.auth().currentUser.email,
                            idx_displayName: newuser.user_type+'_'+newuser.username



          }).then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          });
/*
        }).catch((err) => {
          reject(err);
        })
        */
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;

  }

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve({ success: false });
      })
    })
    return promise;
  }
  passwordupdate(newpass: string) {
    var user = firebase.auth().currentUser;

    var promise = new Promise((resolve, reject) => {
      user.updatePassword(newpass).then(function () {
        resolve({ success: true });
      }).catch(function (error) {
        resolve({ success: false });
      })
    })

    return promise;
  }

  updateprofile(profile: any) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
        displayName: profile.user_name,
        photoURL: profile.profile_pic
      }).then(() => {
        this.firedata.child(this.afireauth.auth.currentUser.uid).update({
          photoURL: (profile.profile_pic != null) ? profile.profile_pic : '',
          uid: firebase.auth().currentUser.uid,
          displayName: (profile.user_name != null) ? profile.user_name : firebase.auth().currentUser.email.toString(),
          profile: profile,
          email: firebase.auth().currentUser.email,
        }).then(() => {
          resolve(true);

        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  changeEmail(newemail) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().currentUser.updateEmail(newemail).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve({ success: false });
      })
    })
    return promise;
  }
  getuserdetails() {
   // console.log("uid:"+firebase.auth().currentUser.uid);
    var promise = new Promise((resolve, reject) => {

      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
     //   console.log("utente:"+JSON.stringify(snapshot.val()));
        resolve(snapshot.val());
      }).catch((err) => {
        console.log("errore:"+err);
        reject(err);
      })
    })
    return promise;
  }
  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let cards = snapshot.val();
        let temparr = [];
       // let somekey = Object.keys(cards);

        for (var card in cards) {
          //if ((card != firebase.auth().currentUser.uid) && (cards[card].profile.user_type != cards[firebase.auth().currentUser.uid].profile.user_type))
            temparr.push(cards[card]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  searchusers(tipo,str) {
   // console.log("cerca:"+tipo+"--"+str);
    var promise = new Promise((resolve, reject) => {

      this.firedata.orderByChild('idx_displayName').startAt(tipo+"_"+str).endAt(tipo+"_"+str).once('value', (snapshot) => {
       // console.log(JSON.stringify(snapshot));
        let cards = snapshot.val();
        let temparr = [];
        // let somekey = Object.keys(cards);

        for (var card in cards) {
         // if ((card != firebase.auth().currentUser.uid) && (cards[card].profile.user_type != cards[firebase.auth().currentUser.uid].profile.user_type))
            temparr.push(cards[card]);

        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }
  getuserbyuid(uid: any) {
    var promise = new Promise((resolve, reject) => {
      //firebase.database().ref('/users/' + uid).once('value', (snapshot) => {
        this.firedata.child(uid).once('value', (snapshot) => {
        let user = snapshot.val();
        resolve(user)

      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }
  asdf(str) {
    var asdf = "";
    for (let i = 0; i < str.length; i++) {
      var a = str.charCodeAt(i);
      var b = a ^ 123;    // bitwise XOR with any number, e.g. 123
      asdf = asdf + String.fromCharCode(b);
    }
    return asdf;
  }
}


