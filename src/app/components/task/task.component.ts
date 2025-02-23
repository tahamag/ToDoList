import { Task } from './../../models/tasks';
import { TaskService } from './../../services/task/task.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import { TaskFormComponent } from '../task-form/task-form.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-task',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatDialogModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})

export class TaskComponent implements OnInit  {

  TS = inject(TaskService)
  dialog = inject(MatDialog);

  task$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  displayedColumns: string[] = ['title', 'description', 'taskDate','status','user','validationDate','Action'];

  openDialog(task? : Task){
    let dialogRef = this.dialog.open(TaskFormComponent, {
      height: '600px',
      width: '600px',
      data: {
        task,
        developer:task?.userId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTasks();
    })
  }
  

  constructor( private TaskService : TaskService,){}
  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(){
    this.TS.getTasks().subscribe({
      next :(response : any)=>{
        this.task$.next(response.tasks);
      },
      error:(err : any)=>{
        console.log(err.error);
      }
    })
  }


  OnUpdate(task : Task){
    this.openDialog(task)
  }

  
  OnDelete(id : string){
    if(confirm('are u sure you want to delete this task')){
      this.TaskService.deleteTask(id).subscribe(()=>{
        this.getTasks();
      })
    }
  }
}
