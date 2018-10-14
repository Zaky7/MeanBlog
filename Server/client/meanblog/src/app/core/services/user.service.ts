import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '..';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable()
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);

  // distinctUntilChanged is used to
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();


  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private httpClient: HttpClient
  ) {}

  // Verify JWT in localStorage with Server & load user's info
  // This runs once on application startup

  populate() {
    // if JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      // Get the user details user is authorized
      console.log(`/user Rest Call`);
    } else {
      // Remove the potentials remnants of previous auth
      this.purgeAuth();
    }
  }

  purgeAuth() {
    // Remove the JWT Token from the LocalStorage
    this.jwtService.destroyToken();
    // Set the current user to empty Object
    this.currentUserSubject.next({} as User);
    // Set auth Status to false
    this.isAuthenticatedSubject.next(false);
  }

  setAuth(user: User) {
    // Save JWT sent from server in localStorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }


  attemptAuth(type, credentials) {
    const route = (type === 'register') ? '/signup' : '';

    console.log(`Request Sent`);
    return this.apiService.post('/user' + route, {user: credentials})
      .pipe(map(
      data => {
        console.log(data);
        this.setAuth(data.user);
        return data;
      }
    ));


}

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // // Update the user on the server (email, pass, etc)
  // update(user): Observable<User> {
  //   return this.apiService
  //   .put('/user', { user })
  //   .pipe(map(data => {
  //     // Update the currentUser observable
  //     this.currentUserSubject.next(data.user);
  //     return data.user;
  //   }));
  // }

}
