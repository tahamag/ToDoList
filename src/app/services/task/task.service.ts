import { Injectable, signal } from '@angular/core';
import { Task } from '../../models/tasks';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:5500';
  tasks = signal<Task[]>([]);
  users = signal<User[]>([]);

  constructor(private http :HttpClient ) { }

  getTasks():Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl+"/tasks");
  }


  addTask(task: Omit<Task , "id">): Observable<Task>{
    return this.http.post<Task>(this.apiUrl+"/tasks" , task).pipe(
      tap((newTask)=>{
        this.tasks.update((tasks)=>[...tasks , newTask])
      }),
    )
  }

  updateTask(p0: number, task: Task): Observable<Task>{
    return this.http.put<Task>(this.apiUrl+"/task"+task.id, task).pipe(
      tap((updatedTask)=>{
        this.tasks.update((tasks) => tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      }),
    )
  }

  deleteTask(id : number) : Observable<void>{
    return this.http.delete<void>(this.apiUrl+"/task"+id).pipe
    (
      tap(() => {
        this.tasks.update((tasks)=>tasks.filter((t) => t.id !==id))
      }),
    )
  }
}
