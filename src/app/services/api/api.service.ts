import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
import { LogsModel } from 'src/app/models/logs.model';
import * as moment from 'moment';
import { AddressPost, PaymentCard } from 'src/app/models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;
  private documentUrl1: string;
  private logsUrl: string;
  private paymentCardUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
    this.documentUrl1 = environment.documentBaseUrl1;
    this.paymentCardUrl = environment.paymentCardUrl;
    this.logsUrl = environment.logsUrl;
  }

  lookupMember(memberId: string, birthDate: string, lastName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}registration/member`, { params: { memberId, dateOfBirth: birthDate, lastName } });
  }

  getMemberInformation(): Observable<any> {
    return this.http.get(`${this.baseUrl}member/`);
  }

  getMemberClaims(): Observable<any> {
    return this.http.get(`${this.baseUrl}member/claim`);
  }

  getMemberClaim(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}member/claim/${id}`);
  }

  getMemberBenefits(): Observable<any> {
    return this.http.get(`${this.baseUrl}member/benefit`);
  }

  getMemberPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}member/payment`);
  }

  getMemberServicesAgreementToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}member/fulfillment/msatoken`);
  }

  getDocuments(memberId): Observable<any> {  
    return this.http.get(`${this.documentUrl1}?id=${memberId}&idType=Member&productId=0`);
  }

  addAuthLogs(logsPost: LogsModel): Observable<any> {
    return this.http.post(this.logsUrl, logsPost);
  }

  addLogs(screenName, errorResp, deviceInfo): Observable<any> {
    console.log(errorResp);
    let logsPost: LogsModel = {
      ScreenName: screenName  
    };
    
    logsPost.clientInfo = deviceInfo
    logsPost.api = errorResp.url;
    logsPost.apiResonse = errorResp.name;
    logsPost.errorStatus = errorResp.statusText;
    logsPost.errorType = errorResp.error.error;
    logsPost.errorDesc = errorResp.error.error_description;  
    logsPost.errorUser = errorResp.error.error_description;
    logsPost.createdDate = moment().format("MMMM Do YYYY, hh:mm:ss a");

    console.log(logsPost);
    
    return this.http.post(this.logsUrl, logsPost);
  }

  getCardDetails(customerId): Observable<any>
  {
    return this.http.get(`${this.paymentCardUrl}customer/${customerId}`);
  }

  updateCardDetails(postData: PaymentCard): Observable<any>
  {
    return this.http.put(`${this.paymentCardUrl}paymethod`, postData);
  }

  updateAddressDetails(postData: AddressPost): Observable<any>
  {
    return this.http.put(`${this.paymentCardUrl}addresses`, postData);
  }
}
