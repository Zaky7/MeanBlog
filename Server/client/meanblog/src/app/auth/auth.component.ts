import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Errors } from '../core';
import { UserService } from '../core/services';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = {errors: {}};
  isSubmitting = false;
  authForm: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private _flashMessagesService: FlashMessagesService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.email],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';

      console.log('Auth Type: ' + this.authType);
      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
    });
  }

  verifyCredentials(credentials) {
    const errors = [];
    if (credentials.email) {
      // tslint:disable-next-line:max-line-length
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const isValidEmail =  regex.test(String(credentials.email).toLowerCase());

      if (!isValidEmail) {
          errors.push('Not valid Email Address');
      }
    }

    if (credentials.password) {
       if (credentials.password.length < 4) {
          errors.push('Password Length should be greater than 4 characters');
       }
    }
    return errors;
  }

  submitForm() {
    const credentials = this.authForm.value;
    const errors = this.verifyCredentials(credentials);
    console.log(errors);
    if (errors.length < 1) {
      this.userService.attemptAuth(this.authType, credentials).subscribe(
        data => this.router.navigateByUrl('/'),
        err => {
          this.errors = err;
          this.isSubmitting = false;
        }
      );
    } else {
      errors.map(error => {
        console.log(error);
        this._flashMessagesService.show(error, { cssClass: 'alert-danger', timeout: 18000 });
      });
    }
  }

  testFlasMessage() {
    this._flashMessagesService.show('Password not correct', { cssClass: 'alert-danger', timeout: 1800 });
  }

}
