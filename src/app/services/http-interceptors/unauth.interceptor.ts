import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { NavController } from '@ionic/angular';

import { AuthenticationService } from '../authentication/authentication.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UnauthInterceptor implements HttpInterceptor {
  constructor(
    private navController: NavController,
    private authentication: AuthenticationService,
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        async (requestError: any) => {
          if (requestError instanceof HttpErrorResponse && requestError.status === 401) {
            await this.authentication.logout();
            await this.navController.navigateRoot('/auth/login');
          }
        },
      ),
    );
  }
}
