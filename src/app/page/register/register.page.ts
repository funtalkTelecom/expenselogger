import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors} from '@angular/forms';
import {AnimationService} from '../../service/animation.service';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

// Authentication Forms Custom Validators
export const confirmPasswordValidator: ValidatorFn
             = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return {passwordsNotMatching: true};
};

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    showPassword = false;

    registerForm: FormGroup = new FormGroup({
        userName: new FormControl('taibei', [Validators.required]),
        email: new FormControl('43198341@qq.com', [Validators.email, Validators.required]),
        phoneNumber: new FormControl('764546183',[Validators.required]),
        passWord: new FormControl('123456', [Validators.min(8), Validators.required]),
        passWordConfirm: new FormControl('123456', [Validators.min(8), Validators.required, confirmPasswordValidator])
    });

    constructor(
        private animationService: AnimationService,
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private alertController: AlertController
    ) {}

  async doRegister(){

        const loading = await this.loadingController.create();
        await loading.present();

        this.authService.register(this.registerForm.value).subscribe(
            async _ => {
              await loading.dismiss();

              const alert = await this.alertController.create({
                header: 'Signup',
                message: 'signup success!',
                buttons: ['OK'],
              });
              await alert.present();
              this.router.navigateByUrl('/login', { replaceUrl: true });
            },
            async (res) => {
              await loading.dismiss();
              const alert = await this.alertController.create({
                header: 'Signup failed!',
                message: res.error,
                buttons: ['OK'],
              });
              await alert.present();
            }
          );

    }

    ngOnInit(): void {
    }

    togglePasswordFieldType(): void {
        this.showPassword = !this.showPassword;
    }

    checkFieldValidity(control: string): void {
        // const cont = this.registerForm.controls[control]
    }
}
