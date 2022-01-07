import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  form: FormGroup;
  type=true;

  constructor(private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.form = new FormGroup({
      userName: new FormControl('王新谱',{validators:[Validators.required]}),
      passWord: new FormControl('123456',{validators:[Validators.required,Validators.minLength(6)]}),
    });
  }

  changeType(){
    this.type=!this.type;
  }

 async onSubmit(){

  console.log(this.form.value);

    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.form.value).subscribe(
      async _ => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs');
      },
      async (res) => {

        console.log(res);

        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.errorMessage,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );

  }

}
