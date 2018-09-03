import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userForm: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public alertCtrl: AlertController) {

    this.userForm = this.formBuilder.group({
      	name: [window.localStorage.user]
    });
  }

  save() {
    window.localStorage.user = this.userForm.value.name;
    const popup = this.alertCtrl.create({
      title: 'Hey ' + this.userForm.value.name,
      message: 'Votre nom est sauvegarde!',
      buttons: [
        {
          text: 'Fermer'
        }
      ]
    });
    popup.present();
  }


}
