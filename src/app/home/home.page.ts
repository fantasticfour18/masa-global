import { Component, OnDestroy } from '@angular/core';

import { Platform, IonRefresher } from '@ionic/angular';

import { Plugins, StatusBarStyle } from '@capacitor/core';

import { ApiService } from '../services/api/api.service';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { ToastrService } from '../services/toastr/toasts.service';

import { MemberModel } from '../models/member.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MemberCardService } from '../services/member-card/member-card.service';

const { StatusBar, Device } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnDestroy {
  slidesOptions: any;

  member: MemberModel;

  size = Array;
  deviceInfo: any = null;

  private alive: Subject<any> = new Subject();

  constructor(
    private platform: Platform,
    private apiService: ApiService,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private memberCardService: MemberCardService
  ) {
    this.slidesOptions = { autoHeight: true, allowTouchMove: false };
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async ionViewWillEnter() {
    this.getDeviceInfo();
    if (this.platform.is('ios') && this.platform.is('cordova')) {
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
    }

    this.getData();
  }

  async ionViewWillLeave() {
    await this.toastrService.dismiss();
  }

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  getData(event?: { target: IonRefresher }) {
    this.apiService.getMemberInformation()
      .pipe(
        takeUntil(this.alive),
        finalize(() => {
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe(
        async (memberResponse: any) => {
          await this.toastrService.dismiss();
          this.member = new MemberModel(memberResponse);
          console.log(this.member);
          this.memberCardService.setMemberData(this.member);
        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
          this.apiService.addLogs('Home', error, this.deviceInfo);
        },
      );
  }
}
