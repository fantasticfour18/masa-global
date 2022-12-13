import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

/**
 * Wraps ionic ToastrController to add more functionality.
 * - Dismisses existing toast when new one is created.
 * - Make safe dismiss (no error if there are no toasters)
 */
@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(
    private toastrController: ToastController,
  ) {

  }

  /**
   * Dismisses all toasts and creates new one
   */
  async create(options): Promise<any> {
    await this.dismiss();

    const toastr = await this.toastrController.create(options);

    return toastr.present();
  }

  /**
   * Dismisses all toasts, id parameter isn't used for now.
   */
  async dismiss(id?: string): Promise<boolean> {
    const toast = await this.toastrController.getTop();

    return toast ? this.toastrController.dismiss(toast) : false;
  }
}
