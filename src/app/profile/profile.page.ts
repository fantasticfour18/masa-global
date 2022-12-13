import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController, Platform, IonRefresher } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { ApiService } from '../services/api/api.service';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { ToastrService } from '../services/toastr/toasts.service';

import { MemberModel } from '../models/member.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

const { Browser, Device } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  member: MemberModel;
  deviceInfo: any = null;

  private readonly privacyPolicyUrl = 'http://docs.masaglobal.com/legal/masa-global-privacy-policy.pdf';
  private alive: Subject<any> = new Subject();

  constructor(
    private platform: Platform,
    private navController: NavController,
    private authentication: AuthenticationService,
    private apiService: ApiService,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
  ) {

  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async ionViewWillEnter() {
    this.getDeviceInfo();
    this.getData();
  }

  async ionViewWillLeave() {
    await this.toastrService.dismiss();
  }

  async ngOnInit() {
    if (this.platform.is('android')) {
      await Browser.prefetch({ urls: [this.privacyPolicyUrl] });
    }
  }

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  async openPrivacyPolicy() {
    await Browser.open({ url: this.privacyPolicyUrl });
  }

  async logout() {
    await this.toastrService.dismiss();
    await this.authentication.logout();
    await this.navController.navigateRoot('/auth/login');
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
        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
          this.apiService.addLogs('Profile', error, this.deviceInfo);
        },
      );
  }
}
