import { JwtResource } from '../model';

export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresIn: number | null = null;
  private refreshTokenKey = 'RT';

  private static instance: AuthService;
  private constructor() {}

  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }

    return this.instance;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem(this.refreshTokenKey);
    }
    return this.refreshToken;
  }

  store(resource: JwtResource) {
    const { accessToken, expiresIn, refreshToken } = resource;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;

    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresIn = null;

    localStorage.removeItem(this.refreshTokenKey);
  }
}
