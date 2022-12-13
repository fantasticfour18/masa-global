import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DateFormatService } from 'src/app/services/date-format/date-format.service';

import { MemberModel } from '../../../models/member.model';

@Component({
  selector: 'app-spouse-card',
  templateUrl: './spouse-card.component.html',
  styleUrls: ['./spouse-card.component.scss'],
})
export class SpouseCardComponent implements OnInit, OnDestroy {
  @Input() member: MemberModel;
  @Input() loading: boolean;

  size = Array;

  constructor(public dateService: DateFormatService) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
