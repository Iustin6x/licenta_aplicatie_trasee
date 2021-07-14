import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { IonicStorageModule } from '@ionic/storage-angular'


import {HttpClientModule} from '@angular/common/http';
import { authInterceptorProviders } from './helpers/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),IonicStorageModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,

    Geolocation,

    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
