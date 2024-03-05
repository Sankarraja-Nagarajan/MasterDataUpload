import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { snackbarStatus } from '../Enum/enum';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ServicesService } from '../../Services/services.service';
import { CommonSnackBarService } from '../../Services/common-snack-bar.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginPage: FormGroup;
  positions = NbGlobalPhysicalPosition;
  index: any;
  constructor(private _fb: FormBuilder,
    private _service: ServicesService,
    private _snack: CommonSnackBarService,
    private toastrService: NbToastrService,
    private _router : Router
  ) {
    this.loginPage = _fb.group({
      userId: ['', Validators.required],
      passWord: ['', Validators.required],
    });
  }
  login() {
    const name = this.loginPage.value.userId.toLowerCase()
    if (this._service.userName == name && this._service.passWord == this.loginPage.value.passWord) 
    {
      this._router.navigate(['/master-data-upload/workflows']);
    this._snack.openSnackbar('Succesfully Login',snackbarStatus.Success);
    }
     else if (this._service.userName != name)
       {
        this._snack.openSnackbar('Invalid UserId', snackbarStatus.Danger)
       }
      else if(this._service.passWord!= this.loginPage.value.passWord)
       {
        this._snack.openSnackbar('Invalid Password', snackbarStatus.Danger)
       }
    }
 
    public showPassword: boolean = false;

    public togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
    }

}
