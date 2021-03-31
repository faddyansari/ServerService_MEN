import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminSettingsService } from '../../../../../services/adminSettingsService';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-call-permissions',
	templateUrl: './call-permissions.component.html',
	styleUrls: ['./call-permissions.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CallPermissionsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	callSettings: any;
	callSettingsForm: FormGroup;
	loading = false;

	constructor(public _settingsService: AdminSettingsService, private formbuilder: FormBuilder, private snackBar: MatSnackBar,
		private _appStateService : GlobalStateService
		) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Call Settings');
		this.callSettingsForm = formbuilder.group({});
		this.subscriptions.push(this._settingsService.callSettings.subscribe(data => {
			//console.log(data);
			this.callSettings = data;
		}));

	}

	ngOnInit() {

	}

	public SetPermissions(value: string) {
		switch (value) {
			case 'a2a':
				this.callSettings.permissions.a2a = !this.callSettings.permissions.a2a;
				break;
			case 'a2v':
				this.callSettings.permissions.a2v = !this.callSettings.permissions.a2v;
				break;
			case 'v2a':
				this.callSettings.permissions.v2a = !this.callSettings.permissions.v2a;
				break;
		}
	}

	public Submit() {
		this.loading = true;
		this._settingsService
			.setNSPCallSettings(this.callSettings)
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
