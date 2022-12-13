export class AddressModel {
  id?: number;
  address1?: string;
  address2?: string;
  address3?: string;
  countryCode?: string;
  stateCode?: string;
  city?: string;
  zip?: string;
  zip4?: string;

  constructor(object?: any) {
    this.id = object.addressId;
    this.address1 = object.address1;
    this.address2 = object.address2;
    this.address3 = object.address3;
    this.countryCode = object.countryCode;
    this.stateCode = object.stateCode;
    this.city = object.city;
    this.zip = object.zip;
    this.zip4 = object.zip4;
  }
}
