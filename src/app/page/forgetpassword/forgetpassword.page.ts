import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-forgetpassword',
    templateUrl: './forgetpassword.page.html',
    styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage {

    forgotPasswordForm: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    constructor() {
    }

    onSubmit(): void {
        console.log('Submitting Reset Password Request');
        console.log(this.forgotPasswordForm.value);
    }
}
