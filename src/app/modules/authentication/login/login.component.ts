import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { GenericValidator } from '../../../shred/validations/generic-validators'
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    loginForm: FormGroup;

    genericValidator: GenericValidator;
    displayMessage: any = {};
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router,
        private snackbarService: MatSnackBar,
        private authService: AuthService
    ) {
        this.genericValidator = new GenericValidator({
            'userName': {
                'required': 'This field is required.'
            },
            'password': {
                'required': 'This field is required.'
            }
        })
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.loginForm = this.fb.group({
            id: 0,
            userName: [null, Validators.required],
            password: [null, Validators.required]
        })
    }

    ngAfterViewInit() {
        this.validation();
    }

    private validation() {
        this.genericValidator
            .initValidationProcess(this.loginForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    saveChanges() {
        this.authService.getUserDetail(this.loginForm.value).subscribe(_ => {
            if (_ !==undefined) {
                this.router.navigate(['/main']);
                this.snackbarService.open('Login Success.', 'Close', {
                    duration: 1500,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,

                });
            } else {
                this.snackbarService.open('You entered username and password not matched.', 'Close', {
                    duration: 1500,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,

                });
            }
        });
    }

    forgotPassword() {
        const dialogRef = this.dialog.open(ForgotPasswordComponent, {
            height: '330px',
            width: '530px'
        });

    }

    signUp() {
        setTimeout(() => {
            this.router.navigate(['/signup']);
        }, 400)
    }
    
}
