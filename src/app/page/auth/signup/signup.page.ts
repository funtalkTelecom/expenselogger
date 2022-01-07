import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  form: FormGroup;
  type=true;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.form = new FormGroup({
      username: new FormControl(null,{validators:[Validators.required]}),
      email: new FormControl(null,{validators:[Validators.required]}),
      password: new FormControl(null,{validators:[Validators.required,Validators.minLength(6)]}),
    });
  }

  changeType(){
    this.type=!this.type;
  }

  onSubmit(){

    console.log(this.form.value);

    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }
  }

}
