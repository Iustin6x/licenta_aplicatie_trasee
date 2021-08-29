import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { UserService} from '../../services/user.service';
import { Router } from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  usersData: any;
  currentUser: any;
  currentlatLng: any;
  locationSubscription: any;

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;

  markers: any[] = [];
  usedcolors: any[]=[];
  userscolor: {}={};
  usersdistance: {}={};

  constructor(
    private token: TokenStorageService,
    public userService: UserService,
    private router: Router,
    private geolocation: Geolocation) {
    this.usersData = [];
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.loadMap();
    this.currentUser = this.token.getUser();

  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;
      this.currentlatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      console.log("ds1",this.currentlatLng);
      let mapOptions = {
        center: this.currentlatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.getAllUsers();
      console.log("dis2",this.usersdistance);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    console.log("ds5",this.currentlatLng);
  }


  getAllUsers() {

    this.userService.getList().subscribe(response => {
      response=response.filter(item => item.id != this.currentUser.id)
      this.usersData = response;
      this.addmarkers(response);
      this.getDistances(response);
      console.log("dis",this.usersdistance);
    })
  }

  getDistances(list: any){
    if(list){
      list.forEach(element => {

        this.usersdistance[element.id]=this.getDistance(element.latitude,element.longitude);
    });}
  }


  getDistance(lat: number,lng: number): number{
    console.log("ds",this.currentlatLng);
    console.log("lat",lat);

         let distance= google.maps.geometry.spherical.computeDistanceBetween(this.currentlatLng, new google.maps.LatLng(lat,lng));

         return Number((Math.round(distance/ 1000 * 100) / 100).toFixed(2));

  }

  addmarkers(list: any){
    this.removeMarkers();
    if(list){
      list.forEach(element => {

        let color= this.getRandomColor();
        this.userscolor[element.id]=color;
        this.addMarker(element,color);

    });}
  }

  getRandomColor(): any {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    do{
      color = '#'
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    }while(this.usedcolors.indexOf(color) !== -1)
    this.usedcolors.push(color);
    return color;
}

  removeMarkers(){
    this.markers.forEach(marker=>
      marker.setMap(null)
      );
  }


  addMarker(markerData: any,color: any) {
    let latlng = new google.maps.LatLng(markerData.latitude,markerData.longitude);

    let marker = new google.maps.Marker({
      position: latlng,
      map: this.map,

       // strokeColor: color,
        //labelOrigin: new google.maps.Point(15, 10)
      draggable: false
    });
    marker.addListener('click', ()=>{
      this.onOpenItem(markerData);

    });
    this.markers.push(marker);

  }

  onOpenItem(item: any) {
    this.router.navigate([`tabs/profile/${item.username}`]);
  }
  onOpenItemEdit(item: any) {
    this.router.navigate([`tabs/profile/edit/${item.username}`]);
  }



}
