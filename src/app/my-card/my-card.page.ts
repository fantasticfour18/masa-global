import { Component, OnInit} from '@angular/core';
import { ApiService } from '../services/api/api.service';

import { MemberModel } from '../models/member.model';
import { File } from '@ionic-native/file/ngx';
import domtoimage from 'dom-to-image';
import { AlertController, LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { Plugins } from '@capacitor/core';

const { MasaCardSaver, Device } = Plugins;

@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.page.html',
  styleUrls: ['./my-card.page.scss'],
})
export class MyCardPage implements OnInit {

 member: MemberModel;
 imageCardName: any;
 loader: any;
 alertCtrl: any;
 loading: boolean;
 fileDir: any;
 deviceInfo: any = null;

  constructor(private apiService: ApiService, private file: File, private printer: Printer,
    private loadingController: LoadingController, private alertController: AlertController, private platform: Platform,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getDeviceInfo();
    this.getMemberData();

    if(this.platform.is('ios')) {
      this.fileDir = this.file.documentsDirectory;
    }
    else {
      this.fileDir = this.file.externalRootDirectory;
    }
    
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  getMemberData() 
  {
    this.loading = true;
    this.apiService.getMemberInformation()
      .subscribe(
        (memberResponse: any) => {
          this.loading = false;
          this.member = new MemberModel(memberResponse);
        },
        async (error: any) => {
          this.loading = false;
          console.error({ message: error.message });
          await this.errorHandler.handleError({
            color: 'danger',
            message: error.message,
          })
          this.apiService.addLogs('My Card', error, this.deviceInfo);
        },
      );
  }

  // Method for Printing Card
  printCard()
  {
    this.presentLoader();
    const printWrapper = document.getElementById('print-wrapper');

    let options = {};

    if(this.platform.is('android')) 
    {
      const scale = 2;
      options = {
        height: printWrapper.offsetHeight * scale,
        style: {
          transform: `scale(${scale}) translate(${printWrapper.offsetWidth / 2 / scale}px, ${printWrapper.offsetHeight / 2 / scale}px)`
        },
        width: printWrapper.offsetWidth * scale
      } 
    }

    domtoimage.toPng(printWrapper, options).then(base64URL => {

      this.printer.isAvailable().then(() => {

        let options: PrintOptions = {
          name: 'Member Card',
          orientation: 'portrait'
        }
       
        this.printer.print('base64://' + base64URL.split(',')[1], options).then(() => {
          this.loadingController.dismiss();
          this.presentAlert('Print Success.');
        })
        .catch((err) => {
          this.loadingController.dismiss();
          this.presentAlert('Error while printing...' + JSON.stringify(err));
        })
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.presentAlert("Printer not supported by this device.");
      })

    })
    .catch(err => {
      this.loadingController.dismiss();
      this.presentAlert('Error while printing...' + JSON.stringify(err));
      console.log(err);
    });

  }

  // Method for saving Card
  async saveCard()
  {
    this.presentLoader();
    const printWrapper = document.getElementById('print-wrapper');

    let options = {};

    // For Android Devices
    if(this.platform.is('android')) 
    {
      const scale = 2;
      options = {
        height: printWrapper.offsetHeight * scale,
        style: {
          transform: `scale(${scale}) translate(${printWrapper.offsetWidth / 2 / scale}px, ${printWrapper.offsetHeight / 2 / scale}px)`
        },
        width: printWrapper.offsetWidth * scale
      } 

      domtoimage.toPng(printWrapper, options).then(async base64Data => {
        this.imageCardName = `member_card${this.member.id}.png`;

        MasaCardSaver.saveMemberCard({cardData: base64Data, cardName: this.imageCardName}).then((res: any) => {
          this.loadingController.dismiss();
          if(res.success) {
            this.presentAlert("Membership Card saved to Gallery.");
          }
        }, (err => {
          this.loadingController.dismiss();
          console.error(err);
        }));
      })
      .catch(err => {
        this.loadingController.dismiss();
        /* this.presentAlert('Error saving card... ' + JSON.stringify(err)); */
        console.error(err);
      });
    }
    // For iOS Devices
    else
    {
      domtoimage.toBlob(printWrapper, options).then( blob => {
        this.imageCardName = `member_card${this.member.id}.png`;
  
        this.file.writeFile(this.fileDir, this.imageCardName, blob, {replace: true}).then(res => {
          this.loadingController.dismiss();
          this.presentAlert("Membership Card saved to Files.");
        }, (err => {
          this.loadingController.dismiss();
          console.error(err);
        }));
      })
      .catch(err => {
        this.loadingController.dismiss();
        /* this.presentAlert('Error saving card... ' + JSON.stringify(err)); */
        console.error(err);
      });
    }
  }

  async presentLoader()
  {
    this.loader = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });

    await this.loader.present();
  }

  async presentAlert(msg) {
    this.alertCtrl = await this.alertController.create({
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });

    await this.alertCtrl.present();
  }

}
