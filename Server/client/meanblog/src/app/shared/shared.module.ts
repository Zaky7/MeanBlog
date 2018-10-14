import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent, NavbarComponent } from './layout';
import { ListErrorsComponent } from './list-errors.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    NavbarComponent,
    ListErrorsComponent
  ],
  exports: [
    HeaderComponent,
    NavbarComponent,
    ListErrorsComponent,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class SharedModule {

}
