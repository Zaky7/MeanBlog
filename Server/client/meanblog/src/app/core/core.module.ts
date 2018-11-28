import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtService } from './services/jwt.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors';
import { UserService, ApiService } from './services';


@NgModule({
  imports: [
    CommonModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    UserService,
    JwtService,
    ApiService
    ]
})
export class CoreModule {

}
