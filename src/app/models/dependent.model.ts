export class DependentModel {
  id?: number;
  active?: boolean;
  enrolledCollege?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: string;

  constructor(object?: any) {
    this.id = object.dependantId;
    this.active = object.active;
    this.enrolledCollege = object.enrolledCollege;
    this.firstName = object.firstName;
    this.middleName = object.miName;
    this.lastName = object.lastName;
    this.birthDate = object.birthDate;
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
