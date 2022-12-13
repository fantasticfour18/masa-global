export const passwordMatchValidator = (
  passwordFieldName: string = 'newPassword',
  confirmPasswordFieldName: string = 'newPasswordConfirmation',
) => {
  return (control) => {
    if (control.get(passwordFieldName).value !== control.get(confirmPasswordFieldName).value) {
      control.get(confirmPasswordFieldName).setErrors({mismatch: true});
    } else {
      control.get(confirmPasswordFieldName).setErrors({mismatch: null});
      control.get(confirmPasswordFieldName).updateValueAndValidity({onlySelf: true, emitEvent: false});
    }
  };
};
