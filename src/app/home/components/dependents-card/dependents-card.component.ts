import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { MemberModel } from '../../../models/member.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dependents-card',
  templateUrl: './dependents-card.component.html',
  styleUrls: ['./dependents-card.component.scss'],
})
export class DependentsCardComponent implements OnInit, OnDestroy {
  @Input() member: MemberModel;
  @Input() loading: boolean;

  size = Array;

  constructor() {

  }
  changeDate(val) {
    return moment(`${new Date(val).getUTCFullYear()}-${new Date(val).getUTCMonth()+1}-${new Date(val).getUTCDate()}`, "YYYY-MM-DD").format("D-MMM-YYYY"); 
  }
  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
