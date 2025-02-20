import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/partials/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

}
