import { Component,ViewChild, ElementRef, OnInit  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { google } from "google-maps";
declare var google;

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;

  locationWatchStarted:boolean;
  locationSubscription:any;

  locationTraces = [];
  currentMapTrack = null;
  previousTracks = [];

  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
  }


  ngOnInit() {
    this.storage.create();
    this.loadMap();
  }

  loadMap() {
      this.geolocation.getCurrentPosition().then((resp) => {

        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.addMarker(this.map);
        this.map.addListener('dragend', () => {

          this.latitude = this.map.center.lat();
          this.longitude = this.map.center.lng();
          this.locationTraces.push({
            lat:this.map.center.lat(),
            lng:this.map.center.lng(),

          });
          this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        });

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }

  addMarker(map:any){

    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
      },
      draggable: true,
    });
  }


  getAddressFromCoords(lattitude, longitude) {


    console.log("getAddressFromCoords " + lattitude + " " + longitude);

    this.redrawPath(this.locationTraces);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });

  }

  getCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.locationTraces.push({
        latitude:resp.coords.latitude,
        longitude:resp.coords.longitude,
        accuracy:resp.coords.accuracy,
        timestamp:resp.timestamp
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.locationSubscription = this.geolocation.watchPosition();
    this.locationSubscription.subscribe((resp) => {

      this.locationWatchStarted = true;
      this.locationTraces.push({
        latitude:resp.coords.latitude,
        longitude:resp.coords.longitude,
        accuracy:resp.coords.accuracy,
        timestamp:resp.timestamp
      });

    });
  }

  startTracking() {
    this.locationTraces=[];

    this.locationSubscription = this.geolocation.watchPosition();
    
    this.locationSubscription.subscribe((resp) => {
      setTimeout(() => {
        this.locationWatchStarted = true;
        this.locationTraces.push({
          lat:resp.coords.latitude,
          lng:resp.coords.longitude,
        });
        this.redrawPath(this.locationTraces);
      }, 0);
    });


  }

  redrawPath(path) {
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }

    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  loadHistoricRoutes() {
    this.storage.get('routes').then(data => {
      if (data) {
        this.previousTracks = data;
      }
    });
  }

  stopTracking() {
    let newRoute = { finished: new Date().getTime(), path: this.locationTraces };
    this.previousTracks.push(newRoute);
    this.storage.set('routes', this.previousTracks);

    this.locationWatchStarted = false;
    this.locationSubscription
    this.currentMapTrack.setMap(null);
  }

  showHistoryRoute(route) {
    this.redrawPath(route);
  }



}
