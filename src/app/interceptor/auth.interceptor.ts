import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('token');
  // console.log("authToken", authToken)

  if(authToken){
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}` )
    });

    // console.log("new Req",newReq);
    return next(newReq);
  }

  return next(req);
};
