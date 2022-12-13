import { AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordWeakValidator = (control: AbstractControl): ValidationErrors | null => {
  if (control.value) {
    const password = control.value as string;
    const passwordErrors = [];

    if (!password.match(/(?=^.{8,99}$)/)) {
      passwordErrors.push('8-99 characters');
    } else {
      passwordErrors.filter((error) => error !== '8-99 characters');
    }

    if (!password.match(/(?=[A-Z])/)) {
      passwordErrors.push('uppercase');
    } else {
      passwordErrors.filter((error) => error !== 'uppercase');
    }

    if (!password.match(/(?=[a-z])/)) {
      passwordErrors.push('lowercase');
    } else {
      passwordErrors.filter((error) => error !== 'lowercase');
    }

    if (!password.match(/(?=[0-9])/)) {
      passwordErrors.push('number');
    } else {
      passwordErrors.filter((error) => error !== 'number');
    }

    if (password.match(/([!@#$%^&*(),.?":{}|<>';_~`/\[\]\-\\])/)) {
      passwordErrors.filter((error) => error !== 'special symbol');
    } else {
      passwordErrors.push('special symbol');
    }

    return !passwordErrors.length ? null : {weak: `${passwordErrors.join(', ')} required`};
  }

  return null;
};
