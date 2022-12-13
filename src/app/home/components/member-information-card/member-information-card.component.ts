import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DateFormatService } from 'src/app/services/date-format/date-format.service';

import { MemberModel } from '../../../models/member.model';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-member-information-card',
  templateUrl: './member-information-card.component.html',
  styleUrls: ['./member-information-card.component.scss'],
})
export class MemberInformationCardComponent implements OnInit, OnDestroy {
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

  mainProduct: ProductModel;

  private _member: MemberModel;

  constructor(public dateService: DateFormatService) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
