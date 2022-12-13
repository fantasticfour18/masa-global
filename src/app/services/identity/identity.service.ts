import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import {
  AuthMode,
  IonicIdentityVaultUser,
  IonicNativeAuthPlugin,
} from '@ionic-enterprise/identity-vault';

import { BrowserAuthPlugin } from '../browser-auth/browser-auth.plugin';

export interface CustomSession {
  username: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  clockDrift: number;
}

@Injectable({
  providedIn: 'root',
})
export class IdentityService extends IonicIdentityVaultUser<CustomSession> {

  constructor(
    private browserAuthPlugin: BrowserAuthPlugin,
    public platform: Platform,
  ) {
    super(platform, {
      authMode: AuthMode.SecureStorage,
      restoreSessionOnReady: false,
      unlockOnReady: false,
      unlockOnAccess: true,
      lockAfter: 3000,
      hideScreenOnBackground: true,
    });
  }

  async logout() {
    const vault = await this.getVault();
    vault.clear();
  }

  getPlugin(): IonicNativeAuthPlugin {
    if (this.platform.is('cordova')) {
      return super.getPlugin();
    }

    return this.browserAuthPlugin;
  }
}
