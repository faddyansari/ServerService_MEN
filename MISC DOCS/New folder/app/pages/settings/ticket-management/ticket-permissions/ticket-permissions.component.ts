import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSettingsService } from '../../../../../services/adminSettingsService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
  selector: 'app-ticket-permissions',
  templateUrl: './ticket-permissions.component.html',
	styleUrls: ['./ticket-permissions.component.css'],
	encapsulation : ViewEncapsulation.None
})
export class TicketPermissionsComponent implements OnInit {

  subscriptions: Subscription[] = [];
  ticketSettings: any;
  ticketSettingsForm: FormGroup;
  loading = false;
  hours='';

  constructor(public _settingsService: AdminSettingsService, private formbuilder: FormBuilder, private snackBar: MatSnackBar,private _appStateService : GlobalStateService) {
	this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Ticket Management');
	this.ticketSettingsForm = formbuilder.group({});
    this.subscriptions.push(this._settingsService.ticketSettings.subscribe(data => {
      //console.log(data);
      if (!data) this._settingsService.GetTicketSettings();
      else this.ticketSettings = data;

    }));
  }

  public SetPermissions(value: string) {
		switch (value) {
			case 'allowedAgentAvailable':
				this.ticketSettings.allowedAgentAvailable = !this.ticketSettings.allowedAgentAvailable;
				break;

				case 'allowAssignment':
				this.ticketSettings.allowAssignment = !this.ticketSettings.allowAssignment;
				break;
		}
	}

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  public Submit() {
	  //console.log(this.hours);
		this.loading = true;
		this._settingsService
			.SetTicketSettings(this.ticketSettings)
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
