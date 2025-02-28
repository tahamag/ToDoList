import { Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { HomeComponent } from './components/home/home.component';
import { TaskComponent } from './components/task/task.component';
import { ToDOComponent } from './components/to-do/to-do.component';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'task', component: TaskComponent },
  { path: 'toDo', component: ToDOComponent },
  { path: 'login', component: LoginComponent },
]
