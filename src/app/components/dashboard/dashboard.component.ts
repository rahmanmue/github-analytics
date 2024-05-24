import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { UserService } from '../../services/user.service';
import { DatePipe, NgClass } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, NgClass, NavbarComponent, RouterOutlet,RouterLink, DatePipe, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title= "Github Analytics";
  user!:any;
  active!:string;
  

  setTab(tab:string){
    this.active = tab;
  }
 
  constructor(
    private userService: UserService, 
  ){}

  ngOnInit(){
    this.getUser();
  }


  getUser(){
    this.userService.getUser().subscribe({
      next: data => {
        this.user = data;
      },
      error: err => console.log(err)
    })
  }
  
  
}
