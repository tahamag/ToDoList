import { TaskService } from './../../services/task/task.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import { TaskFormComponent } from '../task-form/task-form.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Task } from '../../models/tasks';
import { BehaviorSubject } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


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

  //TaskService = inject(TaskService)

  displayedColumns: string[] = ['position', 'name', 'weight',"Action"];
  dataSource = ELEMENT_DATA;
  dialog = inject(MatDialog);

  openDialog(){
    let dialogRef = this.dialog.open(TaskFormComponent, {
      height: '600px',
      width: '600px',
    });
  }
  task = signal<Task[]>([])

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private TaskService : TaskService){}
  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(){
    this.TaskService.getTasks().subscribe({
      next :(response : any)=>{
        /*this.task.set(response.tasks)
        console.log(response.tasks)
        console.log(this.task)*/

        this.tasksSubject.next(response.tasks);
        console.log(response.tasks);
        console.log(this.tasksSubject.getValue());
      },
      error:(err : any)=>{
        console.log(err.error);
      }
    })
  }


  /*
    openTaskDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        task,
        users: this.taskService.users()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.taskService.updateTask(task.id!, result);
        } else {
          this.taskService.addTask(result);
        }
      }
    });
  }
  */
}
