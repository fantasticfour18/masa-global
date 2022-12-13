import { Injectable } from '@angular/core';

import { AlertController } from '@ionic/angular';

import { ToastrService } from '../toastr/toasts.service';

export enum OverlayType {
  TOAST = 'toastr',
  ALERT = 'alert',
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly DEFAULT_TOASTR_OPTIONS = {
    color: 'danger',
    message: 'Something went wrong!',
    cssClass: 'custom-toastr',
    buttons: ['Close'],
  };

  private readonly DEFAULT_ALERT_OPTIONS = {
    header: 'Something went wrong!',
    message: 'Please contact us at 1-800-643-9023.',
    buttons: ['OK'],
  };

  constructor(
    private toastrService: ToastrService,
    private alertController: AlertController,
  ) {

  }

  async handleError(options, overlayType: OverlayType = OverlayType.TOAST): Promise<any> {
    let overlayOptions;

    switch (overlayType) {
      case (OverlayType.ALERT):
        overlayOptions = { ...this.DEFAULT_ALERT_OPTIONS, ...options };

        return this.showAlert(overlayOptions);

      case (OverlayType.TOAST):
        overlayOptions = { ...this.DEFAULT_TOASTR_OPTIONS, ...options };

        return this.toastrService.create(overlayOptions);
    }
  }

  private async showAlert(options): Promise<any> {
    return this.alertController.create(options).then(async (alert) => await alert.present());
  }
}
