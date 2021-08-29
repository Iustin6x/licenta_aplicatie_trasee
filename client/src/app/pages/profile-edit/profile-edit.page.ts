import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserinfoService } from '../../services/userinfo.service';
import {TokenStorageService} from "../../services/token-storage.service";
import {LoadingController} from '@ionic/angular';
import { UserService} from '../../services/user.service';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  username: any;
  userData: any;

  currentUser: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private token: TokenStorageService,
    private infoService: UserinfoService,
    private userService: UserService
  ) {
    this.userData={};
  }

  ionViewWillEnter() {
    this.username = this.activatedRoute.snapshot.params["username"];

    if(!this.username){
      this.username=this.currentUser.username;
    }
  }
  ngOnInit() {
    this.userData = this.token.getUser();
    this.username = this.activatedRoute.snapshot.params["username"];
    if(!this.username){
      this.username=this.currentUser.username;
    }
    this.getUserInfo(this.username);
  }

  getUserInfo(username: any){
    this.infoService.get(username).subscribe(response => {
      console.log(response);
      this.userData = response;
    });

}

  update() {

    this.infoService.update(this.userData.id, this.userData).subscribe(response => {
      this.router.navigate(['tabs/profile']);
    })
  }

}
