import { Component,ViewChild, ElementRef, OnInit  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { google } from "google-maps";
import { Route } from '../../models/route';
import { Comment } from '../../models/comment';
import { RouteService } from '../../services/route.service';
import { CommentService } from '../../services/comment.service';
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

  markers: any[] = [];

  directions : google.maps.DirectionsWaypoint[]= [];
  route= [];

  routesData: any=[];
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


  comments: any[]=[];
  comment: Comment=new Comment();

  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public router: Router,
    public routeService: RouteService,
    public commentService: CommentService,
    private token: TokenStorageService) {
      this.data=new Route();
      this.routesData=[];
      this.comments=[];
  }

  ionViewDidEnter() {

    this.getAllRoutes();
  }


  getComments(id: any) {

    this.commentService.getCommentsRoute(id).subscribe(response => {
      if(response){
        this.comments=response.slice().reverse();
      }
    })

  }


  sendComment(){

      this.comment.time=new Date();
      this.comment.user=this.currentUser;
      this.comment.route=this.data;
      this.commentService.create(this.comment).subscribe((response) => {
        this.getComments(this.data.id);
        this.comment=new Comment();
      });

  }

  removeComment(comment: any){
    console.log("cs",comment);
    this.commentService.deleteItem(comment.id).subscribe((response)=>{
      this.getComments(this.data.id);
    })
  }

  removeCommentvisible(user: any): boolean{
    if(user.id===this.currentUser.id || this.currentUser.roles.includes('ROLE_ADMIN')){
      return true;
    }
    return false;
  }


  getAllRoutes() {

    this.routeService.getList().subscribe(response => {
      this.routesData = response;
      response.forEach(element => {
        this.addMarker(element);
      });
    })

  }

  getAllPlannedRoutes() {

    this.routeService.getListPlanned().subscribe(response => {
      this.routesData = response;
      response.forEach(element => {
        this.addMarker(element);
      });
    })
  }
  getAllDoneRoutes() {

    this.routeService.getListDone().subscribe(response => {
      this.routesData = response;
      response.forEach(element => {
        this.addMarker(element);
      });
    })
  }
  getAllbyUsernameAndTypeRoutes(username:any,type:any) {

    this.routeService.getListByUsernameandType(username,type).subscribe(response => {
      this.routesData = response;
      this.addmarkers(response);
    })
  }

  ngOnInit() {
    this.storage.create();
    this.currentUser = this.token.getUser();
    this.loadMap();
  }
  submitForm() {
    //this.data.points= result.routes[0].legs[0];
    if(this.route.length>1){
      this.data.finish_date=null;
      this.data.points=this.route;
      this.data.speed=null;
      this.data.description="";
      this.data.user=this.currentUser;
      this.data.distance=this.distance;
      this.data.type='planned';
      this.routeService.createItem(this.data).subscribe((response) => {
        this.routesData.push(this.data);
        this.segmentModel="All";
      });
   }
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
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false,
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        //this.map.setMyLocationEnabled(true);

        this.first=true;
        this.second=true;
        this.map.addListener("click", (e) => {
          let latitude = e.latLng.lat();
          let longitude = e.latLng.lng();
          //console.log( latitude + ', ' + longitude );
          this.placeMarker(latitude,longitude);
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


    removeMarkers(){
      this.markers.forEach(marker=>
        marker.setMap(null)
        );
    }



    removeDirections(){
      this.directionsDisplay.set('directions', null)

    }

    addmarkers(list: any){
      if(list){
        list.forEach(element => {
        this.addMarker(element);
      });}
    }

    addMarker(markerData: any) {
      this.removeDirections();

      let marker = new google.maps.Marker({
        position: markerData.points[0],
        map: this.map,
        title: markerData.name,
        draggable: false
      });
      marker.addListener('click', ()=>{
        this.displayRoute(markerData);

      });
      this.markers.push(marker);

    }

    placeMarker(lat:number,long:number) {
      if(this.segmentModel==="Create"){
        let latLng = new google.maps.LatLng(lat, long);
        this.processMarkerClick(latLng);
        if(this.first){
          this.markers.push(new google.maps.Marker({
            position: latLng,
            animation: google.maps.Animation.DROP,
            map: this.map,
            draggable: true,
          }));
        this.map.panTo(latLng);
        this.first=false;
      }else{
        this.removeMarkers();
      }}
    }

    displayRoute(route: any){
      if(route.points){
        if(route.type=="planned"){
          this.displayDirections(route.points);
        }else{
          this.redrawPath(route.points);
        }
        this.map.panTo(route.points[0]);
      }
      this.removeMarkers();
      this.data=route;
      this.segmentModel="Details";
    }


    displayDirections(route: any){
      this.removeDirections();
      this.removeMarkers();
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



  redrawPath(path) {

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



  segmentModel = "All";
  segmentChanged(event){
    console.log(this.segmentModel);
    if(this.segmentModel=="Saved"){
      this.removeMarkers();
      this.getAllbyUsernameAndTypeRoutes(this.currentUser.username,"planned");
    }else if(this.segmentModel=="All"){
      this.getAllRoutes();
    }

    if(this.segmentModel!="Details"){

      this.removeDirections();
      if(this.currentMapTrack){
              this.currentMapTrack.setMap(null);
      this.removeMarkers();
    }
  }
    if(this.segmentModel=="Create"){
      this.data=new Route();
      this.removeMarkers();
    }
  }
}
