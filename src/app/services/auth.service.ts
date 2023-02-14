import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const baseUrl = 'http://localhost:8000/api/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = false;
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  login(data:any): Observable<any> {
    this.isAuthenticated = true;
    return this.http.post(`${baseUrl}login/`, data);
  }

  register(data:any): Observable<any> {
    return this.http.post(`${baseUrl}register/`, data);
  }

  logout(){
    this.isAuthenticated = false;
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}