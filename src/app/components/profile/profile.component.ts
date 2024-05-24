import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  title="Profile Page"
  user!:any;
  name='';
  bio='';
  company='';

  location=''


  constructor(private userService: UserService, private router:Router){
    
  }

  ngOnInit(){
    this.userService.getUser().subscribe({
      next: data => {
        this.user = data;
        this.name = data.name;
        this.bio=data.bio;
        
        this.company = data.company;
        this.location = data.location;
        return

      },
      error: err => console.log(err)
    })
  }


 

  send(){
    this.userService.updateUserProfile({
      name: this.name,
      bio: this.bio,
      company:this.company,
      location: this.location,
    }).subscribe({
      next: res =>{
        console.log(res);
        this.router.navigate(['/dashboard']);
      } ,
      error: err => console.log(err)
    })

  }

}
