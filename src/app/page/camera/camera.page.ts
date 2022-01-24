import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit,AfterViewInit,OnDestroy {

  photo: SafeResourceUrl;

  scanResult: string = null;
  scanActive = false;

  constructor(private domSanitizer: DomSanitizer,
              private  alertController: AlertController) { }


  ngAfterViewInit(): void {
    BarcodeScanner.prepare();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.stopBarcode();
  }

  async takePicture(){

    const image= await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });

    this.photo= this.domSanitizer.bypassSecurityTrustResourceUrl(image &&(image.dataUrl));

  }


  async startBarcode(){

    const allowed =await this.checkPermission();

    if(allowed){

        this.scanActive=true;
        BarcodeScanner.hideBackground(); // make background of WebView transparent
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        // if the result has content
        if (result.hasContent) {
          console.log('---barcode--result------'+result.content); // log the raw scanned content
          this.scanResult=result.content;
          this.scanActive=false;
        }
    }

  }

  stopBarcode(){
    this.scanActive=false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  async checkPermission(){

    return new Promise( async (resolve, reject)=>{

        // check if user already granted permission
        const status = await BarcodeScanner.checkPermission({ force: false });

        if (status.granted) {  return resolve(true); } // user granted permission
        if (status.denied) {

          const alert = await this.alertController.create({
            header: 'No permission!',
            message: 'Please allow camera in your setting!',
            buttons: [
              {
                text: 'No',
                role: 'cancel'
              }, {
                text: 'Open setting',
                handler: () => {
                  resolve(false);
                  BarcodeScanner.openAppSettings();
                }
              }
            ]
          });

          await alert.present();

        }// user denied permission
        // system requested the user for permission during this call
        if (status.asked) {   }    // only possible when force set to true

        if (status.neverAsked) {  // user has not been requested this permission before
                                  // it is advised to show the user some sort of prompt
                                  // this way you will not waste your only chance to ask for the permission
          const c = confirm('We need your permission to use your camera to be able to scan barcodes');
          if (!c) {   return resolve(false); }
        }
        if (status.restricted || status.unknown) {
          return resolve(false);   // ios only    probably means the permission has been denied
        }
        // user has not denied permission
        // but the user also has not yet granted the permission
        // so request it
        const statusRequest = await BarcodeScanner.checkPermission({ force: true });
        if (statusRequest.asked) {   }// system requested the user for permission during this call    only possible when force set to true
        if (statusRequest.granted) {     return resolve(true);    }  // the user did grant the permission now

        return resolve(false); // user did not grant the permission, so he must have declined the request

    });

  }

}
