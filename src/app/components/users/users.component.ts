import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule , FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users : User[] = [];
  userForm : FormGroup;
  isEditing = false;
  CurrentUserId !: number;
  ErrorMessage : string = "";

  constructor (
    private UserService : UserService,
    private fb : FormBuilder
  ){
    this.userForm = this.fb.group({
      name : ['', [Validators.required , Validators.maxLength(30)] ],
      email : ['', [Validators.required , Validators.email] ],
      password : ['',[Validators.required , Validators.minLength(6)] ] ,  
      role : ['Project manager',[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.UserService.getUsers().subscribe({
      next: (response : any) => {
        this.users = response.user;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  onSubmit():void{

    if(this.userForm.invalid)
      return;

    const user : User = this.userForm.value;
    console.log(user)
    if(this.isEditing){
      user._id = this.CurrentUserId;
      this.UserService.updateUser(user).subscribe(()=>{
        this.loadUsers();
        this.resetForm();
      });
    }else{
      this.UserService.createUser(user).subscribe({
        next: (response : any) => {
          console.log(response);
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => {
          this.ErrorMessage = err.error.message;  
          console.log("err:",err.error)
        }
      });
    }
  }

  editUser(user : User):void{
    this.isEditing = true;
    this.CurrentUserId = user._id!;
    this.userForm.patchValue({
      name : user.name ,
      email : user.email,
      password: user.password
    });
  }

  deleteUser(id : string){
    if(confirm('are u sure you want to delete this user')){
      this.UserService.deleteUser(id).subscribe(()=>{
        this.loadUsers();
      })
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.ErrorMessage = '';
    this.userForm.reset();
  }
}
