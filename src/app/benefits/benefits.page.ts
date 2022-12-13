import { Component, OnDestroy } from '@angular/core';

import { IonRefresher, LoadingController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';

import { ApiService } from '../services/api/api.service';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { ToastrService } from '../services/toastr/toasts.service';

import { BenefitModel } from '../models/benefit.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

const { Browser, Device } = Plugins;

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.page.html',
  styleUrls: ['./benefits.page.scss'],
})
export class BenefitsPage implements OnDestroy {
  benefits: BenefitModel[];
  deviceInfo: any = null;

  size = Array;

  private readonly msaUrl = `${environment.baseUrl}member/fulfillment/document`;
  private alive: Subject<any> = new Subject();

  constructor(
    private loadingController: LoadingController,
    private apiService: ApiService,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService
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

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  getData(event?: { target: IonRefresher }) {
    this.apiService.getMemberBenefits()
      .pipe(
        takeUntil(this.alive),
        finalize(() => {
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe(
        async (benefitsResponse: any[]) => {
          await this.toastrService.dismiss();

          const benefits: BenefitModel[] = [];

          benefitsResponse.forEach(
            (benefit: any) => {
              benefits.push(new BenefitModel(benefit));
            },
          );

          this.benefits = benefits;

        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
          this.apiService.addLogs('Benefits', error, this.deviceInfo);
        },
    );
  }

  /* async openMemberServicesAgreement() {
    await this.toastrService.dismiss();

    const loading = await this.loadingController.create({
      message: 'Loading...',
    });

    await loading.present();

    this.apiService.getMemberServicesAgreementToken()
      .pipe(
        takeUntil(this.alive),
        finalize(() => loading.dismiss()),
      )
      .subscribe(
        async (msaToken) => {
          await this.toastrService.dismiss();
          await Browser.open({ url: `${this.msaUrl}?id=${msaToken.fulfillment}` });
        },
        async (error: any) => {
          await this.errorHandler.handleError({
            color: 'danger',
            message: error.status === 404 ? 'MSA not available. Please contact us at 1-800-643-9023.' : error.message,
          });
        },
      );
  } */
}
