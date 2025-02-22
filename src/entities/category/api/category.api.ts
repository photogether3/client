import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/shared/environments';
import { CategoriesGetDTO, CategoryUpdateDTO } from '../model';
import { skipAuth } from 'src/shared/interceptors';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private http = inject(HttpClient);

  // 전체 카테고리 목록 조회
  fetchCategories(): Observable<CategoriesGetDTO[]> {
    return this.http.get<CategoriesGetDTO[]>(`${environment.serverUrl}/v1/categories`, { context: skipAuth() }).pipe(map((res) => res.map(({ id, name }) => ({ id, name }))));
  }

  // 관심있는 카테고리 목록 조회
  fetchFavCategories(): Observable<CategoriesGetDTO[]> {
    return this.http.get<CategoriesGetDTO[]>(`${environment.serverUrl}/v1/favorites`).pipe(map((res) => res.map(({ id, name }) => ({ id, name }))));
  }

  // 관심 카테고리 일괄 등록 또는 변경
  updateFavCategories(cateygoryUpdateDto: CategoryUpdateDTO) {
    return this.http.put(`${environment.serverUrl}/v1/favorites`, cateygoryUpdateDto);
  }
}
