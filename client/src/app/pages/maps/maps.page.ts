import { Component,ViewChild, ElementRef, OnInit  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { google } from "google-maps";
import { Route } from '../../models/route';
import { RouteService } from '../../services/route.service';
import {TokenStorageService} from "../../services/token-storage.service";
import { Router } from '@angular/router';

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

  directions : google.maps.DirectionsWaypoint[]= [];
  route= [];

  routesData: any;
  data: Route;

  currentUser: any;

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
  directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
  geocoder = new google.maps.Geocoder();


  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public router: Router,
    public routeService: RouteService,
    private token: TokenStorageService) {
      this.data=new Route();
      this.routesData=[];
  }

  ionViewWillEnter() {
    this.getAllRoutes();
  }
  getAllRoutes() {

    this.routeService.getList().subscribe(response => {

      this.routesData = response;
    });
  }

  ngOnInit() {
    this.storage.create();
    this.currentUser = this.token.getUser();
    this.loadMap();
  }
  submitForm() {
    //this.data.points= result.routes[0].legs[0];
    this.data.finish_date=null;
    this.data.points=this.route;
    this.data.speed=null;
    this.data.description="";
    this.data.user=this.currentUser;
    this.data.distance=this.distance;
    this.data.type='planned';
    this.routeService.createItem(this.data).subscribe((response) => {
      this.routesData.push(this.data);
      this.router.navigate(['/']);
    });

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
            this.saveDirections(directions);
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
      this.first=false;
    }
    }
    displayDirections(route: any){
      let ways: google.maps.DirectionsWaypoint[]= [];
      for (let i=1; i<route.length-1; i++) {
        ways.push({location:new google.maps.LatLng(route[i].lat,route[i].lng),stopover: true});

      }
      this.directionsService.route({
        origin: route[0],
        destination: route[route.length-1],
        waypoints:ways,
        travelMode: google.maps.TravelMode.WALKING
    },
    ).then((result) => {
      this.saveDirections(result);
      this.directionsDisplay.setDirections(result);
    })
    .catch((e) => {
      console.log("Could not display directions due to: " + e);

    });
    }

    processMarkerClick(latLng) {
      this.route.push({
        lat: latLng.lat(),
        lng: latLng.lng()
    });
      if(this.route.length>1){
        this.displayDirections(this.route);
        //this.saveDirections();
      }

      /*
      if (this.first) {
          this.originLatLng=latLng;
          this.first=false;
      }
      else if(!this.first){
        if(!this.second){
          //this.directions.push({location:new google.maps.LatLng(this.destinationLatLng.lat(),this.destinationLatLng.lng()),stopover: true});
          let ways: google.maps.DirectionsWaypoint[]= [];
          this.route.slice(1,this.route.length-1).forEach((latlng)=>{
            ways.push({location:new google.maps.LatLng(latlng.lat,this.destinationLatLng.lng()),stopover: true});
          })
          origin: this.directions[0],
        destination: this.directions[this.directions.length-1],
        waypoints:[this.directions.slice(1,this.directions.length-1)],
          this.destinationLatLng=latLng;
          console.log("metoda2",this.directions.toString());
          this.directionsService.route({
              origin: {
                lat: this.originLatLng.lat(),
                lng: this.originLatLng.lng()
            },
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
            console.log("directiaaa",this.directionsDisplay.getDirections().routes[0]);
          })
          .catch((e) => {
            console.log("Could not display directions due to: " + e);

          });

        }else{
          this.destinationLatLng=latLng;
          this.second=false;
          this.directionsService.route({
              origin:{
                  lat: this.originLatLng.lat(),
                  lng: this.originLatLng.lng()
              },
              destination: {
                lat: latLng.lat(),
                lng: latLng.lng()
            },
              travelMode: google.maps.TravelMode.WALKING
          },
          ).then((result) => {
            console.log("a mers2",result);
            this.directionsDisplay.setDirections(result);
            console.log("directiaaa",this.directionsDisplay.getDirections().routes[0]);
          })
          .catch((e) => {
            console.log("Could not display directions due to: " + e);

          });
        }
      }
      */
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

    saveDirections(directions) {
      let _directions=[];
      let legs = directions.routes[0].legs;
      for (let i=0; i<legs.length; i++) {
        _directions.push({
          lat:legs[i].start_location.lat(),
          lng:legs[i].start_location.lng()});
        let way = legs[i];
        for (let j=0; j<way.via_waypoints.length; j++) {
          _directions.push({
            lat:legs[i].via_waypoints[j].lat(),
            lng:legs[i].via_waypoints[j].lng()})
         // console.log('Waypoint ' + i + ' coords: ' + leg.via_waypoints[i].lat() + ', ' + leg.via_waypoints[i].lng());
        }
       // console.log('Waypoint ' + i + ' coords: ' + leg.via_waypoints[i].lat() + ', ' + leg.via_waypoints[i].lng());
      _directions.push({
        lat:legs[i].end_location.lat(),
        lng:legs[i].end_location.lng()});

    }
      this.route=_directions;

    }

    codeAdress(adress: any): any{
      this.geocoder.geocode( { 'address': adress}, function(results, status) {
        if (status == 'OK') {
          return results[0].geometry.location;
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          return;
        }
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
