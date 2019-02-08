import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the FirstproviderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let api_user_reg_url = "http://api.skuolapp.it/v1/"
@Injectable()
export class FirstproviderProvider {

  constructor(public http: Http) {
    console.log('Hello FirstproviderProvider Provider');
  }
  postAdminData(credentials, url:string){
    return new Promise((resolve, reject) => {
     // let header = new Headers({ 'Accept':'application/json','Content-Type': 'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'X-AMZ-META-TOKEN-ID, X-AMZ-META-TOKEN-SECRET'});
   //     let header = new Headers({ 'Accept':'application/json','Content-Type': 'application/json'});
      let header = new Headers({ 'Accept':'text/plain','Content-Type': 'text/plain'});
  console.log("call apis:"+api_user_reg_url+url);
      console.log("credenziali:"+JSON.stringify(credentials));
      this.http.post(api_user_reg_url+url, credentials, { headers: header }).subscribe(res => {
         // console.log(res);
        resolve(res.json());
      }, (err) => {
        reject(err);
      });

    });
  }



}
