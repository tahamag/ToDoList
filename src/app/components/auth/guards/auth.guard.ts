import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const userRole = route.data['role'];

  const userData = sessionStorage.getItem('user');

  const user = JSON.parse(userData!);

  if(!user){
    router.navigate(['/unauthorized']);
  }
  if (userRole.includes(user.role)) {
    return true;
  } else {
    router.navigate(['/unauthorized'])
    return false;
  }
};
