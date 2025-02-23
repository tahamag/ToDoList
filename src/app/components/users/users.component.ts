import { UserService } from './../../services/user/user.service';
import { User } from './../../models/user';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule , FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone:true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatDialogModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  dialog = inject(MatDialog);
  userService  =  inject(UserService)

  users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  displayedColumns: string[] = ['name', 'email', 'role','Action'];
  constructor(){}

  openDialog(user? : User){
    let dialogRef = this.dialog.open(UserFormComponent, {
      height: '500px',
      width: '600px',
      data: {
        user,
        developer:user?._id
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadUsers();
    })
  }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next:(response : any)=>{
        this.users$.next(response.user);
      },
      error:(err : any)=>{
        console.log(err.error)
      }
    })

  }

  
  OnUpdate(user : User){
    this.openDialog(user)
  }

  
  OnDelete(id : string){
    if(confirm('are u sure you want to delete this user')){
      //todo : add verification for user if he had a task
      this.userService.deleteUser(id).subscribe(()=>{
        this.loadUsers();
      })
    }
  }




}
