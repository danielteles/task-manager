import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CsrfService {
  private apiUrl = 'http://localhost:3000/get-csrf-token';
  private csrfToken: string = '';

  constructor(private http: HttpClient) {}

  fetchCsrfToken(): void {
    this.http.get<{ csrfToken: string }>(this.apiUrl).subscribe((response) => {
      this.csrfToken = response.csrfToken;
    });
  }

  get token(): string {
    return this.csrfToken;
  }
}
