import { CognitoIdToken, CognitoRefreshToken, CognitoAccessToken } from 'amazon-cognito-identity-js';

import { Injectable } from '@angular/core';

import { IdentityService } from '../identity/identity.service';
import { CognitoService } from '../cognito/cognito.service';

interface CustomCognitoUserSession {
  clockDrift: number;

  getIdToken(): CognitoIdToken;
  getRefreshToken(): CognitoRefreshToken;
  getAccessToken(): CognitoAccessToken;
  isValid(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(
    private cognito: CognitoService,
    private identity: IdentityService,
  ) {

  }

  async login(login: string, password: string) {
    console.log('email: ' + login);
    console.log('pass: ' + password);
    const session = await this.cognito.authenticate(login, password) as CustomCognitoUserSession;
    console.log(session);

    await this.identity.login({
      username: session.getIdToken().payload.email,
      idToken: session.getIdToken().getJwtToken(),
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
      clockDrift: session.clockDrift,
    });
  }

  async logout() {
    await this.identity.logout();
  }

  async getIdTokenOrRefresh(): Promise<string> {
    let session = null;

    try {
      session = await this.identity.restoreSession();

      if (!session) {
        return null;
      }
    } catch (error) {
      console.error(error);

      this.logout();
    }

    if (this.cognito.isIdTokenValid(session.idToken, session.clockDrift)) {
      return session.idToken;
    } else {
      let newSession = null;

      try {
        newSession = await this.cognito.refreshSession(session.username, session.refreshToken) as CustomCognitoUserSession;
      } catch (error) {
        console.error(error);

        this.logout();
      }

      await this.identity.login(
        {
          username: newSession.getIdToken().payload.email,
          idToken: newSession.getIdToken().getJwtToken(),
          accessToken: newSession.getAccessToken().getJwtToken(),
          refreshToken: newSession.getRefreshToken().getToken(),
          clockDrift: newSession.clockDrift,
        },
      );

      return newSession.getIdToken().getJwtToken();
    }
  }
}
