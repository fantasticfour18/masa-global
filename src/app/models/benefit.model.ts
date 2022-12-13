export class BenefitModel {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  icon?: string;
  productCode?: string;

  constructor(object?: any) {
    this.id = object.id;
    this.code = object.code;
    this.icon = object.icon;
    this.name = object.name;
    this.description = object.description;
    this.icon = object.icon;
    this.productCode = object.productCode;
  }
}
