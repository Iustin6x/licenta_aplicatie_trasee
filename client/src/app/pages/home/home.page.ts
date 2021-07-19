import { Component,ViewChild, ElementRef  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Route } from '../../models/route';
import { RouteService } from '../../services/route.service';
import {TokenStorageService} from "../../services/token-storage.service";
import { Router } from '@angular/router';
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  data: Route;

  routesData: any;

  currentUser: any;
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
    private nativeGeocoder: NativeGeocoder,
    public routeService: RouteService,
    public router: Router,
    private token: TokenStorageService
    ) {
      this.data=new Route();
      this.routesData=[];

  }
  ionViewWillEnter() {
    this.getAllDoneRoutes();
  }
  getAllRoutes() {
    //Get saved list of students
    this.routeService.getList().subscribe(response => {
      this.routesData = response;
    })
  }

  getAllPlannedRoutes() {
    //Get saved list of students
    this.routeService.getListPlanned().subscribe(response => {
      this.routesData = response;
    })
  }
  getAllDoneRoutes() {
    //Get saved list of students
    this.routeService.getListDone().subscribe(response => {
      this.routesData = response;
    })
  }

  getTime(item: any): any{
      let duration=new Date(item.finish_date).getTime() -new Date(item.start_date).getTime()

      let time=String(new Date(duration).getHours())
      return time;
  }

  ngOnInit() {
    this.storage.create();
    this.currentUser = this.token.getUser();
    this.loadMap();
  }
  submitForm() {

    this.routeService.createItem(this.data).subscribe((response) => {
      this.routesData.push(this.data);
      this.router.navigate(['/']);
    });

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


  startTracking() {
    this.locationTraces=[];
    this.data.start_date= new Date();
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
    this.data.points=this.locationTraces;
    this.data.finish_date=new Date();
    this.data.speed=10;
    this.data.user=this.currentUser;
    this.data.distance=10;
    this.data.type='done';
    this.storage.set('routes', this.previousTracks);

    this.locationWatchStarted = false;
    this.locationSubscription
    this.currentMapTrack.setMap(null);
  }

  showHistoryRoute(route) {
    this.redrawPath(route);
  }


}
