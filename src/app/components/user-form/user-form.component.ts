import { UserService } from './../../services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  users : User[] = [];
  UserForm : FormGroup;
  isEditing = false;
  CurrentUserId !: string;
  ErrorMessage : string = "";
  readonly dialogRef = inject(MatDialogRef<UserFormComponent>);

  constructor(
    private UserService  : UserService,
    private fb : FormBuilder,
    // todo:get data for update
    @Inject(MAT_DIALOG_DATA) public data: {user : User }

  ){
    this.UserForm = this.fb.group({
      name : ['', [Validators.required , Validators.maxLength(30)] ],
      email : ['', [Validators.required , Validators.email] ],
      password : ['', ] ,
      role : ['Project manager',[Validators.required]]
    })

    if(data && data.user){
      this.isEditing = true;
      this.editUser(data.user);

    }

  }

  editUser(user : User):void{
    this.isEditing = true;
    this.UserForm.get("password")?.disable();
    this.CurrentUserId = user._id!;
    this.UserForm.patchValue({
      name : user.name ,
      email : user.email,
      role :user.role
    });
  }

  onSubmit():void{
    if(this.UserForm.invalid)
      return ;
    const user : User = this.UserForm.value;
    if(this.isEditing){
      user._id = this.CurrentUserId
      this.UserService.updateUser(user)
      .subscribe(
        ()=>this.onCancel()
        );

    }else{
      this.UserService.createUser(user).subscribe({
        next :()=>this.onCancel(),
        error:(err)=> {
            console.log(err.error);
            this.ErrorMessage = err.error.message;
        },
      })
    }
  }

  onCancel(){
    this.resetForm()
    this.dialogRef.close();
  }

  resetForm(): void {
    this.isEditing = false;
    this.ErrorMessage = '';
    this.UserForm.reset();
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
