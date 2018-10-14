import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { throwError, Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ApiService {

   constructor(
     private http: HttpClient,
     private jwtService: JwtService
   ) {}

   private formatErrors(error: any) {
     return throwError(error.error);
   }

   get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
     return this.http.get(`${environment.api_url}${path}`, { params }).pipe(catchError(this.formatErrors));
   }

   post(path: string, body: Object = {}): Observable<any> {
     return this.http.post(`${environment.api_url}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
   }
}
