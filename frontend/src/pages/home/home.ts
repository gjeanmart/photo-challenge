import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  	constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

  		if(!window.localStorage.user) {
  			this.login();
  		}
  	}

	login() {
	  	let alert = this.alertCtrl.create({
	    	title: 'Bienvenue',
	    	message: 'Entrer votre nom pour participer au photo challenge',
	    	inputs: [
	      		{
	        		name: 'name',
	        		placeholder: 'nom'
	      	}
	    	],
	    	buttons: [{
        		text: 'Sauvegardé',
        		handler: data => {
          			if (data.name != "") {
						window.localStorage.user = data.name;
          			} else {
            			return false;
          			}
       	 		}
	      	}]
	  	});
	  	alert.present();
	}  
}
