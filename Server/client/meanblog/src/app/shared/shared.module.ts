import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';
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
    RouterModule,
    FlashMessagesModule.forRoot(),
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
    CommonModule,
    FlashMessagesModule
  ]
})
export class SharedModule {

}
