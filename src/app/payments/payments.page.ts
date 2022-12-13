import { Component, OnDestroy } from '@angular/core';

import { IonRefresher } from '@ionic/angular';

import { ApiService } from '../services/api/api.service';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { ToastrService } from '../services/toastr/toasts.service';

import { PaymentModel } from '../models/payment.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service'
import { Plugins } from '@capacitor/core';
import { DateFormatService } from '../services/date-format/date-format.service';
import { Router } from '@angular/router';

const { Device } = Plugins;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnDestroy {
  payments: PaymentModel[];
  deviceInfo: any = null;

  size = Array;

  private alive: Subject<any> = new Subject();

  constructor(
    private apiService: ApiService,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private authentication: AuthenticationService,
    public dateService: DateFormatService,
    private router: Router
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
    this.apiService.getMemberPayments()
      .pipe(
        takeUntil(this.alive),
        finalize(() => {
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe(
        async (paymentsResponse: any[]) => {
          if(paymentsResponse['_type'] == 'NotAuthorizedException'){
            this.authentication.logout();
            return;
          }
          await this.toastrService.dismiss();

          const payments: PaymentModel[] = [];

          paymentsResponse.forEach(
            (benefit: any) => {
              payments.push(new PaymentModel(benefit));
            },
          );

          this.payments = payments;
        },
        async (error: any) => {
          await this.errorHandler.handleError({
            color: 'danger',
            message: error.message,
          });
          this.apiService.addLogs('Payments', error, this.deviceInfo);
        },
    );
  }

  navToProfile()
  {
    this.router.navigate(['tabs/profile/bank-details']);
  }

}
