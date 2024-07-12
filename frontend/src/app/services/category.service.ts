import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  updateCategory(
    categoryId: number,
    category: Partial<Category>
  ): Observable<any> {
    return this.http.put<Category>(
      `${this.apiUrl}/categories/${categoryId}`,
      category
    );
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${categoryId}`);
  }
}
