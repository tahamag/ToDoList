import { User } from './../../models/user';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class UserService {

  private apiUrl = 'http://localhost:5500';
  public users$ = signal<User[]>([]);

  constructor(private http : HttpClient) { }

  getUsers():Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/users`)
    .pipe(
      map((user : User)=>user),
      catchError((error)=>{
        console.log('get users error ',error)
        return throwError(()=> error)
      })
    )
  }

  login(user :User ):Observable<any>{
    console.log(user)
    return this.http.post<User>(this.apiUrl + '/signin', user)
  }

  getDevelopers():Observable<any>{
    return this.http.get(this.apiUrl + '/developper')
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
