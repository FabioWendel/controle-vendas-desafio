import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sales`);
  }
}
