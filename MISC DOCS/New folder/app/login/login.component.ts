import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
declare var $: any;
import { GlobalStateService } from '../../services/GlobalStateService'
import { AuthService } from '../../services/AuthenticationService';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterationFormDialogComponent } from '../dialogs/registeration-form-dialog/registeration-form-dialog.component';
import { ForgotPasswordComponent } from '../dialogs/forgot-password/forgot-password.component';
import { ToastNotifications } from '../dialogs/SnackBar-Dialog/toast-notifications.component';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
declare var $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    accessForm: FormGroup;
    subscriptions: Subscription[] = []
    showPassword = false;
    loading = false;
    loadingAccessCode = false;
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    copyRightYear = '';
    Agent: any;
    authCode = false;
    aCode = '';
    incorrect = false;
    tempEmail = '';
    constructor(private _routeService: GlobalStateService,
        public _authService: AuthService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private formbuilder: FormBuilder, ) {


        //Reactive Form Validation
        this.accessForm = formbuilder.group({
            'email': [null,
                [
                    Validators.pattern(this.emailPattern),
                    Validators.required
                ]
            ],
            'password': [null, Validators.required]
        });
        //Request State Boolean To Show Loading Ring
        //On Each Request to Server Request State is Enabled in DataService
        //Note : When Response Finished Call setRequestState(false) in DataService.
        //For this Component _authService is Data Service
        this.subscriptions.push(_authService.getRequestState().subscribe(data => {
            this.loading = data;
            this.loadingAccessCode = data;
            // console.log('After Subscription Loading');
            // console.log(this.loading);
        }));

        this.subscriptions.push(_routeService.getCopyrightYear().subscribe(copyRightYear => {
            this.copyRightYear = copyRightYear;
        }));


        //To Show Notifications For This Component Data Service is Responsible For Pushing Data
        this.subscriptions.push(_authService.getNotification().subscribe(data => {
            this.snackBar.openFromComponent(ToastNotifications, {
                data: {
                    img: data.img,
                    msg: data.msg
                },
                duration: 30000,
                panelClass: ['user-alert', (data.type == 'success') ? 'ok' : 'error']
            })
            // .afterDismissed()
            // .subscribe(() => {
            //     _authService.setNotification('');
            // });
        }));

        this.subscriptions.push(_authService.showAuthCode.subscribe(data => {
            this.authCode = data;
        }));

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })

    }

    public loadRegisterForm() {
        this.subscriptions.push(this.dialog.open(RegisterationFormDialogComponent, {
            panelClass: ['register-form-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(data => {
            //console.log('Register Form Dialog Closed');
            if (data.error == null) {
                this._authService.setNotification('Welcome To BizzChats', 'success', 'ok');
            } else {
            }
        }));
    }

    public Login(form: FormGroup) {

        // console.log('Logging')
        this.loading = true;
        if (form.valid) {
            this._authService.incorrect = false;
            setTimeout(() => {
                this.tempEmail = form.get('email').value;
                this._authService.login(
                    form.get('email').value,
                    form.get('password').value
                );
            }, 1000);

        }

    }

    public SubmitAccessCode() {
        this.loadingAccessCode = true;
        setTimeout(() => {
            if (this.aCode) {
                this._authService.incorrect = false;
                this._authService.SubmitAccessCode(this.aCode.trim());
            }
        }, 1000);
    }
    public forgotPassword() {
        this.dialog.open(ForgotPasswordComponent, {
            panelClass: ['forgot-password-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(data => {
            if (data.error == null) {
                this._authService.setNotification('Your Password Reset Link Has Been Sent To Your Email Successfully', 'success', 'ok');
            } else {
            }
        });
    }

    public ShowPassword() {
        this.showPassword = !(this.showPassword);
      //  console.log(this.showPassword);
    }

    public GoBack(){
        this._authService.showAuthCode.next(false);
    }

}
