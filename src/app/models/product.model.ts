export enum ProductType {
  Single = 1,
  Family,
}

export enum ProductFrequency {
  Weekly = 1,
  Biweekly,
  Monthly,
  Annually,
  Once,
  Lifetime,
  Semimonthly,
  Quinquennially,
}

export class ProductModel {
  id?: number;
  type?: ProductType;
  amount?: number;
  groupName?: string;
  frequency?: string;
  category?: string;
  upgradeProduct?: number;

  constructor(object?: any) {
    this.id = object.productId;
    this.type = object.productType;
    this.amount = object.amount;
    this.groupName = object.groupName;
    this.frequency = object.freqDesc;
    this.category = object.categoryName;
    this.upgradeProduct = object.upgradeProduct;

    if (this.frequency === 'Quinquennially') {
      this.frequency = 'Five Year';
    }
  }
}
