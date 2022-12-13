import { ProductModel } from './product.model';
import { MemberCardsModel } from './member-cards.model';
import { SpouseModel } from './spouse.model';
import { DependentModel } from './dependent.model';
import { AddressModel } from './address.model';

export enum MemberStatus {
  Active = 1,
  Cancelled,
  Suspended,
}

export class MemberModel {
  id?: number;
  status?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cellPhone?: string;
  address?: AddressModel;
  birthDate?: string;
  renewDate?: string;
  effectiveDate?: string;
  selfPay?: boolean;
  spouse?: SpouseModel;
  dependents?: DependentModel[] = [];
  products?: ProductModel[] = [];
  productCategoryName?: string;
  memberCards?: MemberCardsModel;

  constructor(object?: any) {
    this.id = object.memberId;
    this.status = object.active.toLowerCase();
    this.firstName = object.firstName;
    this.middleName = object.mi;
    this.lastName = object.lastName;
    this.email = object.email;
    this.phone = object.phone;
    this.cellPhone = object.cellPhone;
    this.birthDate = object.birthDate;
    this.renewDate = object.renewDate;
    this.effectiveDate = object.effectiveDate;
    this.selfPay = object.selfPay;
    this.productCategoryName = object.productCategoryName;

    this.address = new AddressModel(object.benefitAddressDetails);
    this.memberCards = new MemberCardsModel(object.memberCards);

    if (object.products.length) {
      const products: ProductModel[] = [];

      object.products.forEach(
        (dependent: any) => {
          products.push(new ProductModel(dependent));
        },
      );

      this.products = products;
    }

    if (object.spouseFirst) {
      this.spouse = new SpouseModel(object);
    }

    if (object.dependants.length) {
      const dependents: DependentModel[] = [];

      object.dependants.forEach(
        (dependent: any) => {
          dependents.push(new DependentModel(dependent));
        },
      );

      this.dependents = dependents.sort((a, b) => (a.id - b.id));
    }
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // INFO: https://pe.usps.com/BusinessMail101?ViewName=DeliveryAddress
  getFullAddressString(): string {
    return [
      this.address.address1,
      this.address.address2,
      this.address.address3,
      this.address.city,
      this.address.stateCode,
      this.address.countryCode,
      this.address.zip,
    ].filter(Boolean).join(', ').toUpperCase();
  }
}
