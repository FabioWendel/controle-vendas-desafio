import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register(product: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  updateProduct(productId: number, product: FormData): Observable<any> {
    return this.http.put<Product>(
      `${this.apiUrl}/products/${productId}`,
      product
    );
  }

  updateProductStock(productId: number, product: FormData): Observable<any> {
    return this.http.put<Product>(
      `${this.apiUrl}/products/${productId}/update-stock`,
      product
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}`);
  }
}
