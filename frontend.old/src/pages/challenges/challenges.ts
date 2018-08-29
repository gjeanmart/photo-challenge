import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChallengeService } from '../../providers/challenge-service/challenge-service';

@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
  providers: [ChallengeService]
})
export class ChallengesPage {
  	public challenges: any;

  	constructor(public navCtrl: NavController, private challengeService: ChallengeService) {
    	this.loadChallenges();

  	}

	loadChallenges(){
	  	this.challengeService.load()
	  		.then(data => {
	    		this.challengeService = data;
	  	});
	}

}
