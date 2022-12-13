import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DateFormatService } from 'src/app/services/date-format/date-format.service';

import { ClaimModel } from '../../../models/claim.model';

@Component({
  selector: 'app-claim-card',
  templateUrl: './claim-card.component.html',
  styleUrls: ['./claim-card.component.scss'],
})
export class ClaimCardComponent implements OnInit, OnDestroy {
  @Input() claim: ClaimModel;

  size = Array;

  constructor(public dateService: DateFormatService) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
