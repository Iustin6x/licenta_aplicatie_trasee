import { Component,ViewChild, ElementRef, OnInit  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { google } from "google-maps";
declare var google;
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  originLatLng: any;
  destinationLatLng: any;

  directions : google.maps.DirectionsWaypoint[] = [];


  first:boolean;
  second:boolean;
  latitude: number;
  longitude: number;

  distance: number;

  locationWatchStarted:boolean;
  locationSubscription:any;

  lastLatLng: number;

  locationTraces = [];
  currentMapTrack = null;
  previousTracks = [];

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();


  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
  }

  ngOnInit() {
      this.storage.create();
      this.loadMap();
    }

  /*
  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    this.directionsDisplay.setMap(map);
  }*/


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

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.first=true;
        this.second=true;
        this.map.addListener("click", (e) => {
          let latitude = e.latLng.lat();
          let longitude = e.latLng.lng();
          //console.log( latitude + ', ' + longitude );
          this.placeMarkerAndPanTo(latitude,longitude, this.map);
        });


        this.directionsDisplay.setMap(this.map);

        this.directionsDisplay.addListener("directions_changed", () => {
          const directions = this.directionsDisplay.getDirections();

          if (directions) {
            this.computeTotalDistance(directions);
          }
        });



      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
    placeMarkerAndPanTo(lat:number,long:number, map: any) {
      let latLng = new google.maps.LatLng(lat, long);
    this.processMarkerClick(latLng);
    if(this.first){
      new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        map: map,
        draggable: true,
      });
      map.panTo(latLng);
    }
    }


    processMarkerClick(latLng) {
      if (this.first) {
          this.originLatLng=latLng;
          this.first=false;
      }
      else if(!this.first){
        if(!this.second){
          this.directions.push({location:new google.maps.LatLng(this.destinationLatLng.lat(),this.destinationLatLng.lng()),stopover: true});
          this.destinationLatLng=latLng;
          console.log("metoda2",this.directions.toString());
          this.directionsService.route({
              origin: this.originLatLng,
              destination: {
                lat: latLng.lat(),
                lng: latLng.lng()
            },
              waypoints:this.directions,
              travelMode: google.maps.TravelMode.WALKING
          },
          ).then((result) => {
            console.log("a mers",result);
            this.directionsDisplay.setDirections(result);
          })
          .catch((e) => {
            console.log("Could not display directions due to: " + e);

          });

        }else{
          this.destinationLatLng=latLng;
          this.second=false;
          this.directionsService.route({
              origin: this.originLatLng,
              destination: {
                lat: latLng.lat(),
                lng: latLng.lng()
            },
              travelMode: google.maps.TravelMode.WALKING
          },
          ).then((result) => {
            console.log("a mers2",result);
            this.directionsDisplay.setDirections(result);
          })
          .catch((e) => {
            console.log("Could not display directions due to: " + e);

          });
        }
      }

  }
    displayRoute(
      origin: string,
      destination: string,
      service: any,
      display: any
    ) {
      service
        .route({
          origin: origin,
          destination: destination,
          waypoints: [
            { location: "Adelaide, SA" },
            { location: "Broken Hill, NSW" },
          ],
          travelMode: google.maps.TravelMode.DRIVING,
          avoidTolls: true,
        })
        .then((result) => {
          display.setDirections(result);
        })
        .catch((e) => {
          alert("Could not display directions due to: " + e);
        });
    }

    computeTotalDistance(result: any) {
      let total = 0;
      const myroute = result.routes[0];

      if (!myroute) {
        return;
      }

      for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i]!.distance!.value;
      }
      total = total / 1000;
      this.distance=total;
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
