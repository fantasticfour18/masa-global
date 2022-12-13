import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { OfflineInterceptor } from './offline.iterceptor';
import { AuthInterceptor } from './auth.interceptor';
import { UnauthInterceptor } from './unauth.interceptor';
import { TimeoutInterceptor } from './timeout.inteceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
];
