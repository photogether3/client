import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

export class AuthApi {
  private http = inject(HttpClient);

  onLogin(loginObj: { username: string, password: string }) {
    return this.http.post('server_url', loginObj);
  }
}