import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminSettingsService } from '../../../../../services/adminSettingsService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { AgentService } from '../../../../../services/AgentService';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {
	subscriptions: Subscription[] = [];
	emailNotificationForm: FormGroup;
	windowNotificationsForm: FormGroup;
	emailNotificationSettings : any;
	windowNotificationSettings : any;
	changes = {
		email : false,
		window : false
	}
	loading = false;
	constructor(private _appStateService: GlobalStateService, private formbuilder: FormBuilder ,private snackBar: MatSnackBar,private _adminSettingService: AdminSettingsService,private _agentService: AgentService) {
		_adminSettingService.GetEmailNotificationSettings();
		// _agentService.GetWindowNotificationSettings();

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management')
		this.emailNotificationForm = formbuilder.group({});
		this.subscriptions.push(_adminSettingService.emailNotificationSettings.subscribe(settings => {
			if(settings){
				this.emailNotificationSettings = settings.tickets;
				this.updateEmailSettings(this.emailNotificationSettings);
			}
		}));
		// this.subscriptions.push(_adminSettingService.windowNotificationSettings.subscribe(settings => {
		// 	if(settings){
		// 		this.windowNotificationSettings = settings;
		// 		this.updateWindowNotifSettings(this.windowNotificationSettings);
		// 	}
		// }));

	}

	updateEmailSettings(settings){
		// console.log(settings);
		this.emailNotificationForm = this.formbuilder.group({});
		Object.keys(settings).map(key => {
			this.emailNotificationForm.addControl(key, new FormControl(settings[key], [Validators.required]));
		});
	}
	// updateWindowNotifSettings(settings){
	// 	//	console.log(settings);
	// 	this.windowNotificationsForm = this.formbuilder.group({});
	// 	Object.keys(settings).map(key => {
	// 		this.windowNotificationsForm.addControl(key, new FormControl(settings[key], [Validators.required]));
	// 	});
	// }

	settingsChanged(type){
		this.changes[type] = true;
	}

	submitEmailSettings(){
		this.loading = true;
		this._adminSettingService
			.SetEmailNotificationSettings('tickets',this.emailNotificationForm.value)
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

	// submitWindowSettings(){
	// 	this.loading = true;
	// 	this._agentService.SetWindowNotificationSettings(this.windowNotificationsForm.value).subscribe(response=>{
	// 		this.loading = false;
	// 			if (response.status == 'ok') {
	// 				this.changes['window'] = false;
	// 				this.snackBar.openFromComponent(ToastNotifications, {
	// 					data: {
	// 						img: 'ok',
	// 						msg: 'Settings saved successfully!'
	// 					},
	// 					duration: 5000,
	// 					panelClass: ['user-alert', 'success']
	// 				});
	// 			} else if (response.status == 'error') {
	// 				this.snackBar.openFromComponent(ToastNotifications, {
	// 					data: {
	// 						img: 'warning',
	// 						msg: 'Error!'
	// 					},
	// 					duration: 5000,
	// 					panelClass: ['user-alert', 'error']
	// 				});
	// 			}
	// 			//Do Some Error Logic If Any
	// 			//Check Server Responses For this Event
	// 		}, err => {
	// 			//TO DO ERROR LOGIC
	// 			this.loading = false;
	// 		// });
	// 	});

	// 	// this._adminSettingService
	// 	// 	.SetWindowNotificationSettings(this.windowNotificationsForm.value)
	// 	// 	.subscribe(response => {
	// 	// 		this.loading = false;
	// 	// 		if (response.status == 'ok') {
	// 	// 			this.snackBar.openFromComponent(ToastNotifications, {
	// 	// 				data: {
	// 	// 					img: '/assets/img/icons/svg/ok.svg',
	// 	// 					msg: 'Settings saved successfully!'
	// 	// 				},
	// 	// 				duration: 5000,
	// 	// 				panelClass: ['user-alert', 'success']
	// 	// 			});
	// 	// 		} else if (response.status == 'error') {
	// 	// 			this.snackBar.openFromComponent(ToastNotifications, {
	// 	// 				data: {
	// 	// 					img: '/assets/img/icons/svg/warning.svg',
	// 	// 					msg: 'Error!'
	// 	// 				},
	// 	// 				duration: 5000,
	// 	// 				panelClass: ['user-alert', 'error']
	// 	// 			});
	// 	// 		}
	// 	// 		//Do Some Error Logic If Any
	// 	// 		//Check Server Responses For this Event
	// 	// 	}, err => {
	// 	// 		//TO DO ERROR LOGIC
	// 	// 		this.loading = false;
	// 	// 	});
	// }

	ngOnInit() {
	}

	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
