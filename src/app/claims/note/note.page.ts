import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonRefresher } from '@ionic/angular';

import { ApiService } from '../../services/api/api.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { ToastrService } from '../../services/toastr/toasts.service';

import { ClaimModel } from '../../models/claim.model';
import { NoteModel } from '../../models/note.model';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { DateFormatService } from 'src/app/services/date-format/date-format.service';

const { Device } = Plugins;

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnDestroy {
  claim: ClaimModel;
  note: NoteModel;
  deviceInfo: any = null;

  size = Array;

  private alive: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private toastrService: ToastrService,
    private apiService: ApiService,
    public dateService: DateFormatService
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

          if (this.claim.notes && this.claim.notes.length) {
            this.note = this.claim.notes.find(
              (note: NoteModel) => note.id === parseInt(this.route.snapshot.params.noteId, 10),
            );
          }
        },
        async (error: any) => {
          await this.errorHandler.handleError({ message: error.message });
          this.apiService.addLogs('Notes', error, this.deviceInfo);
        },
      );
  }
}
