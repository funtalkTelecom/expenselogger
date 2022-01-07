import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    UrlSegment,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree, Router
} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {AuthService} from '../service/auth.service';
import {AppRoutes, StorageKeys} from '../common/constant';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {LocalStoreService} from '../service/localstore.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private router: Router,
        private localStoreService: LocalStoreService,
        private authService: AuthService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

          return this.localStoreService.getFromLocalStorage(StorageKeys.ACTIVE_USER).then((response) => {

            console.log('-----------'+response);
            if (response !== null && response === true) {
                return true;
            } else {
                this.router.navigateByUrl(AppRoutes.LOGIN);
            }
        });

    }

    canActivateChild(next: ActivatedRouteSnapshot,state: RouterStateSnapshot):
       Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

            return true;
    }

    canLoad(route: Route,segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

          return this.authService.isAuthenticated.pipe(
              filter(val => val !== null), // Filter out initial Behaviour subject value
              take(1), // Otherwise the Observable doesn't complete!
              map(isAuthenticated => {
                if (isAuthenticated) {
                  return true;
                } else {

                  console.log('this.authService.isAuthenticated is false.');

                  this.router.navigateByUrl(AppRoutes.LOGIN);
                  return false;
                }
              })
            );
    }
}
