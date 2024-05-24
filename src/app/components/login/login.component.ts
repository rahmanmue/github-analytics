import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isInvalid = false;
  constructor(
    private userService: UserService,  
    private routeMod: Router
  ){}

  loginForm = new FormGroup({
    token: new FormControl('', Validators.required),
  })

  login() {
    if(this.loginForm.valid){
     this.userService.getUserByToken(this.loginForm.value.token as string)
      .subscribe({
        next : data => {
          // console.log(data)
          localStorage.setItem('token', this.loginForm.value.token as string);
          localStorage.setItem('username', data.login)
          this.routeMod.navigate(['/dashboard']);
          return
        },
        error : err => this.isInvalid = true
      })
    }else{
      this.isInvalid = true;
      return
    }
  }
}
