import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage {
  locationUrl: string;

  constructor(
    private platform: Platform,
  ) {
    this.locationUrl = this.platform.is('android') ? 'geo:26.104251,-80.264267?q=MASA+Global' : 'maps://?ll26.104251,-80.264267&q=MASA+Global';
  }
}
