import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class UserService {

  private apiUrl = 'http://localhost:5500';

  constructor(private http : HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get(this.apiUrl + '/users')
  }

  createUser (user : User) : Observable<any>{
    return this.http.post(this.apiUrl + '/signup', user)
  }

  updateUser(user : User):Observable<any>{
    return this.http.put(this.apiUrl + `/users/${user._id}`, user)
  }

  deleteUser(id :string):Observable<any>{
    return this.http.delete(this.apiUrl + `/users/${id}`)
  }
}
