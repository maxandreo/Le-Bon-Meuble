import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SignupData } from '../models/signup-data.model';
import { SuccessSignupComponent } from '../success-signup/success-signup.component';
import { MatDialog } from '@angular/material';
import { UserData } from '../models/userData.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private tokenTimer: any;
  private token: string;
  private idUser: string;
  private nomUser: string;
  // Subject pour push authentication info to components interested
  private authStatusListener = new Subject<boolean>();

  public currentUser = {} as UserData;
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIdUser() {
    return this.idUser;
  }

  getnomUser() {
    const userData = localStorage.getItem('nomUser');
    if (userData === 'null') {
      return (this.nomUser = userData);
    } else {
      return this.nomUser;
    }
  }

  getAuthStatusListener() {
    // Indiquer aux autres componenets que l'on est logué ou non (Bool)
    return this.authStatusListener.asObservable();
  }

  createUser(nomUser: string, email: string, password: string, ville: any) {
    const signupData: SignupData = {
      nomUser,
      email,
      password,
      ville
    };
    return this.http
      .post('http://localhost:3000/api' + '/signup', signupData);

  }

  login(nomUser: string, email: string, password: string) {
    const signupData: SignupData = {
      nomUser,
      email,
      password
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        nomUser: string;
        idUser: string;
        lat: string;
        lng: string;
      }>('http://localhost:3000/api' + '/login', signupData)
      .subscribe(
        response => {
          // console.log(response);
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            // console.log(expiresInDuration);
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.idUser = response.idUser;
            this.nomUser = response.nomUser;
            this.currentUser._id = response.idUser;
            this.currentUser.nomUser = response.nomUser;
            this.currentUser.email = email;
            this.currentUser.lat = response.lat;
            this.currentUser.lng = response.lng;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expirationDate,
              this.idUser,
              this.nomUser,
              this.currentUser.lat,
              this.currentUser.lng
            );
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Authentifier automatiquement User avec token du LocalStorage
  // si l'on est toujours connecté et qu'on refresh la page
  autoAuthUser() {
    const authInformation = this.getAuthData();
    console.log('autoAuth :' + authInformation);
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.idUser = authInformation.idUser;
      this.nomUser = authInformation.nomUser;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.idUser = null;
    this.nomUser = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting time: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Store data in LocalStorage
  private saveAuthData(
    token: string,
    expirationDate: Date,
    idUser: string,
    nomUser: string,
    lat: any,
    lng: any
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('idUser', idUser);
    localStorage.setItem('nomUser', nomUser);
    localStorage.setItem('lat', lat);
    localStorage.setItem('lng', lng);
  }

  // clear data in LocalStorage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('idUser');
    localStorage.removeItem('nomUser');
    localStorage.removeItem('lat');
    localStorage.removeItem('lng');
  }

  // Obtenir AuthData
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const idUser = localStorage.getItem('idUser');
    const nomUser = localStorage.getItem('nomUser');
    const lat = localStorage.getItem('lat');
    const lng = localStorage.getItem('lng');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      idUser,
      nomUser,
      lat,
      lng
    };
  }
}
