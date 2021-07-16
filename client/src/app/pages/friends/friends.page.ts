import { Component, OnInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  usersData: any;

  constructor(
    public userService: UserService,
    private router: Router
  ) {
    this.usersData = [];
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getAllUsers();
  }


  getAllUsers() {

    this.userService.getList().subscribe(response => {
      console.log(response);
      this.usersData = response;
    })



  }
  onOpenItem(item: any) {
    this.router.navigate([`tabs/profile/edit/${item.username}`]);
  }



}
