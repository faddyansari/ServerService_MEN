import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgentService } from '../../../services/AgentService';

@Component({
	selector: 'app-change-password-dialog',
	templateUrl: './change-password-dialog.component.html',
	styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

	subscriptions: Subscription[] = [];
	public changePasswordForm: FormGroup;
	fieldCount = 3;
	email: any;
	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		private formbuilder: FormBuilder,
		private _agentService: AgentService,
		private dialogRef: MatDialogRef<ChangePasswordDialogComponent>) {
		this.fieldCount = data.fieldCount;
		this.email = data.email;
		// console.log(this.fieldCount);

		if (data.fieldCount == 2) {
			this.changePasswordForm = formbuilder.group({
				'newPassword': ['', [
					Validators.required,
					Validators.minLength(8)
				]],
				'confirmPassword': ['', [
					Validators.required
				], this.matchPasswords.bind(this)]
			});
		} else {
			this.changePasswordForm = formbuilder.group({
				'oldPassword': ['', [
					Validators.required
				], this.validateCurrentPassword.bind(this)],
				'newPassword': ['', [
					Validators.required,
					Validators.minLength(8)
				]],
				'confirmPassword': ['', [
					Validators.required
				], this.matchPasswords.bind(this)]
			});
		}
	}

	ngOnInit() {
	}


	Submit() {
		this._agentService.changePassword(this.email, this.changePasswordForm.get('newPassword').value).subscribe(status => {
			this.dialogRef.close({
				status: (status) ? 'success' : 'error'
			});
		})
		
	}


	validateCurrentPassword(control: FormControl) {
		return Observable.timer(2000).switchMap(() => {
			return this._agentService.ValidatePassword(this.email,control.value).map(res => {
				return res ? null : {incorrect: true}
			})
		})
	}

	matchPasswords(control: FormControl) {
		return Observable.timer(2000).switchMap(() => {
			if(control.value !==  this.changePasswordForm.get('newPassword').value){
				return Observable.of({incorrect : true, same: false});
			}else if(this.changePasswordForm.get('oldPassword') && control.value == this.changePasswordForm.get('oldPassword').value){
				return Observable.of({incorrect : false, same: true});
			}
			else{
				return Observable.of(null);
			}
		})
	}

}
