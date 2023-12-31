import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../../service/auth/auth.service';
import { user } from 'src/app/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private route: Router, private toast: NgToastService, private service: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service, private loader: NgxUiLoaderService) { }

  User: user = {
    email: '',
    password: '',
    name: '',
    company: '',
    captcha: '',
  }
  recaptcha = '';

  getrecaptcha() {
    this.recaptchaV3Service!.execute('importantAction').subscribe((token: string) => {
      this.recaptcha = token;
    });
  }

  ngOnInit(): void {
    this.getrecaptcha();
  }

  register() {
    this.getrecaptcha();
    this.loader.start();
    this.User.captcha = this.recaptcha;
    this.service.set(this.User).subscribe(
      res => {
        console.log('My HTTP response', res);
        this.toast.success({
          detail: 'Registration Successful',
          summary: 'User is Registrated...',
          duration: 5000,
        });
        this.loader.stop();
        this.route.navigate(['/auth/login']);
      },
      err => {
        console.log('My HTTP Error', err);
        this.toast.error({
          detail: 'Registration failed',
          summary: err.error.message,
          duration: 5000,
        });
        this.loader.stop();
      },
    );
  }
}
