import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonSlides, IonSegment, IonRefresher } from '@ionic/angular';

import { ApiService } from '../../services/api/api.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { ToastrService } from '../../services/toastr/toasts.service';

import { ClaimModel } from '../../models/claim.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.page.html',
  styleUrls: ['./claim.page.scss'],
})
export class ClaimPage implements OnDestroy {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @ViewChild(IonSegment, { static: true }) segment: IonSegment;

  claim: ClaimModel;

  slidesOptions: any;

  size = Array;

  private alive: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private apiService: ApiService,
  ) {
    this.slidesOptions = { autoHeight: true, allowTouchMove: false };
  }

  async ionViewDidEnter() {
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
    this.apiService.getMemberClaim(this.route.snapshot.params.claimId)
      .pipe(
        takeUntil(this.alive),
        finalize(() => {
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe(
        async (claimResponse) => {
          await this.toastrService.dismiss();

          this.claim = new ClaimModel(claimResponse);
        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
        },
    );
  }

  segmentChanged(event: CustomEvent) {
    this.slides.slideTo(event.detail.value);
  }

  slideChanged() {
    this.slides.getActiveIndex().then((index) => this.segment.value = `${index}`);
  }
}
