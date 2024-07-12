import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seller, SellerUpdate } from '../models/seller.model';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register(user: Seller): Observable<Seller> {
    return this.http.post<Seller>(`${this.apiUrl}/sellers`, user);
  }

  getSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(`${this.apiUrl}/sellers`);
  }

  updateSeller(
    sallerId: number,
    saller: Partial<SellerUpdate>
  ): Observable<any> {
    return this.http.put<SellerUpdate>(
      `${this.apiUrl}/sellers/${sallerId}`,
      saller
    );
  }

  deleteSeller(sallerId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sellers/${sallerId}`);
  }
}
