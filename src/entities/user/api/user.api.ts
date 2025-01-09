import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/shared";

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private http = inject(HttpClient);

  onDuplicateEmail(email: string) {
    return this.http.get<{ isDuplicate: boolean }>(`${environment.serverUrl}/api/v1/users/emails/${email}/duplicated`)
  }
}