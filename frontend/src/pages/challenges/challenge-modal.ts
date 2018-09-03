import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PhotosPage } from '../photos/photos';

@Component({
	selector: 'challenge-modal',
	templateUrl: 'challenge-modal.html',
})
export class ChallengeModal {
    readonly endpoint = "http://192.168.0.24:8080";
	public imageUrl: SafeResourceUrl;;
	public formData: FormData;
    public loading: any;
    public navCtrl: NavController;

	constructor(public viewCtrl : ViewController, public navParams: NavParams, private sanitizer: DomSanitizer, public httpClient: HttpClient, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {  }
	
	ionViewDidLoad() {
     	this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.navParams.get('url'));
     	this.formData = this.navParams.get('formData');
     	this.navCtrl = this.navParams.get('navCtrl');
	}

	public transfer(){
		this.loading = this.loadingCtrl.create({
          	content: 'Transfert en cours...'
        });
        this.loading.present();
        this.postData(this.formData);
	}

	public cancel(){
	    this.viewCtrl.dismiss();
	}

    private postData(formData: FormData) {

    	const httpOptions = {
		  headers: new HttpHeaders({
		    'user':  window.localStorage.user
		  })
		};

      this.httpClient.post(this.endpoint + '/api/photo', formData, httpOptions)
        .subscribe(data => {
          console.log(data);
          this.loading.dismiss();
          this.showSuccess();
        }, error => {
          console.log(error);
          this.loading.dismiss();
          this.showError(error);
        });
    }


  showSuccess() {
    const popup = this.alertCtrl.create({
      title: 'Votre photo a ete sauvegarde!',
      message: '',
      buttons: [
        {
          text: 'Autres Challenges',
          handler: () => {
	    	this.viewCtrl.dismiss();
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Voir les photos',
          handler: () => {    
	    	this.viewCtrl.dismiss();
        	this.navCtrl.setRoot(PhotosPage);
          }
        }
      ]
    });
    popup.present();
  }


  showError(error) {
    const popup = this.alertCtrl.create({
      title: 'Erreur',
      message: error,
      buttons: [
        {
          text: 'Fermer'
        }
      ]
    });
    popup.present();
  }

} 