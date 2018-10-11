import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtService } from './services/jwt.service';
import { UserService } from './services/user.service';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ JwtService, UserService ]
})
export class CoreModule {

}
