import { ProfilePhotoOptionComponent } from './../../common/component/profile-photo-option/profile-photo-option.component';
import { log } from 'console';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { User } from './../../interface/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: User;
  photo = 'assets/intro1.jpg';

  images: LocalFile[] = [];

  loading;

  apiResourceUrl = environment.apiResourceUrl;

  constructor(private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private plt: Platform,
    private loadingController: LoadingController,
    private toastCtrl: ToastController) { }

  ngOnInit() {

    this.getConsumer();
  }

  getConsumer(){

    this.authService.getConsumer().subscribe(
      {next:(user)=>{
             console.log(user);
             this.user=user;
            }
      }
    );

  }

  async loadFiles() {
    this.images = [];

    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    }).then(result => {
      this.loadFileData(result.files);
    },
      async (err) => {
        // Folder does not yet exists!
        await Filesystem.mkdir({
          path: IMAGE_DIR,
          directory: Directory.Data,
        });
      }
    );
  }

  // Get the actual base64 data of an image
  // base on the name of the file
  async loadFileData(fileNames: string[]) {
    for (const f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }

  // Little helper
  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async selectImage() {
    const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Camera, Photos or Prompt!
    });

    if (image) {
        this.saveImage(image);
    }
}

// Create a new file from a capture image
async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
        directory: Directory.Data
    });

    // Reload the file list
    // Improve by only loading for the new image and unshifting array!
    this.loadFiles();
}

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        return this.convertBlobToBase64(blob) as unknown as string;
    }
}

// eslint-disable-next-line @typescript-eslint/member-ordering
// convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
//   const reader = new FileReader();
//   reader.onerror = reject;
//   reader.onload = () => {
//       resolve(reader.result);
//   };
//   reader.readAsDataURL(blob);
// });


  // eslint-disable-next-line @typescript-eslint/member-ordering
  convertBlobToBase64(blob: Blob) {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

// Convert the base64 to blob data
// and create  formData with it
// eslint-disable-next-line @typescript-eslint/member-ordering
async startUpload(file: LocalFile) {
  const response = await fetch(file.data);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('file', blob, file.name);
  this.uploadData(formData);
}

// Upload the formData to our API
// eslint-disable-next-line @typescript-eslint/member-ordering
async uploadData(formData: FormData) {


  this.loading = await this.loadingController.create();
  await this.loading.present();

  this.authService.uploadData(formData).pipe(
    finalize(async ()=> await this.loading.dismiss())
  ).subscribe(
    res => {
             this.getConsumer();
             this.presentToast('Upload complete.');
    }
  );
}

// eslint-disable-next-line @typescript-eslint/member-ordering
async deleteImage(file: LocalFile) {
  await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
  });
  this.loadFiles();
  this.presentToast('File removed.');
}


  // eslint-disable-next-line @typescript-eslint/member-ordering
  async openPictureOption(){
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async takePicture(type: string | number) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource[type]
    });
    this.photo = image.webPath;

    const fileName = new Date().getTime() + '.jpeg';

    const response = await fetch(image.webPath);
    const blob = await response.blob();
    console.log('----blob-----'+blob);
    const formData = new FormData();
    formData.append('imageFile',blob,fileName);
    this.uploadData(formData);

  }

}


