import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserinfoService } from '../../services/userinfo.service';
import {TokenStorageService} from "../../services/token-storage.service";
import {LoadingController} from '@ionic/angular';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  id: any;
  data: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private token: TokenStorageService,
    private infoService: UserinfoService
  ) {

  }

  ionViewWillEnter() {
    this.id = this.activatedRoute.snapshot.params["username"];
    //get item details using id
    this.infoService.get(this.id).subscribe(response => {
      console.log(response);
      this.data = response;
    })
  }
  ngOnInit() {

  }

  update() {

    this.infoService.update(this.id, this.data).subscribe(response => {
      this.router.navigate(['tabs/profile']);
    })
  }

}
