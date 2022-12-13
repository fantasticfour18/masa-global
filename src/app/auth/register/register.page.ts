import { format, parseISO } from 'date-fns';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, LoadingController, MenuController, ModalController, NavController, Platform } from '@ionic/angular';

import { Plugins, StatusBarStyle } from '@capacitor/core';

import { Subject } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';

import { CognitoService } from '../../services/cognito/cognito.service';
import { ApiService } from '../../services/api/api.service';
import { ErrorHandlerService, OverlayType } from '../../services/error-handler/error-handler.service';
import { ToastrService } from 'src/app/services/toastr/toasts.service';

import { passwordMatchValidator, passwordWeakValidator } from '../../services/validators';
import * as moment from 'moment'
import { LogsModel } from 'src/app/models/logs.model';
import { DateCalendarComponent } from './date-calendar/date-calendar.component';

const { StatusBar, Device } = Plugins;

export enum Direction {
  Back = -1,
  Forward = 1,
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['../shared/styles.scss', './register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  registerForm: FormGroup;
  firstStep: FormGroup;
  secondStep: FormGroup;
  thirdStep: FormGroup;
  showPass: boolean;
  birthDate: string;

  slidesOptions: any;

  currentSlide = 1;

  private alive: Subject<any> = new Subject();

  logsPost: LogsModel = {
    ScreenName: 'Register'  
  };
  logMessage: string;
  deviceInfo: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private navController: NavController,
    private loadingController: LoadingController,
    private cognito: CognitoService,
    private apiService: ApiService,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private modalController: ModalController,
    private menuController: MenuController
  ) {
    this.slidesOptions = { autoHeight: true, allowTouchMove: false };

    this.registerForm = this.formBuilder.group(
      {
        firstStep: this.formBuilder.group(
          {
            memberId: [null, [Validators.required, Validators.min(0), Validators.max(2147483647)]],
            birthDate: [null, Validators.required],
            firstName: [null],
            lastName: [null, Validators.required],
          },
        ),
        secondStep: this.formBuilder.group(
          {
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, passwordWeakValidator]],
            passwordConfirmation: [null, [Validators.required]],
          },
          {
            validators: [passwordMatchValidator('password', 'passwordConfirmation')],
          },
        ),
        thirdStep: this.formBuilder.group(
          {
            verificationCode: [null, Validators.required],
          },
        ),
      },
    );

    this.firstStep = this.registerForm.get('firstStep') as FormGroup;
    this.secondStep = this.registerForm.get('secondStep') as FormGroup;
    this.thirdStep = this.registerForm.get('thirdStep') as FormGroup;

    this.secondStep.disable();
    this.thirdStep.disable();

  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async ionViewWillEnter() {
    this.menuController.enable(false);
    this.getDeviceInfo();
    if (this.platform.is('ios') && this.platform.is('cordova')) {
      await StatusBar.setStyle({ style: StatusBarStyle.Dark });
    }
  }

  async ionViewWillLeave() {
    this.menuController.enable(true);
    await this.toastrService.dismiss();
  }

  ngOnInit() {
    this.secondStep.get('password').valueChanges
      .pipe(takeUntil(this.alive))
      .subscribe(
        (changes: string) => {
          if (changes) {
            this.secondStep.get('passwordConfirmation').updateValueAndValidity();
          }
        },
      );
  }

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  async goBack() {
    this.disableStepForm(this.stepIndexToStepFormName(this.currentSlide), Direction.Back);
    await this.toastrService.dismiss();
    await this.slides.slidePrev();
    this.currentSlide -= 1;
  }

  async checkMemberInformation() {
    if (this.firstStep.valid) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
      });

      await loading.present();

      this.apiService.lookupMember(
        this.firstStep.get('memberId').value,
        moment(this.firstStep.get('birthDate').value, 'D-MMM-yyyy').format('yyyy-MM-DD'),
        this.firstStep.get('lastName').value,
      )
      .pipe(
        finalize(async () => await loading.dismiss()),
      )
      .subscribe(
        async (member) => {
          await loading.dismiss();

          this.firstStep.get('firstName').setValue(member.firstName);
          this.secondStep.get('email').setValue(member.email);

          this.disableStepForm(this.stepIndexToStepFormName(this.currentSlide), Direction.Forward);
          await this.slides.slideNext();
          this.currentSlide += 1;
        },
        async (error) => {
          await this.errorHandler.handleError(
            this.getLookupErrorOptions(error),
            this.getLookupErrorOverlayType(error),
          );
          this.addLogs(error);
        },
      );

    } else {
      this.firstStep.markAllAsTouched();
    }
  }

  async sendConfirmationEmail() {
    if (this.secondStep.valid) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
      });

      await loading.present();

      this.cognito.signUp(
        this.firstStep.get('memberId').value.toString(),
        this.firstStep.get('firstName').value,
        this.firstStep.get('lastName').value,
        this.secondStep.get('email').value.toLowerCase(),
        this.secondStep.get('password').value,
      )
      .then(
        async (success) => {
          this.disableStepForm(this.stepIndexToStepFormName(this.currentSlide), Direction.Forward);
          await this.slides.slideNext();
          this.currentSlide += 1;
        },
      )
      .catch(
        async (error) => {
          await this.errorHandler.handleError({ message: error.message });
          this.addLogs(error);
        },
      )
      .finally(async () => await loading.dismiss());

    } else {
      this.secondStep.markAllAsTouched();
    }
  }

  async confirmRegistration() {
    if (this.registerForm.get('thirdStep').valid) {
      const loading = await this.loadingController.create({
        message: 'Loading...',
      });

      await loading.present();

      this.cognito.confirmUser(
        this.thirdStep.get('verificationCode').value,
        this.secondStep.get('email').value.toLowerCase(),
      )
      .then(
        (success) => {
          this.navController.navigateRoot('/auth/login');
        },
      )
      .catch(
        async (error) => {
          await this.errorHandler.handleError({ message: error.message });
          this.addLogs(error);
        },
      )
      .finally(async () => await loading.dismiss());
    } else {
      this.registerForm.get('thirdStep').markAllAsTouched();
    }
  }

  async resendVerificationCode() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });

    await loading.present();

    await this.cognito.resendVerificationCode(this.secondStep.get('email').value.toLowerCase())
      .catch(
        async (error) => {
          await this.errorHandler.handleError({ message: error.message });
          this.addLogs(error);
        },
      )
      .finally(async () => await loading.dismiss());
  }

  private getLookupErrorOptions(error): any {
    const notFound = error.status === 404;

    if (notFound) {
      this.logMessage = "Some of the info entered doesn’t match what we have. Take a minute to recheck each entry. If this information is correct, please contact us at 1-800-643-9023." 
      return {
        header: 'Some of the info entered doesn’t match what we have.',
        message: 'Take a minute to recheck each entry. If this information is correct, please contact us at 1-800-643-9023.',
      };
    }
  }

  private getLookupErrorOverlayType(error): OverlayType {
    return error.status === 404 ? OverlayType.ALERT : OverlayType.TOAST;
  }

  private stepIndexToStepFormName(index: number): string {
    const map = { 1: 'firstStep', 2: 'secondStep', 3: 'thirdStep' };

    return map[index];
  }

  private disableStepForm(currentStep: string, direction: Direction) {
    Object.keys(this.registerForm.controls).forEach(
      (step, index, array) => {
        if (step === currentStep) {
          this.registerForm.controls[step].disable();
          this.registerForm.controls[array[index + direction]].enable();
        }
      },
    );
  }

  checkSpaces(event) {
    const email = event.target.value.trim().replace(/\s+/g,  '');
    this.secondStep.get('email').setValue(email);
  }

  addLogs(error)
  {
    console.log(error);
    this.logsPost.clientInfo = this.deviceInfo;
    this.logsPost.api = error.url ? error.url : "Coginto Authenticate";
    this.logsPost.apiResonse = error.name;
    this.logsPost.errorStatus = error.statusText ? error.statusText : "400";
    this.logsPost.errorType = error.code ? error.code : error.name;
    this.logsPost.errorDesc = this.logMessage ? this.logMessage : error.message;
    this.logsPost.errorUser = this.logMessage ? this.logMessage : error.message;
    this.logsPost.createdDate = moment().format("MMMM Do YYYY, hh:mm:ss a");

    console.log(this.logsPost);

    this.apiService.addAuthLogs(this.logsPost);
  }

  async showCalendarModal() 
  {
    const modal = await this.modalController.create({
      component: DateCalendarComponent,
      cssClass: 'date-calendar-modal',
      componentProps: {data: this.birthDate}
    });

    modal.present();

    modal.onDidDismiss().then(dateData => {
      if(dateData.data) {
        this.birthDate = dateData.data.birthDate;
        this.firstStep.patchValue({birthDate: moment(dateData.data.birthDate).format('D-MMM-yyyy')});
      }
    })
  }

}
