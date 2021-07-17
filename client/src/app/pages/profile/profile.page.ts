import { Component, OnInit } from '@angular/core';
import { UserinfoService } from '../../services/userinfo.service';
import {TokenStorageService} from "../../services/token-storage.service";
import {LoadingController} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  currentUser: any;
  data: any;
  filtersLoaded: Promise<boolean>;
  username: any;

  constructor(private token: TokenStorageService,
    private infoService: UserinfoService,
    private loadingController: LoadingController,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {

    this.currentUser = this.token.getUser();
    this.getInfo();
  }

  async getInfo(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.username = this.activatedRoute.snapshot.params["username"];
    if(this.username==null){
      this.username=this.currentUser.username;
    }console.log("user",this.username);
    this.infoService.get(this.username).subscribe(
      async(data)=>{
      await loading.dismiss();

      this.data = data

      this.filtersLoaded = Promise.resolve(true);

      //this.reloadPage();
    },
    async(err) => {
      await loading.dismiss();
    }
);

  }

  onOpenItem() {
    this.router.navigate([`tabs/profile/edit`]);
  }

   update() {
    //Update item by taking id and updated data object

    this.infoService.update(this.data.id, this.data).subscribe(response => {
      this.router.navigate(['tabs/profile']);
    })
  }


}
