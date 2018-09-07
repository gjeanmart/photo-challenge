import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ChallengeModal } from './challenge-modal';
import { ENV } from '../../config/environment.dev';

@Component({
    selector: 'page-challenges',
    templateUrl: 'challenges.html'
})
export class ChallengesPage {
  readonly endpoint = ENV.API_URL;
	public obs: Observable<any>;
  public challenges: any;
  @ViewChild("fileInput") fileInput: ElementRef;

	constructor(public navCtrl: NavController, public httpClient: HttpClient, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modalCtrl : ModalController) { }

  ionViewWillEnter() {
    this.challenges = [];
    this.loadChallenges();
  }

  onUploadChange(ev) {
    let file = ev.target.files[0];
    let id = ev.target.id;

    ev.preventDefault();
    this.readFile(id, file);
  }

  private readFile(id: string, file: any) {

    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob, file.name);
      formData.append('content', id);

      var modalPage = this.modalCtrl.create(ChallengeModal, { url : URL.createObjectURL(imgBlob), formData: formData, navCtrl: this.navCtrl });
      modalPage.present();
    };
    reader.readAsArrayBuffer(file);
  }

  private loadChallenges() {
    this.obs = this.httpClient.get(this.endpoint + '/api/challenge');
    this.obs.subscribe(data => {
      this.challenges = data;
      console.log(this.challenges);
    })
  }
}
