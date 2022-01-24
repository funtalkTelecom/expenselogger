import { AuthService } from './../service/auth.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
 } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStoreService } from '../service/localstore.service';
 import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
 import { retry, catchError, map, switchMap, finalize, filter, take, tap, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';

 @Injectable()
 export class TokenInterceptor implements HttpInterceptor {

  // Used for queued API calls while refreshing tokens
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  isRefreshingToken = false;

  loadingFlag= false;
  loadingMap: Map<string,{loading: boolean; http: boolean}>= new Map();

  constructor(
    private router: Router,
    private storage: LocalStoreService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {}

    // Intercept every HTTP call
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(this.isInBlockedList(request.url)){
          return next.handle(request);
        }

        if(!this.loadingFlag){ // avoid overlap display.
            this.loadingFlag=true;
            this.loadingMap.set(request.url,{loading:false,http:true});

            this.loadingController.getTop().then(
              hasLoading =>{
                if(!hasLoading){
                  this.loadingController.create({
                    mode:'ios',
                    spinner​:'circular',
                    translucent:true
                  }).then(loading=> {

                    console.log(this.loadingMap.get(request.url));

                      if(this.loadingMap.get(request.url)?.http){
                        this.loadingMap.set(request.url, {...this.loadingMap.get(request.url),loading:true});
                        loading.present();
                      }
                  });
                }
              });

        }


         return next.handle(this.addToken(request)).pipe(
           delay(2000),
          tap((x)=>{
            console.log('----interceptor-------'+x);
          }),
          catchError(err => {

            if (err instanceof HttpErrorResponse) {

              switch (err.status) {
                case 400:
                  this.handle400Error(err);
                  return throwError(err);   //pass the error to service to handle.
                case 401:
                  return this.handle401Error(request, next);
                case 406:
                  return this.handle406Error(err);
                default:
                  return throwError(err);
              }
            }

            return throwError(err);

          }),
          finalize(() => {

            this.loadingFlag=false;
            if(this.loadingMap.get(request.url)){
              this.loadingMap.set(request.url, {...this.loadingMap.get(request.url),http:false});
              if(this.loadingMap.get(request.url).loading){
                this.loadingController.dismiss();
              }
              this.loadingMap.delete(request.url);
            }
          })

        );

    }

    async loading(flag: boolean){

      let loading;

      if(flag){
              loading = await this.loadingController.create({
                        message: 'Please wait...'
                      });
              await loading.present();

      }else{
        loading.dismiss();
      }

    }


    // Filter out URLs where you don't want to add the token!
    private isInBlockedList(url: string): boolean {

      // url === `${environment.apiUrl}/token/refresh`
      if (url === `${environment.apiUrl}/login` || url === `${environment.apiUrl}/logout`) {

        return true;

      } else {
        return false;
      }
    }

    // Add our current access token from the service if present
    private addToken(req: HttpRequest<any>) {
      if (this.authService.accessToken) {
        return req.clone({
          headers: new HttpHeaders({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer:${this.authService.accessToken}`
          })
        });
      } else {
        return req;
      }
    }

    // We are not just authorized, we couldn't refresh token or something else along the caching went wrong!
    private async handle400Error(err) {
      // Potentially check the exact error reason for the 400 then log out the user automatically
      console.log(err.error.errorMessage);

      const toast = await this.toastController.create({
        message: 'System error.',
        duration: 2000,
        position: 'middle',
        color:'warning'
      });
      toast.present();
    }

   // refreshToken is expired, re-login
    private async handle406Error(err) {
       this.authService.toLoginPage();
    }

    // Indicates our access token is invalid, try to load a new one
    private handle401Error(request: HttpRequest < any >, next: HttpHandler): Observable < any > {
      // Check if another call is already using the refresh logic
      if(!this.isRefreshingToken) {

        // Set to null so other requests will wait until we got a new token!
        this.tokenSubject.next(null);
        this.isRefreshingToken = true;
        this.authService.accessToken = null;

        //get a new access token by fresh token
        return this.authService.getNewAccessToken().pipe(
          switchMap((token: any) => {
            console.log(token);

            if (token) {
              // Store the new token
              const accessToken = token.accessToken;
              return this.authService.storeAccessToken(accessToken).pipe(
                switchMap(_ => {
                  // Use the subject so other calls can continue with the new token
                  this.tokenSubject.next(accessToken);

                  // Perform the initial request again with the new token
                  return next.handle(this.addToken(request));
                })
              );
            } else {
              // No new token or other problem occurred
              this.router.navigateByUrl('/', { replaceUrl: true });
              return of(null);
            }
          }),
          finalize(() => {
            // Unblock the token reload logic when everything is done
            this.isRefreshingToken = false;
          })
        );
      } else {
        // "Queue" other calls while we load a new token
        return this.tokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token =>
            // Perform the request again now that we got a new token!
            next.handle(this.addToken(request))
          )
        );
      }
    }

 }
