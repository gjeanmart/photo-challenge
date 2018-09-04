import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ENV } from '../../config/environment.dev';

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html'
})
export class PhotosPage {
    readonly endpoint = ENV.API_URL;
  	public obs: Observable<any>;
    public photos: any;
    public hasNext: boolean;
    public next: string;

  	constructor(public navCtrl: NavController, public httpClient: HttpClient) { }

    ionViewWillEnter() {
      	this.photos = [];
      	this.loadPhotos(null);
    }

    loadPhotos(next) {
    	let nextQuery = "";
    	if(next!=null) nextQuery = "?next="+next;

      	this.obs = this.httpClient.get(this.endpoint + '/api/photo'+nextQuery);
      	this.obs.subscribe(data => {
        	this.photos.push(...data.results);
        	this.hasNext = data.hasNext;
        	this.next = data.next;
      	});
    }

}
