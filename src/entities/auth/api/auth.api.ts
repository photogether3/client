import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/shared/environments";
import { RegisterDTO } from "../model";

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private http = inject(HttpClient);

  onLogin(loginObj: { email: string, password: string }) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/login`, loginObj);
  }

  onRegister(registerObj: RegisterDTO) {
    return this.http.post(`${environment.serverUrl}/api/v1/auth/register`, registerObj)
  }
}