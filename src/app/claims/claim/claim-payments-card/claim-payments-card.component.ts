import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ClaimModel } from '../../../models/claim.model';

@Component({
  selector: 'app-claim-payments-card',
  templateUrl: './claim-payments-card.component.html',
  styleUrls: ['./claim-payments-card.component.scss'],
})
export class ClaimPaymentsCardComponent implements OnInit, OnDestroy {
  @Input() claim: ClaimModel;

  size = Array;

  constructor() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
