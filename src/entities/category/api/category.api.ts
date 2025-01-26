import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/shared/environments';
import { CategoriesDTO } from '../model';
import { skipAuth } from 'src/shared/interceptors';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private http = inject(HttpClient);

  // 전체 카테고리 목록 조회
  fetchCategories(): Observable<CategoriesDTO[]> {
    return this.http.get<CategoriesDTO[]>(`${environment.serverUrl}/v1/categories`, { context: skipAuth() });
  }

  // 관심있는 카테고리 목록 조회
  fetchFavCategories(): Observable<CategoriesDTO[]> {
    return this.http.get<CategoriesDTO[]>(`${environment.serverUrl}/v1/categories/favorites`);
  }
}
