import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user/user.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      MatDatepickerModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatRadioModule,
      MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  users : User[] = [];
  UserForm : FormGroup;
  ErrorMessage : string = "";
  hide = signal(true);

  constructor(
    private UserService  : UserService,
    private fb : FormBuilder,
    private router: Router
  ){
    this.UserForm = this.fb.group({
      email : ['majidi@mail.com', [Validators.required , Validators.email] ],
      password : ['Majidi@11',[Validators.required ]] ,
    })
  }


  onSubmit():void{
    if(this.UserForm.invalid)
      return ;

    const user : User = this.UserForm.value;

    this.UserService.login(user).subscribe({
      next :(res : any)=>{
        sessionStorage.setItem('user' , JSON.stringify(res.user));
        this.Redirect()
      },
      error:(err)=> {
          console.log(err.error);
          this.ErrorMessage = err.error.message;
      },
    })
  }

  Redirect(){
    //alert(sessionStorage?.getItem('user'))
    this.router.navigate(['/home']);
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
