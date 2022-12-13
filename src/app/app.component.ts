import { Component, OnDestroy } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

import { IdentityService } from './services/identity/identity.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { NetworkService } from './services/network/network.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from './services/toastr/toasts.service';
import { Router } from '@angular/router';
import { MemberCardService } from './services/member-card/member-card.service';
import { Location } from '@angular/common';

const { SplashScreen, App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  isOnline: boolean;
  private alive: Subject<any> = new Subject();

  constructor(
    private platform: Platform,
    private navController: NavController,
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private network: NetworkService,
    private toastrService: ToastrService,
    private router: Router,
    private _location: Location,
    public memberCardService: MemberCardService,
    private menuController: MenuController) 
  {
    // Plugin for back Android Back Button
    App.addListener('backButton', () => {

      menuController.isOpen().then(async (isOpen: boolean) => {
        if(isOpen) {
          menuController.close();
        }
        else if((router.url == '/tabs/home') || (router.url == '/auth/login')) {
          App.exitApp();
        }
        else {
          _location.back();
        }
      });
    });

    this.initializeApp();
  }

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  private async initializeApp() {
    const platform = await this.platform.ready();

    if (platform === 'cordova') {
      await SplashScreen.hide();
    }

    this.platform.resume
      .pipe(takeUntil(this.alive))
      .subscribe(
        async () => {
          await this.restoreSession();
        },
      );

    this.network.status
      .pipe(takeUntil(this.alive))
      .subscribe(
        async (status) => {
          status.connected ? this.isOnline = true : this.isOnline = false;
        },
      );
  }

  private async restoreSession() {
    try {
      await this.identity.restoreSession();
    } catch (error) {
      console.error(error);

      await this.authentication.logout();
      await this.navController.navigateRoot('/auth/login');
    }
  }

  async logout() {
    await this.toastrService.dismiss();
    await this.authentication.logout();
    await this.navController.navigateRoot('/auth/login');
  }

}
