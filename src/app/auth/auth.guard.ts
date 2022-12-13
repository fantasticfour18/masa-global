import { Injectable } from '@angular/core';
import { CanActivate, NavigationExtras } from '@angular/router';

import { NavController } from '@ionic/angular';

import { IdentityService } from '../services/identity/identity.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { CognitoService } from '../services/cognito/cognito.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private navController: NavController,
    private identity: IdentityService,
    private authentication: AuthenticationService,
    private cognito: CognitoService
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

      if(!this.cognito.isIdTokenValid(session.idToken, session.clockDrift)) {
        await this.authentication.logout();

        let navExtras: NavigationExtras = {
          state: {session : {isSessionExpired: true, msg: 'Session Expired!! Please login again.'}}
        }

        await this.navController.navigateRoot('/auth/login', navExtras);
        return false;
      }
      
      return true;

    }
    else {
      this.navController.navigateRoot('/auth/login');

      return false;
    }
  }
}
