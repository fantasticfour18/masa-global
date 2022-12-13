export class SpouseModel {
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: string;
  email?: string;

  constructor(object?: any) {
    this.title = object.spouseTitle;
    this.firstName = object.spouseFirst;
    this.middleName = object.spouseMi;
    this.lastName = object.spouseLast;
    this.birthDate = object.spouseBirthDate;
    this.email = object.spouseEmail;
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
