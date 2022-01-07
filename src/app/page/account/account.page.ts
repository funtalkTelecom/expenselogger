import { ProfilePhotoOptionComponent } from './../../common/component/profile-photo-option/profile-photo-option.component';
import { log } from 'console';
import { ModalController } from '@ionic/angular';
import { User } from './../../interface/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: User;
  photo = 'assets/intro1.jpg';

  constructor(private authService: AuthService,
    private router: Router,
    private modalController: ModalController) { }

  ngOnInit() {

    this.getConsumer();
  }

  getConsumer(){

    this.authService.getConsumer().subscribe(
      {next:(user)=>{
             this.user=user;
            }
      }
    );

  }

async  openPictureOption(){
    const modal= await this.modalController.create({
      component:ProfilePhotoOptionComponent,
      cssClass:'transparent-modal'
    });

    modal.onDidDismiss().then(
      res=>{
        console.log(res);
        if (res.role !== 'backdrop') {
          this.takePicture(res.data);
        }
      }
    );
    return await modal.present();

  }

  async takePicture(type) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource[type]
    });
    this.photo = image.webPath;
    console.log(this.photo);
  }

}
