import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
import { MatButtonModule } from '@angular/material/button';


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
    MatButtonModule,
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
export class TaskFormComponent implements OnInit {

  users : User[] = [];
  task : Task[] = [];
  taskForm : FormGroup;
  userForm : FormGroup;
  isEditing = false;
  CurrentUserId !: number;
  ErrorMessage : string = "";

  myControl = new FormControl<string | User>('');
  filteredOptions!: Observable<User[]>;


  ngOnInit() {
    this.loadUsers();

   // this.taskForm.get("status")?.disable();
   // this.taskForm.get("taskDate")?.disable();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.users.slice();
      }),
    );
  }

  loadUsers() {
    this.UserService.getDeveloppers().subscribe({
      next: (response : any) => {
        this.users = response.user;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(user => user.name.toLowerCase().includes(filterValue))
  }

  constructor(
    private TaskService : TaskService,
    private UserService : UserService,
    private fb : FormBuilder,
    private fbuser : FormBuilder,
  ) {
    this.taskForm = this.fb.group({
      title : ['', [Validators.required]],
      description : [''],
      taskDate : ['',Validators.required],
      status : ['pending',[Validators.required, this.stautsValidator]],
      userId :[''],
    });

    this.userForm = this.fbuser.group({
      developer:['',Validators.required],
    })
  }

  stautsValidator(control : AbstractControl) : ValidationErrors | null{
    return control.value === 'pending' ? null :{statusInvalid:true}
  }

  isControlInvalid() {
    if (this.myControl.dirty || this.myControl.touched) {
      const name = (this.myControl.value as User).name;

      if (!name) {
        return true;
      }
      const user = this.users.find(user => user.name === name);
      if (!user) {
        return true;
      }
    }
    return false;

  }
  onSubmit():void{
    if(this.taskForm.invalid)
      return ;
    const task : Task = this.taskForm.value;
    task.userId=(this.myControl.value as User)._id;
    console.log(task)

    this.TaskService.addTask(task).subscribe({
      next : (response : any)=>{
        console.log("added");
      },
      error:(err)=> {
        console.log(err.error)
        this.ErrorMessage = err.error.message? err.error.message : '';
      },
    })


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
