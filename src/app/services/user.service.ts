import { Injectable } from '@angular/core';
import { UserData } from '../models/userData.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // getUserbyId(idUser) {
  //   return this.http.get<UserData>(
  //     'http://localhost:3000/api' + '/user' + idUser
  //   );
  // }

  getUsers() {
    return this.http.get<UserData>('http://localhost:3000/api' + '/user');
  }
}
