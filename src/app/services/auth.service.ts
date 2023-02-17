import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpRequestInterceptor } from '../http.interceptor';

const baseUrl = 'http://localhost:8000/api/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = false;
  private accessToken?: string;
  isDoctor = false;
  isPatient = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  async login(data: any): Promise<any> {
    return await lastValueFrom(this.http.post(`${baseUrl}login/`, data));
  }

  register(data: any): Observable<any> {
    return this.http.post(`${baseUrl}register/`, data);
  }

  logout() {
    this.accessToken = undefined;
    this.isAuthenticated = false;
    this.isDoctor=false;
    this.isPatient=false;
    this.router.navigate(['/login']);
  }

  setToken(token: any) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  setDoctor(isDoctor:boolean){
    this.isDoctor=isDoctor
  }
}