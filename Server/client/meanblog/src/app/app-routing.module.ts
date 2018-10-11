import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared';



const appRoutes = [
  { path: '', component: HeaderComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports:
   [
    RouterModule
   ]
})


export class AppRoutingModule {

}
