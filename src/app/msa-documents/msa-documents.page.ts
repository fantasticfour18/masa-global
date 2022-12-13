import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { LoadingController, Platform, IonRefresher } from '@ionic/angular';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HttpClient } from '@angular/common/http';
import { MemberModel } from '../models/member.model';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

@Component({
  selector: 'app-msa-documents',
  templateUrl: './msa-documents.page.html',
  styleUrls: ['./msa-documents.page.scss'],
})
export class MsaDocumentsPage implements OnInit {

  documentsList: any[] = [];
  loader: any;
  isLoading: boolean;
  member: MemberModel;
  errorMsg: string = "Coming Soon.";
  deviceInfo: any = null;

  constructor(private apiService: ApiService, private transfer: FileTransfer, private fileOpen: FileOpener,
    private file: File, private fileObject: FileTransferObject, private platform: Platform, 
    private loadingController: LoadingController, private http: HttpClient) 
  {}

  ngOnInit() {
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  ionViewDidEnter()
  {
    this.getDeviceInfo();
    this.isLoading = true;
    this.documentsList = [];
    this.getMemberInfo();
  }

  getMemberInfo(event?: { target: IonRefresher }) {
    this.apiService.getMemberInformation().subscribe(
        (memberResponse: any) => {
          this.member = new MemberModel(memberResponse);
          this.getDocuments();
        },
        (error: any) => {
          this.isLoading = false;
          this.errorMsg = "Technical issue, try again after sometime.";
          console.error(error.message);
          this.apiService.addLogs('MSA', error, this.deviceInfo);
        },
      );
  }

  getDocuments()
  {
    this.apiService.getDocuments(this.member.id).subscribe(data => {
      data.forEach(document => {
        if(document.displayName.substring(0,4) == 'http') {

          const docName = document.displayName.split('MSA/')[1].split('.')[0];
          document['docName'] = docName;
          this.documentsList.push(document);
        }
      });

      this.isLoading = false;
    }, 
    (err) => {
      // Show Default Document on error or network issue
      this.isLoading = false;
      this.errorMsg = "Coming Soon."
    });
  }

  viewDocument(index)
  {
    let path;

    if(this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    }
    else {
      path = this.file.externalDataDirectory;
    }

    this.fileObject = this.transfer.create();
    let fileName = 'MASA_doc.pdf';

    this.presentLoader();
    this.fileObject.download(this.documentsList[index].displayName, path + fileName).then(entry => {
            this.loadingController.dismiss();
            let url = entry.toURL();
            this.fileOpen.open(url, 'application/pdf');
          },
          (err => {alert(JSON.stringify(err))})
    ) 
  }

  async presentLoader()
  {
    this.loader = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });

    await this.loader.present();
  }

}
