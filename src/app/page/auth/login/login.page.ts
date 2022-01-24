import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segmentValue='1';
  form: FormGroup;
  constructor() {

    Device.getInfo().then((deviceInfo) => {
      console.log(deviceInfo);
      if (deviceInfo.platform === 'ios') {
          Keyboard.setResizeMode({mode: KeyboardResize.None});
          Keyboard.addListener('keyboardWillShow', () => {
              console.log('Keyboard Event');
          });
      }
  });
  }

  ngOnInit() {
  }

  initForm(){

  }

  segmentChanged(event){

    this.segmentValue=event.detail.value;

  }

}
