import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/shared";

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private http = inject(HttpClient);

  onLogin(loginObj: { username: string, password: string }) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/login`, loginObj);
  }
}