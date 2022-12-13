import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  format(dateData) {
    return moment(dateData).format('D-MMM-YYYY');
  }
}
