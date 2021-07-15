import { Component,ViewChild, ElementRef  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { TrackService } from '../../services/track.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  countries: string[];
  errorMessage: string;

  constructor(public navCtrl: NavController, public rest: TrackService) {

  }

  ionViewDidLoad() {
    this.getCountries();
  }

  getCountries() {
    
  }


}
