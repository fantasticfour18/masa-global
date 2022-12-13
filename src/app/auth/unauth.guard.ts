import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { NavController } from '@ionic/angular';

import { IdentityService } from '../services/identity/identity.service';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(
    private navController: NavController,
    private identity: IdentityService,
    private authentication: AuthenticationService,
  ) {
  }

  async canActivate() {
    let session = null;

    try {
      session = await this.identity.restoreSession();
    } catch (error) {
      console.error(error);

      await this.authentication.logout();
    }

    if (session) {
      this.navController.navigateRoot('/tabs/home');

      return false;
    } else {
      return true;
    }
  }
}
