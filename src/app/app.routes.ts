import { Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { HomeComponent } from './components/home/home.component';
import { TaskComponent } from './components/task/task.component';
import { ToDOComponent } from './components/to-do/to-do.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './components/auth/guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UsersComponent , canActivate : [authGuard] ,data :{ role :'Project manager'} },
  { path: 'task', component: TaskComponent , canActivate : [authGuard] ,data :{ role :'Project manager'} },
  { path: 'toDo', component: ToDOComponent , canActivate : [authGuard] ,data :{ role :['Project manager', 'Developer']}},
  { path: 'profile', component: ProfileComponent , canActivate : [authGuard] ,data :{ role :['Project manager', 'Developer']}},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'unauthorized' },
  { path: 'unauthorized', component : UnauthorizedComponent },
]
