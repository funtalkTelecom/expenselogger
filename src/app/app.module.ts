import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './guard/error-handler';
import { TokenInterceptor } from './guard/token.interceptor';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [Network,GooglePlus,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
     {provide: ErrorHandler, useClass: GlobalErrorHandler}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
