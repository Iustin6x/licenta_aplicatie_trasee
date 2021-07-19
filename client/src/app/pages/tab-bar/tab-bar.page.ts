import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {TokenStorageService} from "../../services/token-storage.service";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserinfoService } from '../../services/userinfo.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.page.html',
  styleUrls: ['./tab-bar.page.scss'],
})
export class TabBarPage implements OnInit {


  currentUser: any;
  userinfo: any;

  constructor(private userService: UserService,
    private infoService: UserinfoService,
    private geolocation: Geolocation,
    private token: TokenStorageService) { }

    locationSubscription:any;
  ionViewDidEnter(){
    this.locationSubscription = this.geolocation.watchPosition();
    this.locationSubscription.subscribe((resp) => {
      console.log("userr",this.userinfo)
        this.userinfo.latitude=resp.coords.latitude;
        this.userinfo.longitude=resp.coords.longitude;
        this.update(this.userinfo.id,this.userinfo);
    });
  }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.infoService.get(this.currentUser.username).subscribe(response => {
      this.userinfo = response;
    })
  }
  update(id: any, data: any) {

    this.infoService.update(id,data).subscribe(response => {
    })
  }

}
