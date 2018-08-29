import { Component } from '@angular/core';

import { ChallengesPage } from '../challenges/challenges';
import { PhotosPage } from '../photos/photos';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ChallengesPage;
  tab3Root = PhotosPage;

  constructor() {

  }
}
