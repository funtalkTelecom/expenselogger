import { Router } from '@angular/router';
import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, from, Observable, of, scheduled, throwError} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import { environment } from 'src/environments/environment';
import {LodashService} from './lodash.service';
import {LocalStoreService  } from './localstore.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit {

    isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    currentAccessToken = null;
    apiUrl = environment.apiUrl;

    private currentUserStatus: boolean;

    constructor(
        private http: HttpClient,
        private _: LodashService,
        private localStoreService: LocalStoreService,
        private router: Router
    ) {

        const token = this.localStoreService.getFromLocalStorage(ACCESS_TOKEN_KEY);

        token.then(localToken=>{
              if (localToken) {
                this.currentAccessToken = localToken;
                this.isAuthenticated.next(true);
              } else {
                this.isAuthenticated.next(false);
              }
            }
          );
     }


      // Get our secret protected data
    getSecretData() {
      return this.http.get(`${this.apiUrl}/users/secret`);
    }

    // Create new user
    signUp(credentials: {username: any; password: any}): Observable<any> {
      return this.http.post(`${this.apiUrl}/users`, credentials);
    }

    // Sign in a user and store access and refres token
    login(credentials: {username: any; password: any}): Observable<any> {

      return this.http.post(`${this.apiUrl}/login`, credentials).pipe(

        switchMap((tokens: {accessToken: any; refreshToken: any }) => {

          console.log(tokens);

          this.currentAccessToken = tokens.accessToken;
          const storeAccess = this.localStoreService.saveToLocalStorage(ACCESS_TOKEN_KEY,tokens.accessToken);
          const storeRefresh = this.localStoreService.saveToLocalStorage(REFRESH_TOKEN_KEY,tokens.refreshToken);
          return from(Promise.all([storeAccess, storeRefresh]));

        }),
        tap(_ => {
          this.isAuthenticated.next(true);
        })
      );

    }

    // Potentially perform a logout operation inside your API
    // or simply remove all local tokens and navigate to login
    logout() {
      // return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      //   switchMap(_ => {
      //     this.currentAccessToken = null;
      //     // Remove all stored tokens
      //     const deleteAccess = this.localStoreService.removeFromLocalStorage( ACCESS_TOKEN_KEY);
      //     const deleteRefresh = this.localStoreService.removeFromLocalStorage( REFRESH_TOKEN_KEY);
      //     return from(Promise.all([deleteAccess, deleteRefresh]));
      //   }),
      //   tap(_ => {
      //     this.isAuthenticated.next(false);
      //     this.router.navigateByUrl('/', { replaceUrl: true });
      //   })
      // ).subscribe();

      this.currentAccessToken = null;
      const deleteAccess = this.localStoreService.removeFromLocalStorage( ACCESS_TOKEN_KEY);
      const deleteRefresh = this.localStoreService.removeFromLocalStorage( REFRESH_TOKEN_KEY);
      this.isAuthenticated.next(false);
      this.router.navigateByUrl('/', { replaceUrl: true });

    }


    // RegisterWithEmailAndPassword(email: string, password: string): Promise<UserCredential>
    register(consumer: {unknown}): Observable<any> {
      console.log(consumer);
      return  this.http.post(`${this.apiUrl}/registerConsumer`,consumer);
    }

    // Load the refresh token from storage
    // then attach it as the header for one specific API call
    getNewAccessToken(): Observable<any> {

      const refreshToken = from(this.localStoreService.getFromLocalStorage(REFRESH_TOKEN_KEY));
      return refreshToken.pipe(
        switchMap(token => {
          if (token) {
            const httpOptions = {
              headers: new HttpHeaders({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: `Bearer:${token}`
              })
            };
            return this.http.get(`${this.apiUrl}/token/refresh`, httpOptions);
          } else {
            // No stored refresh token
            return of(null);
          }
        })
      );
    }

    // Store a new access token
    storeAccessToken(accessToken: any) {
      this.currentAccessToken = accessToken;
      return from(this.localStoreService.saveToLocalStorage(ACCESS_TOKEN_KEY,accessToken));
    }

    async getCurrentUserStatus(): Promise<boolean> {
        return this.currentUserStatus;
    }

    async setCurrentUserStatus(status: boolean): Promise<void> {
        this.currentUserStatus = status;
    }




    // Logout
    // async logout(): Promise<void> {
    //     // return await this.fireAuth.auth.signOut();
    // }

    // eslint-disable-next-line @angular-eslint/contextual-lifecycle
    ngOnInit(): void {
        // this.fireAuth.auth.currentUser.getIdTokenResult().then((token) => {
        //     console.log(token);
        //     if(token !== null) {
        //         this.activeUserStatus.next(true)
        //     }
        // });
    }

}

