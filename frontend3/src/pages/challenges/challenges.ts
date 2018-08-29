import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
 

@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html'
})
export class ChallengesPage {
    public category: any;
  	public obs: Observable<any>;
    public challenges: any;

  	constructor(public navCtrl: NavController, public httpClient: HttpClient) {
      this.challenges = {};
      this.category = "love";
      this.obs = this.httpClient.get('http://192.168.1.146:8080/api/challenge');
      this.obs
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
            if(!this.challenges[data[i].category]) this.challenges[data[i].category] = [];
            this.challenges[data[i].category].push(data[i])
        }
        console.log(this.challenges)
      })

  	}

    getPictures() {    
      console.log("get pics")
    }
}
