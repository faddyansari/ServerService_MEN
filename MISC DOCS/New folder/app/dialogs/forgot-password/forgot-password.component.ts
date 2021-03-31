import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form, FormControl } from '@angular/forms';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';



@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {

	subscriptions: Subscription[] = []
	forgot_email: string = '';
	loading: boolean;
	disable: boolean = false;
	server: string;
	errorMsg = '';

	public forgotpswdForm: FormGroup;
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	constructor(
		private http: Http,
		private formbuilder: FormBuilder,
		private dialogRef: MatDialogRef<ForgotPasswordComponent>,
		public snackBar: MatSnackBar,
		private _authService: AuthService
	) {
		this.forgotpswdForm = formbuilder.group({
			'email':
				[
					null,
					[
						Validators.required,
						Validators.pattern(this.emailPattern)
					]
				]
		});

		this.subscriptions.push(this._authService.getServer().subscribe(serverAddress => {
			this.server = serverAddress;
		}));

	}

	ngOnInit() {
	}

	public SubmitForgotPassword() {
		//console.log(this.forgot_email);
		//console.log("in submit forget password");
		if (this.forgotpswdForm.valid) {
			//Check if forgot password feature is enabled
			this._authService.isForgotPasswordEnabled(this.forgot_email).subscribe(enabled => {
				if (enabled) {
					this.subscriptions.push(this.http.post(this.server + "/agent/resetpswd/", {
						email: this.forgot_email
					}
						, { withCredentials: true }).subscribe(response => {
							this._authService.setRequestState(false);
							this.dialogRef.close({ error: null, msg: "Successfull" });
						}, err => {
							console.log(err.status);
							if (err.status == 403) {
								this._authService.setRequestState(false);
								this.snackBar.open("Invalid Email", null, {
									duration: 3000,
									panelClass: ['user-alert', 'error']
								});
							}
						}));
				}else{
					// alert()
					this.showErrorMessage('Forgot password feature has been disabled.');
				}
			})
		}

	}

	public changeOccured(val: string) {
	}

	showErrorMessage(msg){
		this.errorMsg = msg;
		setTimeout(() => {
			this.errorMsg = '';
		}, 3000);
	}

}
