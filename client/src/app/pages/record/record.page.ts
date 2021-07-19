import { Component,ViewChild, ElementRef  ,OnInit} from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Route } from '../../models/route';
import { RouteService } from '../../services/route.service';
import {TokenStorageService} from "../../services/token-storage.service";
import { Router } from '@angular/router';
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

  data: Route;

  routesData: any;

  currentUser: any;
  latitude: number;
  longitude: number;

  locationWatchStarted:boolean;
  locationSubscription:any;

  distance: number=0;
  speed: number=0;
  starttime: Date=new Date();

  locationTraces = [];
  currentMapTrack = null;
  previousTracks = [];

  currentLocationMarker: any;



  segmentModel = "Start";

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
      this.locationTraces=[];
      this.redrawPath([]);
      this.router.navigate(['tabs/maps']);
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

        this.addMarker();
        this.map.addListener('dragend', () => {
          if(this.locationWatchStarted){
            this.latitude = this.map.center.lat();
            this.longitude = this.map.center.lng();
            this.currentLocationMarker.setPosition({
              lat:this.map.center.lat(),
              lng:this.map.center.lng(),
            });
            this.locationTraces.push({
              lat:this.map.center.lat(),
              lng:this.map.center.lng(),
            });
            this.computeTotalDistance();
            this.computeSpeed();
            this.redrawPath(this.locationTraces);
          }
      });

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }

    addMarker(){

    this.currentLocationMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
      },
      draggable: true,
    });
  }

  computeTotalDistance(){
    let total = 0;
      if (!this.locationTraces) {
        return;
      }
      for (let i = 0; i < this.locationTraces.length-1 ; i++) {
        let dist_points= google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.locationTraces[i].lat, this.locationTraces[i].lng), new google.maps.LatLng(this.locationTraces[i+1].lat, this.locationTraces[i+1].lng));
        total +=dist_points;
      }
      total = total / 1000;
      this.distance=Number((Math.round(total * 100) / 100).toFixed(2));

  }


  computeSpeed(){
    let now=new Date();
    let diffInMs = Math.abs(now.getTime() - this.starttime.getTime());
    this.speed =Number((Math.round(this.distance / (diffInMs / 1000) * 3600 * 100) / 100).toFixed(2)) ;


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
    this.map.setZoom(20);
    this.locationTraces=[];
    this.starttime=new Date();
    this.segmentModel="End";
    this.locationSubscription = this.geolocation.watchPosition();
    this.locationSubscription.subscribe((resp) => {
        this.locationWatchStarted = true;
        this.currentLocationMarker.setPosition({
          lat:resp.coords.latitude,
          lng:resp.coords.longitude,
        });
        this.locationTraces.push({
          lat:resp.coords.latitude,
          lng:resp.coords.longitude,
        });
        this.redrawPath(this.locationTraces);
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



  stopTracking() {
    this.map.setZoom(15);
    this.data.points=this.locationTraces;
    this.data.finish_date=new Date();
    this.data.start_date=  this.starttime;
    this.data.speed=this.speed;
    this.data.user=this.currentUser;
    this.data.distance=this.distance;
    this.data.type='done';
    this.locationWatchStarted = false;
    this.locationSubscription
    //this.currentMapTrack.setMap(null);
    this.segmentModel = "Save";
  }

  showHistoryRoute(route) {
    this.redrawPath(route);
  }
  startStopPlaying(){}

}
