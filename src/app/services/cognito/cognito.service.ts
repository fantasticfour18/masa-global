import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoIdToken,
  CognitoRefreshToken,
  ICognitoStorage,
} from 'amazon-cognito-identity-js';

import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

// INFO: to prevent saving cognito data to lacalstorage.
class NoopStorage implements ICognitoStorage {
  getItem(key: string): string {
    return '';
  }
  setItem(key: string, value: string) {}

  removeItem(key: string) {}

  clear() {}
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  cognitoUserPool: CognitoUserPool;

  constructor() {
    this.cognitoUserPool = new CognitoUserPool(environment.cognitoUserPoolData);
  }

  signUp(memberId: string, givenName: string, familyName: string, email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        const userAttributes = [
          new CognitoUserAttribute({ Name: 'custom:member_id', Value: memberId }),
          new CognitoUserAttribute({ Name: 'given_name', Value: givenName }),
          new CognitoUserAttribute({ Name: 'family_name', Value: familyName }),
        ];

        this.cognitoUserPool.signUp(
          email,
          password,
          userAttributes,
          null,
          (error, success) => {
            if (error) {
              reject(error);
            } else {
              resolve(success);
            }
          },
        );
      },
    );
  }

  confirmUser(verificationCode: string, username: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.cognitoUserPool, Storage: new NoopStorage() });

        cognitoUser.confirmRegistration(
          verificationCode,
          true,
          (error, success) => {
            if (error) {
              reject(error);
            } else {
              resolve(success);
            }
          },
        );
      },
    );
  }

  resendVerificationCode(email: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: email, Pool: this.cognitoUserPool, Storage: new NoopStorage() });

        cognitoUser.resendConfirmationCode(
          (error, success) => {
            if (error) {
              reject(error);
            } else {
              resolve(success);
            }
          },
        );
      },
    );
  }

  forgotPassword(email: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: email, Pool: this.cognitoUserPool, Storage: new NoopStorage() });

        cognitoUser.forgotPassword(
          {
            onSuccess: (success) => {
              resolve(success);
            },
            onFailure: (error) => {
              reject(error);
            },
          },
        );
      },
    );
  }

  confirmPassword(email: string, verificationCode: string, newPassword: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: email, Pool: this.cognitoUserPool, Storage: new NoopStorage() });

        cognitoUser.confirmPassword(
          verificationCode,
          newPassword,
          {
            onSuccess: () => {
              resolve({ success: true });
            },
            onFailure: (error) => {
              reject(error);
            },
          },
        );
      },
    );
  }

  changePassword(email: string, oldPassword: string, newPassword: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: email, Pool: this.cognitoUserPool, Storage: new NoopStorage() });
        const authDetails = new AuthenticationDetails({ Username: email, Password: oldPassword });

        cognitoUser.authenticateUser(
          authDetails,
          {
            onSuccess: (response) => {
              cognitoUser.changePassword(
                oldPassword,
                newPassword,
                (error, success) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(success);
                  }
                },
              );
            },
            onFailure: (error) => {
              reject(error);
            },
          },
        );
      },
    );
  }

  authenticate(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: email, Pool: this.cognitoUserPool, Storage: new NoopStorage() });
        const authDetails = new AuthenticationDetails({ Username: email, Password: password });

        cognitoUser.authenticateUser(
          authDetails,
          {
            onSuccess: (success) => {
              resolve(success);
            },
            onFailure: (error) => {
              reject(error);
            },
            newPasswordRequired: (userAttributes) => {
              // User was signed up by an admin and must provide new password and required attributes, if any, to complete authentication.
              // The api doesn't accept this field back
              userAttributes.email = email;
              delete userAttributes.email_verified;

              cognitoUser.completeNewPasswordChallenge(
                password,
                userAttributes,
                {
                  onSuccess: (success) => {
                    resolve(success);
                  },
                  onFailure: (error) => {
                    reject(error);
                  },
                },
              );
            },
          },
        );
      },
    );
  }

  refreshSession(username: string, refreshToken: string) {
    return new Promise(
      (resolve, reject) => {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.cognitoUserPool, Storage: new NoopStorage() });
        const cognitoRefreshToken = new CognitoRefreshToken({ RefreshToken: refreshToken });

        cognitoUser.refreshSession(
          cognitoRefreshToken,
          (error, newSession) => {
            if (!error) {
              resolve(newSession);
            } else {
              reject(error);
            }
          },
        );
      },
    );
  }

  isIdTokenValid(token: string, clockDrift: number): boolean {
    const cognitoIdToken = new CognitoIdToken({ IdToken: token });
    const tokenExpiration = cognitoIdToken.getExpiration();

    const now = Math.floor(new Date().valueOf() / 1000);
    const adjusted = now - clockDrift; //3200;
    /* console.log('adjusted....' + adjusted);
    console.log('tokenExpiration....' + tokenExpiration); */

    return (
      adjusted < tokenExpiration
    );
  }
}
