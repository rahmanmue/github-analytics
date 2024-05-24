import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const routeMod = inject(Router)
  const authToken = localStorage.getItem('token') ? true : false;
  const isLogin = state.url == '/login';
  if(authToken && isLogin){
    routeMod.navigate(['/dashboard'])
    return false;
  }
  
  return true;
};
