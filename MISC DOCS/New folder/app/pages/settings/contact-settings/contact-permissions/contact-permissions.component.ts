import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminSettingsService } from '../../../../../services/adminSettingsService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-contact-permissions',
	templateUrl: './contact-permissions.component.html',
	styleUrls: ['./contact-permissions.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContactPermissionsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	contactSettings: any;
	contactSettingsForm: FormGroup;
	loading = false;

	constructor(public _settingsService: AdminSettingsService, private formbuilder: FormBuilder, private snackBar: MatSnackBar,private _appStateService : GlobalStateService) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Contact Settings');
		this.contactSettingsForm = formbuilder.group({});
		this.subscriptions.push(this._settingsService.contactSettings.subscribe(data => {
			//console.log(data);
			this.contactSettings = data;
		}));

	}

	ngOnInit() {
	}

	public SetPermissions(value: string) {
		switch (value) {
			case 'levelBased':
				this.contactSettings.permissions.levelBased = !this.contactSettings.permissions.levelBased;
				// console.log(this.contactSettings.permissions.levelBased);
				break;
		}
	}

	public Submit() {
		// console.log(this.contactSettings);
		this.loading = true;
		this._settingsService
			.setNSPContactSettings('permissions', this.contactSettings.permissions)
			.subscribe(response => {
				this.loading = false;
				if (response.status == 'ok') {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Settings saved successfully!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});
				} else if (response.status == 'error') {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'warning',
							msg: 'Error!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'error']
					});
				}
				//Do Some Error Logic If Any
				//Check Server Responses For this Event
			}, err => {
				//TO DO ERROR LOGIC
				this.loading = false;
			});
	}

}
