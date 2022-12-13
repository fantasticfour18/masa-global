import { Component, OnDestroy } from '@angular/core';

import { IonRefresher } from '@ionic/angular';

import { ApiService } from '../services/api/api.service';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { ToastrService } from '../services/toastr/toasts.service';

import { ClaimModel } from '../models/claim.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { DateFormatService } from '../services/date-format/date-format.service';

const { Device } = Plugins;

@Component({
  selector: 'app-claims',
  templateUrl: './claims.page.html',
  styleUrls: ['./claims.page.scss'],
})
export class ClaimsPage implements OnDestroy {
  claims: ClaimModel[];
  deviceInfo: any = null;

  size = Array;

  private alive: Subject<any> = new Subject();

  constructor(
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private apiService: ApiService,
    public dateService: DateFormatService
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
    this.apiService.getMemberClaims()
      .pipe(
        takeUntil(this.alive),
        finalize(() => {
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe(
        async (claimsResponse: any[]) => {
          await this.toastrService.dismiss();

          const claims: ClaimModel[] = [];

          claimsResponse.forEach(
            (claim: any) => {
              claims.push(new ClaimModel(claim));
            },
          );

          this.claims = claims;
        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
          this.apiService.addLogs('Claims', error, this.deviceInfo);
        },
    );
  }
}
