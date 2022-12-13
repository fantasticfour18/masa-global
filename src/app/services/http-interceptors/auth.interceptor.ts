import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthenticationService } from '../authentication/authentication.service';

import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(
      this.requestRequiresToken(request)
        ? this.authentication.getIdTokenOrRefresh().then(
            (token) => {
              if (token) {

                const routerURL = this.router.url;
                if(routerURL !== '/tabs/msa-documents' && !request.url.includes("CompassThirdPartyApis/forte/")) {
                    request = request.clone({
                      setHeaders: {
                      Authorization: 'Bearer ' + token,
                    },
                  });
                }
                else if((routerURL === '/tabs/msa-documents') && (request.url === environment.baseUrl + 'member/')) {
                  request = request.clone({
                      setHeaders: {
                      Authorization: 'Bearer ' + token,
                    },
                  });
                }
            }
          },
        )
        : Promise.resolve(),
    ).pipe(flatMap(() => next.handle(request)));
  }

  private requestRequiresToken(request: HttpRequest<any>): boolean {
    return !/\/login$/.test(request.url);
  }
}
