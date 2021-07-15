import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

	userPosts;
	sub;
	posts;
	username: string
	profilePic: string
  currentUser: any;

  constructor(private token: TokenStorageService) { }

  ngOnInit() {
    this.currentUser = this.token.getUser();
  }
}
