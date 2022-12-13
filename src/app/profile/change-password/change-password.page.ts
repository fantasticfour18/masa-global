import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoadingController } from '@ionic/angular';

import { CognitoService } from '../../services/cognito/cognito.service';
import { IdentityService } from '../../services/identity/identity.service';
import { ToastrService } from '../../services/toastr/toasts.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

import { passwordMatchValidator, passwordWeakValidator } from '../../services/validators';
import { ApiService } from 'src/app/services/api/api.service';
import { LogsModel } from 'src/app/models/logs.model';
import * as moment from 'moment';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['../../auth/shared/styles.scss', './change-password.page.scss'],
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;

  logsPost: LogsModel = {
    ScreenName: 'Change Password'  
  };
  deviceInfo: any = null;
  showPass: boolean;
  showPass2: boolean;
  showPass3: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private cognito: CognitoService,
    private identity: IdentityService,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private apiService: ApiService
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: [null, Validators.required],
        newPassword: [null, [Validators.required, passwordWeakValidator]],
        newPasswordConfirmation: [null, Validators.required],
      },
      {
        validators: [passwordMatchValidator()],
      },
    );

    this.getDeviceInfo();
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async onSubmit() {
    if (this.changePasswordForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
      });

      await loading.present();

      const { username } = await this.identity.getSession();

      this.cognito.changePassword(
        username.toLowerCase(),
        this.changePasswordForm.get('oldPassword').value,
        this.changePasswordForm.get('newPassword').value,
      )
      .then(
        async (success) => {
          this.changePasswordForm.reset();
          await this.toastrService.create({
            color: 'success',
            message: 'Password changed',
          });
        },
      )
      .catch(
        async (error) => {
          await this.changePasswordForm.reset();
          await this.errorHandler.handleError({ message: error.message || error.code });
          this.addLogs(error);
        },
      )
      .finally(async () => await loading.dismiss());
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  addLogs(error)
  {
    console.log(error);

    this.logsPost.clientInfo = this.deviceInfo;
    this.logsPost.api = "Coginto Authenticate";
    this.logsPost.apiResonse = error.name;
    this.logsPost.errorStatus = error.status ? error.status : "400";
    this.logsPost.errorType = error.code;
    this.logsPost.errorDesc = error.message;
    this.logsPost.errorUser = error.message;
    this.logsPost.createdDate = moment().format("MMMM Do YYYY, hh:mm:ss a");

    console.log(this.logsPost);

    this.apiService.addAuthLogs(this.logsPost);

  }
}
