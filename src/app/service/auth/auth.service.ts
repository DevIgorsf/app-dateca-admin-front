import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userService: UserService
    ) { }

  autenticar(usuario: string, senha: string): Observable<HttpResponse<any>> {
    return this.http
      .post(
        `${API}/login`,
        {
          login: usuario,
          password: senha,
        },
        { observe: 'response' }
      )
      .pipe(
        tap((res: HttpResponse<any>) => {
          const authToken = res.body.token;
          this.userService.verificarRole(authToken);
          this.userService.salvaToken(authToken);
        }),
        catchError((error: any) => {
          return throwError(() => error);
        })
      );
  }
}
