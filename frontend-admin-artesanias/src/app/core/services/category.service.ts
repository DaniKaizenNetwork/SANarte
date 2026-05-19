import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environment';
import { Category, CategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/admin/categorias`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  create(payload: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload);
  }

  update(id: number, payload: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
