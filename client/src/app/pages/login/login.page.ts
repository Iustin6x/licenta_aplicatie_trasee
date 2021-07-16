import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {TokenStorageService} from '../../services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  constructor(public fb: FormBuilder,
              private readonly loadingCtrl: LoadingController,
              private authService: AuthService,
              private router: Router,
              private tokenStorage: TokenStorageService,
              private loadingController: LoadingController) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  async onSubmit() {
    const loading = await this.loadingController.create();
    await loading.present();
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
          async(data)=>{
          await loading.dismiss();
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          

          this.redirectTabNav();
          //this.reloadPage();
        },
        async(err) => {
          await loading.dismiss();
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
    );
  }

  redirectTabNav() {
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }
  reloadPage() {
    window.location.reload();
  }

}
