import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IonSlides, LoadingController, Platform, ModalController, MenuController } from '@ionic/angular';

import { Plugins, StatusBarStyle } from '@capacitor/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastrService } from '../../services/toastr/toasts.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { CognitoService } from '../../services/cognito/cognito.service';

import { passwordMatchValidator, passwordWeakValidator } from '../../services/validators';
import { LogsModel } from 'src/app/models/logs.model';
import { ApiService } from 'src/app/services/api/api.service';
import * as moment from 'moment';

const { StatusBar, Device } = Plugins;

export enum Direction {
  Back = -1,
  Forward = 1,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['../shared/styles.scss', '../register/register.page.scss', './forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  @Input() email: string;

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  forgotPasswordForm: FormGroup;
  firstStep: FormGroup;
  secondStep: FormGroup;
  thirdStep: FormGroup;
  showPass: boolean;
  showPass2: boolean;

  slidesOptions: any;

  currentSlide = 1;

  private alive: Subject<any> = new Subject();

  logsPost: LogsModel = {
    ScreenName: 'Forgot Password'  
  };
  deviceInfo: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastrService: ToastrService,
    private errorHandler: ErrorHandlerService,
    private cognito: CognitoService,
    private apiService: ApiService,
    private menuController: MenuController
  ) {
    this.slidesOptions = { autoHeight: true, allowTouchMove: false };

    this.forgotPasswordForm = this.formBuilder.group(
      {
        firstStep: this.formBuilder.group(
          {
            email: [null, [Validators.required, Validators.email]],
          },
        ),
        secondStep: this.formBuilder.group(
          {
            verificationCode: [null, Validators.required],
            newPassword: [null, [Validators.required, passwordWeakValidator]],
            newPasswordConfirmation: [null, Validators.required],
          },
          {
            validators: [passwordMatchValidator()],
          },
        ),
      },
    );

    this.firstStep = this.forgotPasswordForm.get('firstStep') as FormGroup;
    this.secondStep = this.forgotPasswordForm.get('secondStep') as FormGroup;

    this.secondStep.disable();
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async ionViewWillEnter() {
    this.menuController.enable(false);
    this.getDeviceInfo();
    if (this.platform.is('ios') && this.platform.is('cordova')) {
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
    }
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  async ngOnInit() {
    this.firstStep.get('email').setValue(this.email);

    this.secondStep.get('newPassword').valueChanges
      .pipe(takeUntil(this.alive))
      .subscribe(
        (changes: string) => {
          if (changes) {
            this.secondStep.get('newPasswordConfirmation').updateValueAndValidity();
          }
        },
      );
  }

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  async closeModal(result: any) {
    await this.toastrService.dismiss();
    await this.modalController.dismiss({ result });
  }

  async goBack() {
    this.disableStepForm(this.stepIndexToStepFormName(this.currentSlide), Direction.Back);
    await this.toastrService.dismiss();
    await this.slides.slidePrev();
    this.currentSlide -= 1;
  }

  async sendVerificationCode(options: { resend: boolean } = { resend: false }) {
    if (options.resend) {
      this.firstStep.enable();
    }

    if (this.firstStep.valid) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
      });

      await loading.present();

      this.cognito.forgotPassword(this.firstStep.get('email').value.toLowerCase())
        .then(
          async (success) => {
            if (options.resend) {
              this.firstStep.disable();
            } else {
              this.disableStepForm(this.stepIndexToStepFormName(this.currentSlide), Direction.Forward);

              // TODO: remove when this will be fixed https://github.com/ionic-team/ionic/issues/19638
              await this.slides.update();

              await this.slides.slideNext();
              this.currentSlide += 1;
            }
          },
        )
        .catch(
          async (error) => {
            await this.errorHandler.handleError({ message: error.message || error.code });
            this.addLogs(error);
          },
        )
        .finally(async () => await loading.dismiss());
    } else {
      this.firstStep.markAllAsTouched();
    }
  }

  async resetPassword() {
    if (this.forgotPasswordForm.get('secondStep').valid) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
      });

      await loading.present();

      this.cognito.confirmPassword(
        this.firstStep.get('email').value.toLowerCase(),
        this.secondStep.get('verificationCode').value,
        this.secondStep.get('newPassword').value,
      )
      .then(
        async (success) => {
          await this.closeModal(success);
        },
      )
      .catch(
        async (error) => {
          await this.errorHandler.handleError({ message: error.message || error.code });
          this.addLogs(error);
        },
      )
      .finally(async () => await loading.dismiss());
    } else {
      this.forgotPasswordForm.get('secondStep').markAllAsTouched();
    }
  }

  private stepIndexToStepFormName(index: number): string {
    const map = { 1: 'firstStep', 2: 'secondStep' };

    return map[index];
  }

  private disableStepForm(currentStep: string, direction: Direction) {
    Object.keys(this.forgotPasswordForm.controls).forEach(
      (step, index, array) => {
        if (step === currentStep) {
          this.forgotPasswordForm.controls[step].disable();
          this.forgotPasswordForm.controls[array[index + direction]].enable();
        }
      },
    );
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
