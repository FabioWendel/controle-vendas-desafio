import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { getUserType, isLoggedIn } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isLoggedIn()) {
      const userType = getUserType();
      const allowedTypes = next.data['allowedTypes'] as Array<string>;

      if (userType && allowedTypes.includes(userType)) {
        return true;
      } else {
        this.router.navigate(['/forbidden']);
        return false;
      }
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
