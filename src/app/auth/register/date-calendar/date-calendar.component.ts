import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;

@Component({
  selector: 'app-date-calendar',
  templateUrl: './date-calendar.component.html',
  styleUrls: ['./date-calendar.component.scss'],
})
export class DateCalendarComponent implements OnInit {

  minDate: any;
  maxDate: any;
  showSelected: any;


  constructor(private modalController: ModalController, private navParams: NavParams) 
  { 
    this.minDate = new Date(1900, 0, 1); //YYYY, MM, DD
    this.maxDate = new Date();
    this.showSelected = navParams.get('data');
   
    App.addListener('backButton', () => {
      this.modalController.dismiss();
    });

  }

  ngOnInit() {}

  setBirthDate(event) {
    this.modalController.dismiss({birthDate: event});
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
