import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Plugins, NetworkStatus } from '@capacitor/core';

const { Network } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  status: BehaviorSubject<NetworkStatus> = new BehaviorSubject(null);

  constructor() {
    // INFO: To stop listening use handler.remove();
    Network.addListener('networkStatusChange', (status) => {
      this.status.next(status);
    });

    Network.getStatus().then((status) => this.status.next(status));
  }
}
