import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = checkAuthentication();
  const routeMod = inject(Router)

  if(!isAuthenticated){
    routeMod.navigate(['/login'])
    return false;
  }
  return true;
};

function checkAuthentication(){
  const isLogin = localStorage.getItem('token') ? true : false;
  return isLogin;
}
