import { Preferences } from '@capacitor/preferences';

import { JwtResource } from '../model';
import { computed, signal } from '@angular/core';

export class AuthService {
  private _accessToken: string | null = null;
  private _expiresIn: number | null = null;
  private refreshTokenKey = 'RT';
  private _accessTokenKey = 'AT';
  private _expiresInKey = 'EXP';

  private _isLoggedIn = signal<boolean>(false);

  private static instance: AuthService;

  readonly isLoggedIn = computed(() => this._isLoggedIn());

  private constructor() {}

  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }

    return this.instance;
  }

  async getAccessToken(): Promise<string | null> {
    const _accessToken = await Preferences.get({ key: this._accessTokenKey });
    return _accessToken.value;
  }

  async getRefreshToken(): Promise<string | null> {
    const refreshToken = await Preferences.get({ key: this.refreshTokenKey });
    return refreshToken.value;
  }

  async getExpiresIn(): Promise<number | null> {
    const exp = await Preferences.get({ key: this._expiresInKey });
    return exp.value ? Number(exp.value) : null;
  }

  async store(resource: JwtResource): Promise<void> {
    const { accessToken, expiresIn, refreshToken } = resource;
    this._accessToken = accessToken;
    this._expiresIn = expiresIn;

    if (refreshToken) {
      await Preferences.set({ key: this._accessTokenKey, value: this._accessToken });
      await Preferences.set({ key: this.refreshTokenKey, value: refreshToken });
      await Preferences.set({ key: this._expiresInKey, value: this._expiresIn.toString() });
    }

    this._isLoggedIn.set(true);
  }

  async clear() {
    this._accessToken = null;
    this._expiresIn = null;
    this._isLoggedIn.set(false);

    await Preferences.remove({ key: this.refreshTokenKey });
    await Preferences.remove({ key: this._accessTokenKey });
    await Preferences.remove({ key: this._expiresInKey });
  }
}
