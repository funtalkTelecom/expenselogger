import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import {Platform, ToastController} from '@ionic/angular';
import {LocalStoreService} from './service/localstore.service';
import {AppRoutes, StorageKeys} from './common/constant';
import {DatetimeService} from './service/datetime.service';
import {NavigationEnd, Router} from '@angular/router';
import {Device} from '@capacitor/device';
import {SplashScreen  } from '@capacitor/splash-screen';
import {StatusBar } from '@capacitor/status-bar';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { environment } from 'src/environments/environment';
import { Network } from '@capacitor/network';
// import { Network } from '@awesome-cordova-plugins/network/ngx';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    connectSubscription: any;
    disconnectSubscription: any;

    constructor(
        private platform: Platform,
        private localStoreService: LocalStoreService,
        private toastCtrl: ToastController,
        private router: Router,
        // private network: Network
    ) {
        this.initializeApp().then(() => {
                      console.log('------initializeApp------');

        });

        // CapacitorGoogleMaps.initialize({
        //   key: environment.mapsKey
        // });
    }


    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event) {
      console.log('window');
      // this.localStoreService.removeFromLocalStorage( ACCESS_TOKEN_KEY);
      // this.localStoreService.removeFromLocalStorage( REFRESH_TOKEN_KEY);
    }


    async initializeApp(): Promise<void> {

        return await this.platform.ready().then(() => {


          Device.getInfo().then((deviceInfo) => {
            console.log('deviceInfo.platform--------'+deviceInfo.platform);
            if (deviceInfo.platform === 'web') {
              GoogleAuth.init() ;
            }
        });

          // watch network for a disconnection
          // this.disconnectSubscription = this.network.onDisconnect().subscribe( async () => {
          //     console.log('network was disconnected :-(');
          //     const toast = await this.toastCtrl.create({
          //     message: 'network was disconnected!',
          //     duration: 2000,
          //     position: 'middle'
          //   });
          //    await toast.present();
          // });

          // watch network for a connection
          // this.connectSubscription = this.network.onConnect().subscribe(() => {
          //   console.log('network connected!');
          //   // We just got a connection but we need to wait briefly
          //   // before we determine the connection type. Might need to wait.
          //   // prior to doing any api requests as well.
          //   setTimeout(() => {
          //     console.log('network type:'+this.network.type);
          //     if (this.network.type === 'wifi') {
          //       console.log('we got a wifi connection, woohoo!');
          //     }
          //   }, 3000);
          // });

          Network.addListener('networkStatusChange', async (status) => {

            console.log('Network status changed'+ status);
            // JSON.stringify(status);

            if(!status.connected){

              const toast = await this.toastCtrl.create({
                message: 'network was disconnected!',
                duration: 2000,
                position: 'middle'
              });
              await toast.present();
            }

          });

          // Network.getStatus().then(res=>{
          //       console.log('Network:'+res.connectionType);
          //       console.log('Network status:'+res.connected);
          // });

          // this.router.navigateByUrl(AppRoutes.TABS)
          //         .then((bool) => Device.getInfo())
          //         .then((deviceInfo) =>
          //           deviceInfo.platform !== 'web'? SplashScreen.hide(): StatusBar.show()).catch(()=>{});
        });
    }


}
