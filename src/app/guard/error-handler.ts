import { ToastController } from '@ionic/angular';
import { ErrorHandler, Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private toastCtrl: ToastController) { }

  async handleError(error: any): Promise<any> {

    let errorMsg;
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection;
    }

    Network.getStatus().then(async res=>{

                if(res.connected){
                  errorMsg=error?.message|| 'Undefined client error!';
                }else{
                  errorMsg='Network was disconnected!';
                }

                const toast = await this.toastCtrl.create({
                  message: errorMsg,
                  duration: 2000,
                  position: 'middle'
                });
                await toast.present();

    });

    console.error('Error from global error handler', error);

  }



}
