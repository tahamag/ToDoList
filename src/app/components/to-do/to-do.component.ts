import { Component, inject, OnInit } from '@angular/core';
import {
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatGridListModule } from '@angular/material/grid-list';
import { TaskService } from '../../services/task/task.service';
import { BehaviorSubject, take } from 'rxjs';
import { Task } from '../../models/tasks';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-to-do',
  imports: [CdkDropList, CdkDrag,CdkAccordionModule,MatGridListModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      MatButtonModule,],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.css'
})


export class ToDOComponent  {
  TS = inject(TaskService);
  task$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  isVisible : boolean = false;
  taskForm : FormGroup;

  pending :Task[] = [];
  inprogress?: Task[] =[]
  completed?: Task[] =[]


    constructor(
      private TaskService : TaskService,
      private fb : FormBuilder,
    ) {
      this.taskForm = this.fb.group({
        title : [''],
        description : [''],
        taskDate : [''],
        validationDate : [''],
      });
    }

  ngOnInit(): void {
    this.getTasks();
  }


  getTasks(){
    this.TS.getTasks().subscribe({
      next :(response : any)=>{
        this.task$.next(response.tasks);

        this.pending = this.task$.value.filter(task => task.status === 'pending');
        this.inprogress = this.task$.value.filter(task => task.status === 'in-progress');
        this.completed = this.task$.value.filter(task => task.status === 'completed');
        console.log(this.pending)
      },
      error:(err : any)=>{
        console.log(err.error);
      }
    })
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  Detail(selected : any){
    this.taskForm.patchValue({
      title : selected.title ,
      description : selected.description ,
      taskDate :  this.FormatDate(selected.taskDate),
      validationDate : this.FormatDate(selected.validationDate)  ,
    });
    this.isVisible = true;
  }
  Save(){
    console.log(this.pending)
    console.log(this.inprogress)
    console.log("hy")
  }

  FormatDate(date? : Date ){
    return date? new Date(date).getFullYear() + '/' + new Date(date).getMonth() + '/' + new Date(date).getDay() : ''
  }
}
