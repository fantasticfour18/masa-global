import { Injectable } from '@angular/core';
import { BiometricType, IdentityVault, PluginConfiguration, AuthMode } from '@ionic-enterprise/identity-vault';

import { CustomSession } from '../identity/identity.service';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class BrowserAuthService implements IdentityVault {

  constructor() {

  }

  config = {
    authMode: AuthMode.SecureStorage,
    descriptor: {
      username: '',
      vaultId: '',
    },
    isBiometricsEnabled: false,
    isPasscodeEnabled: false,
    isPasscodeSetupNeeded: false,
    isSecureStorageModeEnabled: true,
    hideScreenOnBackground: false,
    lockAfter: 0,
  };

  unsubscribe(): Promise<void> {
    return Promise.resolve();
  }

  async clear(): Promise<void> {
    await Storage.clear();
  }

  lock(): Promise<void> {
    return Promise.resolve();
  }

  isLocked(): Promise<boolean> {
    return Promise.resolve(false);
  }

  async isInUse(): Promise<boolean> {
    return !!(await Storage.get({ key: 'session' }));
  }

  isBiometricsSupported(): Promise<boolean> {
    return Promise.resolve(false);
  }

  getConfig(): Promise<PluginConfiguration> {
    return Promise.resolve(this.config);
  }

  remainingAttempts(): Promise<number> {
    return Promise.resolve(5);
  }

  removeValue(key: string): Promise<void> {
    return Promise.resolve();
  }

  getKeys(): Promise<string[]> {
    return Promise.resolve([]);
  }

  async getUsername(): Promise<string> {
    const deserialized = await Storage.get({ key: 'session' });

    return (JSON.parse(deserialized.value) as CustomSession).username;
  }

  async storeToken(token: any): Promise<void> {
    await Storage.set({ key: 'token', value: JSON.stringify(token) });
  }

  async getToken(): Promise<any> {
    await Storage.get({ key: 'session' });
  }

  async storeValue(key: string, value: any): Promise<void> {
    await Storage.set({ key, value: JSON.stringify(value) });
  }

  async getValue(key: string): Promise<any> {
    const deserialized = await Storage.get({ key });

    return JSON.parse(deserialized.value);
  }

  getBiometricType(): Promise<BiometricType> {
    const none: BiometricType = 'none';

    return Promise.resolve(none);
  }

  setBiometricsEnabled(isBiometricsEnabled: boolean): Promise<void> {
    return Promise.resolve();
  }

  isBiometricsEnabled(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isBiometricsAvailable(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isPasscodeSetupNeeded(): Promise<boolean> {
    return Promise.resolve(false);
  }

  setPasscode(passcode?: string): Promise<void> {
    return Promise.resolve();
  }

  isPasscodeEnabled(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isSecureStorageModeEnabled(): Promise<boolean> {
    return Promise.resolve(true);
  }

  setPasscodeEnabled(isPasscodeEnabled: boolean): Promise<void> {
    return Promise.resolve();
  }

  setSecureStorageModeEnabled(enabled: boolean): Promise<void> {
    return Promise.resolve();
  }

  unlock(usingPasscode?: boolean, passcode?: string): Promise<void> {
    return Promise.resolve();
  }
}
