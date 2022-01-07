import { User } from './../interface/user';
import { Router } from '@angular/router';
import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, from, Observable, of, scheduled, throwError} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import { environment } from 'src/environments/environment';
import {LodashService} from './lodash.service';
import {LocalStoreService  } from './localstore.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { AppRoutes } from '../common/constant';
import { ModalController, ToastController } from '@ionic/angular';
import  jwtDecode  from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit {

    isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    consumerId=null;
    consumerRole=[];
    accessToken = null;
    apiUrl = environment.apiUrl;

    private currentUserStatus: boolean;

    constructor(
        private http: HttpClient,
        private _: LodashService,
        private localStoreService: LocalStoreService,
        private router: Router,
        private toastController: ToastController,
        private modalController: ModalController
    ) {

        const token = this.localStoreService.getFromLocalStorage(ACCESS_TOKEN_KEY);

        token.then(localToken=>{

              if (localToken) {
                  const decodedToken=jwtDecode<{sub: string;roles: []}>(localToken);
                  this.consumerId=decodedToken.sub;
                  this.consumerRole=decodedToken.roles;
                  this.accessToken = localToken;
                  this.isAuthenticated.next(true);
                  console.log(this.consumerId+'--'+this.consumerRole);

              } else {
                  this.consumerId=null;
                  this.consumerRole=[];
                  this.accessToken = null;
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
    login(credentials: {userName: any; passWord: any}): Observable<any> {

      this.accessToken=false;
      return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
        switchMap((tokens: {accessToken: any; refreshToken: any }) => {
          this.accessToken = tokens.accessToken;
          const decodedToken=jwtDecode<{sub: string;roles: []}>(this.accessToken);
          this.consumerId=decodedToken.sub;
          this.consumerRole=decodedToken.roles;
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
        this.consumerId=null;
        this.consumerRole=[];
        this.accessToken = null;
        this.isAuthenticated.next(false);
        console.log('logout');

        this.localStoreService.removeFromLocalStorage(ACCESS_TOKEN_KEY);
        this.localStoreService.removeFromLocalStorage(REFRESH_TOKEN_KEY);
        this.router.navigateByUrl(AppRoutes.LOGIN);

    }


    // RegisterWithEmailAndPassword(email: string, password: string): Promise<UserCredential>
    register(consumer: {unknown}): Observable<any> {
      console.log(consumer);
      return  this.http.post(`${this.apiUrl}/registerConsumer`,consumer);
    }

    // Load the refresh token from storage
    // then attach it as the header for one specific API call
    getNewAccessToken(): Observable<any> {

      this.accessToken=false;

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
      this.accessToken = accessToken;
      return from(this.localStoreService.saveToLocalStorage(ACCESS_TOKEN_KEY,accessToken));
    }

    async getCurrentUserStatus(): Promise<boolean> {
        return this.currentUserStatus;
    }

    async setCurrentUserStatus(status: boolean): Promise<void> {
        this.currentUserStatus = status;
    }

    async toLoginPage() {

      const toast = await this.toastController.create({
        message: 'The token is expired, please re-login!',
        duration: 2000,
        position: 'top',
        color:'warning'
      });
      toast.onDidDismiss().then(()=>{
         this.modalController.dismiss().then().catch();
         this.logout();
      });
      toast.present();
    }

    getConsumer(): Observable<any>{
      return this.http.get(`${this.apiUrl}/getuserbyname/${this.consumerId}`);
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

