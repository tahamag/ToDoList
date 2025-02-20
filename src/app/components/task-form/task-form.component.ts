import {ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { map, Observable, of, startWith, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Task, User } from '../../models/tasks';
import { TaskService } from '../../services/task/task.service';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css' ,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr'},
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {

  users : User[] = [];
  task : Task[] = [];
  taskForm : FormGroup;
  isEditing = false;
  CurrentUserId !: number;
  ErrorMessage : string = "";

  myControl = new FormControl('');
  options: string[] = ['taha', 'mohammed', 'user', 'user1', 'majidi', 'mohammed taha'];
  filteredOptions!: Observable<User[]>;


  ngOnInit() {
    this.taskForm.get("status")?.disable();
    this.taskForm.get("taskDate")?.disable();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );


    this.loadUsers();
  }

  loadUsers() {
    this.UserService.getUsers().subscribe({
      next: (response : any) => {
        this.users = response.user;
        console.log(this.users);
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.name.toLowerCase().includes(filterValue))
  }

  constructor(
    private TaskService : TaskService,
    private UserService : UserService,
    private fb : FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title : ['', [Validators.required]],
      description : [''],
      taskDate : ['',Validators.required],
      status : ['pending',[Validators.required]],
      userId : ['1',[Validators.required]],
    });
  }
    matcher = new MyErrorStateMatcher();
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
