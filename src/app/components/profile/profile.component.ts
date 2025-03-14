import { Component, OnInit, signal } from '@angular/core';
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
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user! : User ;
  UserForm : FormGroup;
  CurrentUserId !: string;
  ErrorMessage : string = "";
  hide = signal(true);

  constructor(
    private UserService  : UserService,
    private fb : FormBuilder,
  ){
    this.UserForm = this.fb.group({
      name : ['', [Validators.required , Validators.maxLength(30)] ],
      email : ['', [Validators.required , Validators.email] ],
      password : ['', ],
      role : ['', ],
    })
    this.getUser();
  }

  getUser():void{

    const userData = sessionStorage.getItem('user');
    if (userData)
      this.user = JSON.parse(userData);
    else
      window.location.href = '/login';

    //this.UserForm.get("password")?.disable();
    this.CurrentUserId = this.user._id!;
    this.UserForm.patchValue({
      name : this.user.name ,
      email : this.user.email
    });
  }

  onSubmit():void{
    if(this.UserForm.invalid)
      return ;
    const updateUser : User = this.UserForm.value;
      updateUser._id = this.CurrentUserId
      this.UserService.updateUser(updateUser)
      .subscribe({
        next :(res : any)=>{
          sessionStorage.setItem('user' , JSON.stringify(res.user));
          window.location.href = '/profile';
        },
        error:(err)=> {
            console.log(err.error);
            this.ErrorMessage = err.error.message;
        },
      },
      );
      console.log(updateUser)
  }

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
