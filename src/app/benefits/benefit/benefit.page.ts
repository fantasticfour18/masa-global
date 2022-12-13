import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonRefresher } from '@ionic/angular';

import { ApiService } from '../../services/api/api.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { ToastrService } from '../../services/toastr/toasts.service';
import { Plugins } from '@capacitor/core';

import { BenefitModel } from '../../models/benefit.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

const { Device } = Plugins

@Component({
  selector: 'app-benefit',
  templateUrl: './benefit.page.html',
  styleUrls: ['./benefit.page.scss'],
})
export class BenefitPage implements OnDestroy {
  benefit: BenefitModel;
  formattedBenefitDescription: string[];
  deviceInfo: any = null;

  size = Array;

  private alive: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private apiService: ApiService
  ) {

  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async ionViewDidEnter() {
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
          
          const currentBenefit = benefitsResponse.find(
            (benefit: BenefitModel) => benefit.id === parseInt(this.route.snapshot.params.benefitId, 10),
          );

          this.benefit = new BenefitModel(currentBenefit);

          this.formattedBenefitDescription = this.benefit.description.split(/\r\n?|\n/).filter(Boolean);
        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
          this.apiService.addLogs('Benefits', error, this.deviceInfo);
        },
    );
  }
}
