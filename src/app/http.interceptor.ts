import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {
  private token?: string;

  constructor(
    private authService: AuthService
  ){}

  setToken(token?: string) {
    console.log(token);
    console.log("FROM SET");
    this.token = token;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req = req.clone({
    //   withCredentials: true,
    // });

    // return next.handle(req);
    // console.log(this.token);
    // console.log("FROM METH");

    this.token = this.authService.getToken();
    if (this.token) {
      
      const authReq = req.clone({
        
        headers: req.headers.set('Authorization', 'Bearer ' + this.token)
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];