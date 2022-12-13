import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { MemberModel } from '../../../models/member.model';
import { TransportType } from '../../../models/member-cards.model';
import { ProductModel } from '../../../models/product.model';
import { DateFormatService } from 'src/app/services/date-format/date-format.service';

@Component({
  selector: 'app-membership-card',
  templateUrl: './membership-card.component.html',
  styleUrls: ['./membership-card.component.scss'],
})

export class MembershipCardComponent implements OnInit, OnDestroy {
  @Input('member')
  set member(member: MemberModel) {
    if (member) {
      this._member = member;
      this.mainProduct = member.products.find((product: ProductModel) => product.upgradeProduct === 0);
    }
  }
  get member(): MemberModel {
    return this._member;
  }

  @Input() loading: boolean;

  size = Array;
  transportType = TransportType;

  mainProduct: ProductModel;

  private _member: MemberModel;

  constructor(public dateService: DateFormatService) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
