import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService, 
    private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
      if (request.url.includes('/login')) {
        return next.handle(request);
      }
      
      if (this.tokenService.possuiToken()) {
        const token = this.tokenService.retornaToken();
        const headers = new HttpHeaders().set('authorization', 'Bearer ' + token);
        request = request.clone({ headers });
      }
      
      if((request.url.includes('/questao/imagens') || request.url.includes('/enade/imagens')) && (request.method === 'POST' || request.method === 'PUT') && !request.headers.has('Content-Type')) {
        const modifiedRequest = request.clone();
        return next.handle(modifiedRequest);
      }
      

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.tokenService.excluiToken()
            this.router.navigate(['/login']);
          }
          return next.handle(request);
        })
      );
  }
}
