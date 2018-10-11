import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared';


  @NgModule({
    imports: [
      AuthRoutingModule,
      SharedModule
    ],
    declarations: [
      AuthComponent
    ],
    providers: [
          ]
  })
  export class AuthModule {

  }
