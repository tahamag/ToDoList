import { Injectable, signal } from '@angular/core';
import { Task } from '../../models/tasks';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:5500';
  tasks$ = signal<Task[]>([]);
  users = signal<User[]>([]);

  constructor(private http :HttpClient ) { }
  
  getTasks(): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks`)
    .pipe(
      map((tasks : Task)=>tasks),
      catchError((error)=>{
        console.error('error tasks service', error)
        return throwError(() => error);
      }),
    )
  }


  addTask(task: Omit<Task , "id">): Observable<Task>{
    return this.http.post<Task>(this.apiUrl+"/tasks" , task).pipe(
      tap((newTask)=>{
        this.tasks$.update((tasks)=>[...tasks , newTask])
      }),
    )
  }

  updateTask(task: Task): Observable<Task>{
    return this.http.put<Task>(this.apiUrl+"/tasks/"+task._id, task).pipe(
      tap((updatedTask)=>{
        this.tasks$.update((tasks) => tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
      }),
    )
  }

  updateStatus(tasks: Task[], status : string): Observable<any>{

    /**/return this.http.put<Task[]>(this.apiUrl+"/status/"+status, tasks).pipe(
      tap((updatedTask)=>{
        console.log(updatedTask)
        //this.tasks$.update((tasks) => tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
      }),
    )
    
  }

  deleteTask(id : string) : Observable<void>{
    return this.http.delete<void>(this.apiUrl+"/tasks/"+id).pipe
    (
      tap(() => {
        this.tasks$.update((tasks)=>tasks.filter((t) => t._id !==id))
      }),
    )
  }
}
