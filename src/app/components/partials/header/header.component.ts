import { Component, OnInit , } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuGroup,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule,MatIconModule,
      MatButtonModule,
      CdkMenu,
      CdkMenuItemCheckbox,
      CdkMenuTrigger,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isDeveloper: boolean = false;
  user!: any;


  constructor(private router: Router) {
  }


  ngOnInit(): void {
    this.FromSession();
  }


  FromSession(): void {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isDeveloper = this.user.role === 'developer';
      console.log(this.isDeveloper)
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    console.log('User  logged out');
    this.router.navigate(['/login']);
  }
}
