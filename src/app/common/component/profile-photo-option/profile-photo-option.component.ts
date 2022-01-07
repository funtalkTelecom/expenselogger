import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-photo-option',
  templateUrl: './profile-photo-option.component.html',
  styleUrls: ['./profile-photo-option.component.scss'],
})
export class ProfilePhotoOptionComponent implements OnInit {

  constructor(
    private modalController: ModalController
   ) { }

   ngOnInit(){}

  closeModal(){
    this.modalController.dismiss(null, 'backdrop');
  }

  startCapture(type) {
    this.modalController.dismiss(type, 'select');
  }

}
