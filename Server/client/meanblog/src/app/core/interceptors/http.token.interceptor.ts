import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { Observable } from 'rxjs';


@Injectable()
export class HttpTokenInterceptor implements HttpTokenInterceptor {
   constructor(private jwtService: JwtService) {
   }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const headerConfig = {
        'Content-Type': 'application/json',
        'Accept': 'application/josn'
      };

      const token = this.jwtService.getToken();

      if (token) {
        headerConfig['Authorization'] = `Bearer ${token}`;
      }

      const request = req.clone({setHeaders: headerConfig});

      return next.handle(request);
   }


}
