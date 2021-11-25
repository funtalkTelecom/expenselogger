import {Component, HostListener} from '@angular/core';

import {Platform} from '@ionic/angular';
import {LocalStoreService} from './service/localstore.service';
import {AppRoutes, StorageKeys} from './common/constant';
import {DatetimeService} from './service/datetime.service';
import {Router} from '@angular/router';
import {Device} from '@capacitor/device';
import {SplashScreen  } from '@capacitor/splash-screen';
import {StatusBar } from '@capacitor/status-bar';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private localStoreService: LocalStoreService,
        private datetimeService: DatetimeService,
        private router: Router,
    ) {
        // this.initializeApp().then(() => {
        //     this.initializeInstallDate();
        // });
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event) {
      this.localStoreService.removeFromLocalStorage( ACCESS_TOKEN_KEY);
      this.localStoreService.removeFromLocalStorage( REFRESH_TOKEN_KEY);
    }

    async initializeApp(): Promise<void> {
        return await this.platform.ready().then(() => {
            // this.fireAuth.auth.onAuthStateChanged((user) => {
            //     user !== null
            //         ? this.storageService.saveToLocalStorage(StorageKeys.ACTIVE_USER, true)
            //         : this.storageService.saveToLocalStorage(StorageKeys.ACTIVE_USER, false);
            //     this.router.navigateByUrl(AppRoutes.TABS)
            //         .then((bool) => {
            //             return Plugins.Device.getInfo();
            //         })
            //         .then((deviceInfo) => {
            //             deviceInfo.platform !== 'web'
            //                 ? Plugins.SplashScreen.hide()
            //                 : Plugins.StatusBar.show();
            //         });
            // });

          console.log('------initializeApp------');

          this.router.navigateByUrl(AppRoutes.TABS)
                  .then((bool) => Device.getInfo())
                  .then((deviceInfo) =>
                    deviceInfo.platform !== 'web'? SplashScreen.hide(): StatusBar.show()).catch(()=>{});
        });
    }


}
