import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {AppRoutes} from '../../common/constant';
import {forkJoin, of} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Device} from '@capacitor/device';
import {Keyboard, KeyboardResize} from '@capacitor/keyboard';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('loginFormCard', {static: true}) loginCard: HTMLElement;

    showPassword = false;

    loginForm: FormGroup = new FormGroup({
      //Validators.email   Validators.min(8)
        userName: new FormControl('王新谱', [Validators.required ]),
        passWord: new FormControl('123456', [Validators.required])
    });
    private loginCardAnimation: any;


    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private alertController: AlertController
    ) {
        Device.getInfo().then((deviceInfo) => {
            console.log(deviceInfo);
            if (deviceInfo.platform !== 'web') {
                Keyboard.setResizeMode({mode: KeyboardResize.None});
                Keyboard.addListener('keyboardWillShow', () => {
                    console.log('Keyboard Event');
                });
            }
        });

    }

    ngOnInit(): void {
      // console.log(this.fireAuth.auth.currentUser);
    }

    async login() {
      const loading = await this.loadingController.create();
      await loading.present();

      this.authService.login(this.loginForm.value).subscribe(
        async _ => {
          await loading.dismiss();
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        },
        async (res) => {

          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            message: res.error.msg,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
    }

    async signUp() {
      const loading = await this.loadingController.create();
      await loading.present();

      this.authService.signUp(this.loginForm.value).subscribe(
        async _ => {
          await loading.dismiss();
          this.login();
        },
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Signup failed',
            message: res.error.msg,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
    }

    // doLogin(): void {
    //     this.authService.loginWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
    //         .then(() =>
    //              this.router.navigateByUrl(AppRoutes.TABS)
    //             // return this.router.navigateByUrl(AppRoutes.TABS);
    //         )
    //         .then((bool) => {
    //             // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //             bool ? console.log('Successfully Logged In') : console.log('Login Failed');
    //         }).catch(err => console.log(err));
    // }

    togglePasswordFieldType(): void {
        this.showPassword = !this.showPassword;
    }


}
