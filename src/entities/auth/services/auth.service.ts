import { environment } from 'src/shared/environments';
import { JwtResource } from '../model';

export class AuthService {
  private accessToken: string | null = null;
  private expiresIn: number | null = null;
  private refreshTokenKey = 'RT';
  private accessTokenKey = 'AT';
  private expiresInKey = 'EXP';

  private static instance: AuthService;
  private constructor() {}

  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }

    return this.instance;
  }

  getAccessToken(): string | null {
    if (!environment.production) {
      const accessToken = localStorage.getItem(this.accessTokenKey);
      return accessToken;
    }

    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getExpiresIn(): number | null {
    if (!environment.production) {
      return Number(localStorage.getItem(this.expiresInKey));
    }

    return this.expiresIn;
  }

  store(resource: JwtResource): Promise<void> {
    const { accessToken, expiresIn, refreshToken } = resource;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;

    if (refreshToken) {
      if (!environment.production) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.expiresInKey, expiresIn.toString());
      }

      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    return Promise.resolve();
  }

  clear() {
    this.accessToken = null;
    this.expiresIn = null;

    localStorage.removeItem(this.refreshTokenKey);
  }
}
