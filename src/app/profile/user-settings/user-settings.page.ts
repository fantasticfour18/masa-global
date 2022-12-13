import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { PickerController, Platform } from '@ionic/angular';
import { PickerColumnOption } from '@ionic/core';

import { AuthMode } from '@ionic-enterprise/identity-vault';

import { Plugins, DeviceInfo } from '@capacitor/core';

import { IdentityService } from '../../services/identity/identity.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const { Browser, Device } = Plugins;

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit, OnDestroy {
  settingsForm: FormGroup;

  deviceInformation: DeviceInfo;

  private alive: Subject<any> = new Subject();

  private readonly columnOptions = [
    [
      'U.S Dollor',
      'Euro',
      'Rubl',
    ],
  ];

  private readonly privacyPolicyUrl = 'http://docs.masaglobal.com/legal/masa-global-privacy-policy.pdf';

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private pickerController: PickerController,
    private identity: IdentityService,
  ) {
    this.settingsForm = this.formBuilder.group(
      {
        isBiometricsEnabled: [false],
      },
    );
  }

  async ionViewWillEnter() {
    const isBiometricsAvailable = await this.identity.isBiometricsAvailable();

    if (isBiometricsAvailable) {
      const isBiometricsEnabled = await this.identity.isBiometricsEnabled();

      this.settingsForm.get('isBiometricsEnabled').setValue(isBiometricsEnabled);
    } else {
      this.settingsForm.get('isBiometricsEnabled').disable();
    }

    this.settingsForm.get('isBiometricsEnabled').valueChanges
      .pipe(takeUntil(this.alive))
      .subscribe(
        async (isEnabled: boolean) => {
          await this.identity.setAuthMode(isEnabled ? AuthMode.BiometricOnly : AuthMode.SecureStorage);
        },
      );
  }

  async ngOnInit() {
    this.deviceInformation = await Device.getInfo();

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

  async openPicker(numColumns = 1, numOptions = 3, columnOptions = this.columnOptions) {
    const picker = await this.pickerController.create(
      {
        columns: this.getColumns(numColumns, numOptions, columnOptions as PickerColumnOption[]),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Confirm',
            handler: (value) => {
              console.log(`Got Value ${value}`);
            },
          },
        ],
      },
    );

    await picker.present();
  }

  private getColumns(numColumns: number, numOptions: number, columnOptions: PickerColumnOption[]) {
    const columns = [];

    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions),
      });
    }

    return columns;
  }

  private getColumnOptions(columnIndex: number, numOptions: number, columnOptions: PickerColumnOption[]) {
    const options = [];

    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i,
      });
    }

    return options;
  }
}
