import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { NetworkService } from '../network/network.service';

import { Observable, throwError } from 'rxjs';

export class OfflineError extends Error {
  message = 'Check your network connection.';
}

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private networkStatus: boolean = null;

  constructor(
    private networkService: NetworkService,
  ) {
    this.networkService.status.subscribe(
      (status) => {
        status.connected ? this.networkStatus = true : this.networkStatus = false;
      },
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.networkStatus) {
      return throwError(new OfflineError());
    } else {
      return next.handle(request);
    }
  }
}
