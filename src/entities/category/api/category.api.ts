import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/interceptors';

import { CategoriesGetDTO, CategoryUpdateDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private readonly http = inject(HttpClient);

  fetchCategories(): Observable<CategoriesGetDTO[]> {
    return this.http.get<CategoriesGetDTO[]>(`${environment.serverUrl}/v1/categories`, { context: skipAuth() });
  }

  fetchFavCategories(): Observable<CategoriesGetDTO[]> {
    return this.http.get<CategoriesGetDTO[]>(`${environment.serverUrl}/v1/favorites`).pipe(map((res) => res.map(({ id, name }) => ({ id, name }))));
  }

  updateFavCategories(categoryUpdateDto: CategoryUpdateDTO) {
    return this.http.put(`${environment.serverUrl}/v1/favorites`, categoryUpdateDto);
  }
}
