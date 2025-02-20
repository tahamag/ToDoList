import { Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { HomeComponent } from './components/home/home.component';
import { TaskComponent } from './components/task/task.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'task', component: TaskComponent },
];
